'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { updateVideo } from '../actions/video.actions';
import { VIDEO_CATEGORIES } from '../schemas/video.schema';
import { z } from 'zod';
import type { Video } from '../types';

const editVideoSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(100),
  description: z.string().max(1000).optional(),
  category: z.enum(VIDEO_CATEGORIES),
});

type EditVideoInput = z.infer<typeof editVideoSchema>;

export function EditVideoForm({ video }: { video: Video }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<EditVideoInput>({
    resolver: zodResolver(editVideoSchema),
    defaultValues: {
      title: video.title,
      description: video.description ?? '',
      category: video.category as EditVideoInput['category'],
    },
  });

  async function onSubmit(data: EditVideoInput) {
    setServerError(null);
    const result = await updateVideo(video.id, data);

    if (!result.success) {
      setServerError(result.error ?? 'Error al guardar');
      return;
    }

    router.push('/dashboard');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title">Título</FieldLabel>
              <Input {...field} id="title" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">Descripción</FieldLabel>
              <Textarea {...field} id="description" rows={4} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="category">Categoría</FieldLabel>
              <select
                {...field}
                id="category"
                className="h-9 rounded-md border border-white/20 bg-white/5 px-3 text-sm text-[var(--tb-paper)]"
              >
                {VIDEO_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </FieldGroup>
    </form>
  );
}