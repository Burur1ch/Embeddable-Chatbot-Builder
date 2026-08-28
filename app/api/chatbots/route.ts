import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { checkFeatureAccess } from '@/lib/billing/feature-gating';
import { getUserPlanUsage } from '@/lib/billing/usage';

const createChatbotSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional().default(''),
  systemPrompt: z.string().max(4000).optional(),
  welcomeMessage: z.string().max(300).optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a hex color')
    .optional(),
});

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('chatbots')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ chatbots: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createChatbotSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const usage = await getUserPlanUsage(supabase, user.id);
  const access = checkFeatureAccess(usage, 'create_chatbot');

  if (!access.allowed) {
    return NextResponse.json({ error: access.reason }, { status: 403 });
  }

  const { name, description, systemPrompt, welcomeMessage, primaryColor } = parsed.data;

  const { data, error } = await supabase
    .from('chatbots')
    .insert({
      user_id: user.id,
      name,
      description,
      ...(systemPrompt ? { system_prompt: systemPrompt } : {}),
      ...(welcomeMessage ? { welcome_message: welcomeMessage } : {}),
      ...(primaryColor ? { primary_color: primaryColor } : {}),
      status: 'published',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ chatbot: data }, { status: 201 });
}
