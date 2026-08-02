import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';
import { PageBackground } from '@/components/shared/page-background';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <PageBackground src="/images/password.jpg" />
  <div className="glass w-full max-w-sm space-y-6 rounded-2xl p-8">
        <div className="space-y-2 text-center">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-[var(--tb-paper)]">Recuperar contraseña</h1>
          <p className="text-sm text-muted-foreground">
            Te enviaremos un correo con instrucciones.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}