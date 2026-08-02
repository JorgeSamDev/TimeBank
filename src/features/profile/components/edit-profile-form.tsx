'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AvatarUpload } from './avatar-upload';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError, FieldGroup, FieldLabel, FieldDescription } from '@/components/ui/field';
import { updateProfile } from '../actions/profile.actions';
import { editProfileSchema, type EditProfileInput } from '../schemas/profile.schema';
import type { PublicProfile } from '../types';

// El form maneja "skills" como texto separado por comas para simplificar la UI,
// y lo convierte a array antes de mandarlo al schema/action.
type FormValues = Omit<EditProfileInput, 'skills'> & { skills: string };

export function EditProfileForm({ initialProfile }: { initialProfile: PublicProfile | null }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      username: initialProfile?.username ?? '',
      fullName: initialProfile?.fullName ?? '',
      bio: initialProfile?.bio ?? '',
      city: initialProfile?.city ?? '',
      skills: initialProfile?.skills.join(', ') ?? '',
    },
  });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    setSuccess(false);

    const skillsArray = data.skills
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    const parsed = editProfileSchema.safeParse({ ...data, skills: skillsArray });

    if (!parsed.success) {
      setServerError(parsed.error.issues[0]?.message ?? 'Revisa los datos ingresados.');
  return;
      }

    const result = await updateProfile(parsed.data);

    if (!result.success) {
      setServerError(result.error ?? 'Ocurrió un error al guardar.');
      return;
    }

    setSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <AvatarUpload currentAvatarUrl={initialProfile?.avatarUrl ?? null} />
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="username">Nombre de usuario</FieldLabel>
              <Input {...field} id="username" aria-invalid={fieldState.invalid} />
              <FieldDescription>Se usa en tu URL pública: /perfil/tu-usuario</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="fullName"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="fullName">Nombre completo</FieldLabel>
              <Input {...field} id="fullName" aria-invalid={fieldState.invalid} />
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
              <Textarea {...field} id="bio" aria-invalid={fieldState.invalid} rows={4} />
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
              <Input {...field} id="city" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="skills"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="skills">Habilidades</FieldLabel>
              <Input {...field} id="skills" aria-invalid={fieldState.invalid} />
              <FieldDescription>Sepáralas con comas, ej: guitarra, cocina, inglés</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        {success && <p className="text-sm text-emerald-600">Perfil actualizado correctamente.</p>}

        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </FieldGroup>
    </form>
  );
}