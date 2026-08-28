import { createClient, SupabaseClient } from '@supabase/supabase-js';

let serverInstance: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient {
  if (serverInstance) {
    return serverInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase server credentials');
  }

  serverInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return serverInstance;
}

// Lazy proxy to avoid initialization at build time
export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(target: any, prop: string | symbol): any {
    const client = getSupabaseServer();
    return (client as any)[prop];
  },
});
