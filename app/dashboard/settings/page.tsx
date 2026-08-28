import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { SettingsForm } from '@/components/dashboard/settings-form';

export default async function SettingsPage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase.from('profiles').select('name').eq('user_id', user.id).maybeSingle();

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your account and preferences</p>
      </div>

      <SettingsForm initialName={profile?.name ?? ''} email={user.email ?? ''} />
    </div>
  );
}
