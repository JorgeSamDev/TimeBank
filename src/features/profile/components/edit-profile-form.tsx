'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError, FieldGroup, FieldLabel, FieldDescription } from '@/components/ui/field';
import { upsertPublicProfile } from '../actions/profile.actions';
import { publicProfileFormSchema, type PublicProfileFormInput } from '../schemas/profile.schema';
import type { PublicProfile } from '../types';

// El form maneja "skills" como texto separado por comas para simplificar la UI,
// y lo convierte a array antes de mandarlo al schema/action.
type FormValues = PublicProfileFormInput;

export function EditProfileForm({ initialProfile }: { initialProfile: PublicProfile | null }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(publicProfileFormSchema),
    defaultValues: {
      username: initialProfile?.username ?? '',
      bio: initialProfile?.bio ?? '',
      city: initialProfile?.city ?? '',
      avatarUrl: initialProfile?.avatarUrl ?? '',
      skillsText: initialProfile?.skills?.join(', ') ?? '',
    },
  });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    setSuccess(false);

    const skills = data.skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const result = await upsertPublicProfile({
      username: data.username,
      bio: data.bio,
      city: data.city,
      avatarUrl: data.avatarUrl,
      skills,
    });

    if (!result.success) {
      setServerError(result.error ?? 'Ocurrió un error al guardar tu perfil.');
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="username">Nombre de usuario</FieldLabel>
              <Input {...field} id="username" placeholder="ej. juanperez" aria-invalid={fieldState.invalid} />
              <FieldDescription>
                Así se verá tu URL: /perfil/{field.value || 'tu-usuario'}
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="avatarUrl"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="avatarUrl">URL de foto de perfil</FieldLabel>
              <Input {...field} id="avatarUrl" placeholder="https://..." aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="city"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="city">Ciudad</FieldLabel>
              <Input {...field} id="city" placeholder="ej. Toluca, México" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="bio"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="bio">Biografía</FieldLabel>
              <Textarea {...field} id="bio" placeholder="Cuéntale a la comunidad sobre ti" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="skillsText"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="skillsText">Habilidades</FieldLabel>
              <Input {...field} id="skillsText" placeholder="ej. plomería, clases de guitarra, diseño" />
              <FieldDescription>Sepáralas con comas.</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        {success && <p className="text-sm text-emerald-600">¡Perfil guardado!</p>}

        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Guardando...' : 'Guardar perfil'}
        </Button>
      </FieldGroup>
    </form>
  );
}
