import { supabaseServer } from '@/lib/supabase/server';
import { generateEmbedding } from '@/lib/ai/openai';
import { chunkText } from './parser';

/**
 * Process a document: extract text, chunk it, generate embeddings, and store in database
 */
export async function processDocument(
  documentId: string,
  chatbotId: string,
  documentText: string,
  metadata?: Record<string, any>
) {
  try {
    // Update document status to processing
    await supabaseServer.from('documents').update({ status: 'processing' }).eq('id', documentId);

    // Split document into chunks
    const chunks = chunkText(documentText);

    // Update status to indexing
    await supabaseServer.from('documents').update({ status: 'indexing' }).eq('id', documentId);

    // Generate embeddings and store chunks
    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk.content);

      const { error } = await supabaseServer.from('document_chunks').insert({
        document_id: documentId,
        chatbot_id: chatbotId,
        content: chunk.content,
        embedding: embedding,
        metadata: metadata || { chunked_at: new Date().toISOString() },
        chunk_index: chunk.chunkIndex,
      });

      if (error) {
        console.error('Error storing chunk:', error);
        throw error;
      }
    }

    // Mark document as ready
    await supabaseServer.from('documents').update({ status: 'ready' }).eq('id', documentId);

    return { success: true, chunkCount: chunks.length };
  } catch (error) {
    console.error('Error processing document:', error);

    // Mark document as failed
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await supabaseServer
      .from('documents')
      .update({ status: 'failed', error_message: errorMessage })
      .eq('id', documentId);

    throw error;
  }
}

/**
 * Perform a vector similarity search to retrieve relevant document chunks
 */
export async function searchDocumentChunks(
  chatbotId: string,
  queryEmbedding: number[],
  limit: number = 5
) {
  const { data, error } = await supabaseServer.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_count: limit,
    filter: { chatbot_id: chatbotId },
  });

  if (error) {
    console.error('Vector search error:', error);
    // Fallback to basic similarity search
    return await fallbackSearch(chatbotId, queryEmbedding, limit);
  }

  return data || [];
}

/**
 * Fallback search using cosine similarity in SQL
 * This is less efficient but works without RPC functions
 */
async function fallbackSearch(chatbotId: string, queryEmbedding: number[], limit: number) {
  // Use raw SQL for vector similarity search
  const { data, error } = await supabaseServer.from('document_chunks').select('*').eq('chatbot_id', chatbotId);

  if (error) {
    console.error('Fallback search error:', error);
    return [];
  }

  // Sort by cosine similarity (approximate)
  return (data || [])
    .map((chunk: any) => ({
      ...chunk,
      similarity: cosineSimilarity(chunk.embedding, queryEmbedding),
    }))
    .sort((a: any, b: any) => b.similarity - a.similarity)
    .slice(0, limit);
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Create an RPC function in Supabase for vector search
 * Run this in the Supabase SQL editor after creating the tables
 */
export const createVectorSearchFunction = `
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector,
  match_count int,
  filter jsonb
) RETURNS TABLE (
  id uuid,
  document_id uuid,
  chatbot_id uuid,
  content text,
  metadata jsonb,
  similarity float
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.chatbot_id,
    dc.content,
    dc.metadata,
    (dc.embedding <=> query_embedding) * -1 as similarity
  FROM document_chunks dc
  WHERE
    (filter::jsonb->>'chatbot_id')::uuid IS NULL
    OR dc.chatbot_id = (filter::jsonb->>'chatbot_id')::uuid
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
`;
