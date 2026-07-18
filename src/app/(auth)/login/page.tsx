import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import { LoginForm } from '@/features/auth/components/login-form';

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
          <p className="text-sm text-muted-foreground">Bienvenido de vuelta a TimeBank.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}