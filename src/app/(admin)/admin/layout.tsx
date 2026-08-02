import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  if (!admin) {
    redirect('/dashboard');
  }

  return <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10">{children}</div>;
}