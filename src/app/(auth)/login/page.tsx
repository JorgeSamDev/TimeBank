import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import { LoginForm } from '@/features/auth/components/login-form';
import { PageBackground } from '@/components/shared/page-background';

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <PageBackground src="/images/login.jpg" />
  <div className="glass w-full max-w-sm space-y-6 rounded-2xl p-8">
        <div className="space-y-2 text-center">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-[var(--tb-paper)]">Iniciar sesión</h1>
          <p className="text-sm text-muted-foreground">Bienvenido de vuelta a TimeBank.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}