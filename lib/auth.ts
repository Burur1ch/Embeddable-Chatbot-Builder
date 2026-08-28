import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { redirect } from 'next/navigation';

/** Returns the current user, or null if not authenticated. */
export async function getUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Returns the current user or redirects to /login. Use in server components/pages. */
export async function requireUser() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}
