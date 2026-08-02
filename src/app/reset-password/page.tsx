import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Nueva contraseña</h1>
          <p className="text-sm text-muted-foreground">Ingresa tu nueva contraseña.</p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}