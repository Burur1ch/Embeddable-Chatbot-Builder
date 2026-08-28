import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

type RouteParams = { params: Promise<{ id: string }> };

/**
 * Public, unauthenticated endpoint used by the chat widget and public test
 * page. Only exposes the minimum fields needed to render the widget UI -
 * never the system prompt, documents, or any other user's data.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const { data: chatbot, error } = await supabaseServer
    .from('chatbots')
    .select('id, name, welcome_message, primary_color, status')
    .eq('id', id)
    .eq('status', 'published')
    .single();

  if (error || !chatbot) {
    return NextResponse.json({ error: 'Chatbot not found' }, { status: 404, headers: CORS_HEADERS });
  }

  return NextResponse.json({ chatbot }, { headers: CORS_HEADERS });
}
