'use client';

import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { requestPasswordReset } from '../actions/auth.actions';
import { forgotPasswordSchema, type ForgotPasswordInput } from '../schemas/auth.schema';

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const { control, handleSubmit, formState } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setServerError(null);
    const result = await requestPasswordReset(data);

    if (!result.success) {
      setServerError(result.error ?? 'Ocurrió un error');
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <p className="text-sm text-muted-foreground">
        Si el correo existe en nuestro sistema, te enviamos un link para restablecer tu contraseña.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
              <Input {...field} id="email" type="email" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Enviando...' : 'Enviar link de recuperación'}
        </Button>

        <Link href="/login" className="text-sm underline">
          Volver a iniciar sesión
        </Link>
      </FieldGroup>
    </form>
  );
}