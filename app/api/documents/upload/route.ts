import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { extractTextFromDocument } from '@/lib/documents/parser';
import { processDocument } from '@/lib/documents/rag';
import { getAIErrorMessage } from '@/lib/ai/openai';
import { checkFeatureAccess } from '@/lib/billing/feature-gating';
import { getUserPlanUsage } from '@/lib/billing/usage';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const chatbotId = formData.get('chatbotId') as string;

    if (!file || !chatbotId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the chatbot belongs to this user (RLS also enforces this)
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('id')
      .eq('id', chatbotId)
      .eq('user_id', user.id)
      .single();

    if (!chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    // Validate file type
    const allowedTypes = ['text/plain', 'text/markdown', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    // Enforce plan limits server-side
    const usage = await getUserPlanUsage(supabase, user.id);
    const access = checkFeatureAccess(usage, 'upload_document');
    if (!access.allowed) {
      return NextResponse.json({ error: access.reason }, { status: 403 });
    }

    const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${user.id}/${chatbotId}/${crypto.randomUUID()}-${safeFilename}`;

    // Create document record (as the authenticated user, respects RLS)
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        chatbot_id: chatbotId,
        user_id: user.id,
        filename: file.name,
        storage_path: storagePath,
        file_type: file.type,
        status: 'uploading',
        size: file.size,
      })
      .select()
      .single();

    if (docError) {
      return NextResponse.json({ error: docError.message }, { status: 400 });
    }

    let { error: storageError } = await supabaseServer.storage
      .from('documents')
      .upload(storagePath, file, { contentType: file.type || 'application/octet-stream', upsert: false });

    if (storageError?.message.toLowerCase().includes('bucket not found')) {
      const { error: bucketError } = await supabaseServer.storage.createBucket('documents', {
        public: false,
        fileSizeLimit: '10MB',
      });

      if (!bucketError || bucketError.message.toLowerCase().includes('already exists')) {
        const retry = await supabaseServer.storage
          .from('documents')
          .upload(storagePath, file, { contentType: file.type || 'application/octet-stream', upsert: false });
        storageError = retry.error;
      }
    }

    if (storageError) {
      console.error('Document storage error:', storageError.message);
      await supabase
        .from('documents')
        .update({ status: 'failed', error_message: 'Could not store the uploaded file.' })
        .eq('id', document.id);
      return NextResponse.json({ error: 'Could not store the uploaded file.' }, { status: 500 });
    }

    // Extract text from document
    let documentText: string;
    try {
      documentText = await extractTextFromDocument(file);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to extract text';
      await supabaseServer
        .from('documents')
        .update({ status: 'failed', error_message: errorMessage })
        .eq('id', document.id);

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Process document (chunk + embed + store). Uses the service-role client
    // since it must write document_chunks with embeddings; ownership was
    // already verified above.
    try {
      await processDocument(document.id, chatbotId, documentText, {
        filename: file.name,
        uploaded_at: new Date().toISOString(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process document';
      console.error('Document processing error:', errorMessage);
      const providerStatus = (error as { status?: number })?.status;
      const status = providerStatus === 429 || providerStatus === 402 ? providerStatus : 500;
      return NextResponse.json(
        { error: status === 429 || status === 402 ? getAIErrorMessage(error) : 'Could not process the uploaded document.' },
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      documentId: document.id,
      message: 'Document uploaded and processing',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'An error occurred during upload' },
      { status: 500 }
    );
  }
}
