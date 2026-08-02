import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Recuperar contraseña</h1>
          <p className="text-sm text-muted-foreground">
            Te enviaremos un correo con instrucciones.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}