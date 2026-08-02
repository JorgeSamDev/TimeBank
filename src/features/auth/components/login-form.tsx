'use client';

import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { signIn } from '../actions/auth.actions';
import { signInSchema, type SignInInput } from '../schemas/auth.schema';

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: SignInInput) {
    setServerError(null);
    const result = await signIn(data);

    // Si signIn tiene éxito, hace redirect() y no llega a esta línea.
    if (result && !result.success) {
      setServerError(result.error ?? 'Correo o contraseña incorrectos.');
    }
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
              <Input
                {...field}
                id="email"
                type="email"
                aria-invalid={fieldState.invalid}
                autoComplete="email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <Input
                {...field}
                id="password"
                type="password"
                aria-invalid={fieldState.invalid}
                autoComplete="current-password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Link href="/forgot-password" className="text-sm text-muted-foreground underline">
            ¿Olvidaste tu contraseña? </Link>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>

        <p className="text-sm text-muted-foreground">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="underline">
            Regístrate
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}