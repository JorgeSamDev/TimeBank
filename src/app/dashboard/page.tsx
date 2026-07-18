import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import { signOut } from '@/features/auth/actions/auth.actions';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-lg">Dashboard — próximamente</p>
      <form action={signOut}>
        <Button type="submit" variant="outline">
          Cerrar sesión
        </Button>
      </form>
    </div>
  );
}