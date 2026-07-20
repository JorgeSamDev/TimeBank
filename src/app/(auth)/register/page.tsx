import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import { RegisterForm } from '@/features/auth/components/register-form';

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Crear cuenta</h1>
          <p className="text-sm text-muted-foreground">
            Empieza a compartir y aprender en TimeBank.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}