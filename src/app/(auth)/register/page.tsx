import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import { PageBackground } from '@/components/shared/page-background';
import { RegisterForm } from '@/features/auth/components/register-form';

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/catalogo');
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <PageBackground src="/images/register.jpg" />
  <div className="glass w-full max-w-sm space-y-6 rounded-2xl p-8">
    
        <div className="space-y-2 text-center">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-[var(--tb-paper)]">Crear cuenta</h1>
          <p className="text-sm text-muted-foreground">
            Empieza a compartir y aprender en TimeBank.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}