import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { supabaseServer } from '@/lib/supabase/server';

/**
 * Deletes the current user's account and all owned data (via ON DELETE
 * CASCADE foreign keys). Requires an active session; uses the service-role
 * client only for the final auth.admin.deleteUser call, which anon/session
 * clients cannot perform.
 */
export async function DELETE() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabaseServer.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}
