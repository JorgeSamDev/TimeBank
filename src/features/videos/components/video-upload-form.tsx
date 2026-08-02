'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { createVideo } from '../actions/video.actions';
import { createVideoSchema, VIDEO_CATEGORIES, type CreateVideoInput } from '../schemas/video.schema';

const MAX_FILE_SIZE_MB = 500;

type FormMetadata = Omit<CreateVideoInput, 'videoUrl' | 'durationSeconds'>;

export function VideoUploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'reading' | 'uploading' | 'saving'>('idle');
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<FormMetadata>({
    resolver: zodResolver(createVideoSchema.omit({ videoUrl: true, durationSeconds: true })),
    defaultValues: { title: '', description: '', category: undefined },
  });

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    setError(null);
    setDuration(null);

    if (!selected) return;

    if (!selected.type.startsWith('video/')) {
      setError('Selecciona un archivo de video válido');
      return;
    }

    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`El video no debe superar ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setUploadProgress('reading');

    // Truco para medir la duración real: cargamos el archivo en un <video>
    // oculto en memoria y leemos su propiedad .duration cuando esté listo.
    const videoEl = document.createElement('video');
    videoEl.preload = 'metadata';
    videoEl.onloadedmetadata = () => {
      URL.revokeObjectURL(videoEl.src);
      setDuration(Math.round(videoEl.duration));
      setFile(selected);
      setUploadProgress('idle');
    };
    videoEl.onerror = () => {
      setError('No se pudo leer el archivo de video');
      setUploadProgress('idle');
    };
    videoEl.src = URL.createObjectURL(selected);
  }

  async function onSubmit(metadata: FormMetadata) {
    setError(null);

    if (!file || !duration) {
      setError('Selecciona un video primero');
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    setUploadProgress('uploading');

    const extension = file.name.split('.').pop();
    const path = `${user.id}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage.from('videos').upload(path, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploadProgress('idle');
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('videos').getPublicUrl(path);

    setUploadProgress('saving');

    const result = await createVideo({
      ...metadata,
      videoUrl: publicUrl,
      durationSeconds: duration,
    });

    setUploadProgress('idle');

    if (!result.success) {
      setError(result.error ?? 'Error al guardar el video');
      return;
    }

    router.push('/dashboard');
  }

  const isBusy = uploadProgress !== 'idle' || formState.isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="file">Archivo de video</FieldLabel>
          <input
            id="file"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            disabled={isBusy}
          />
          {duration !== null && (
            <p className="text-sm text-muted-foreground">
              Duración detectada: {Math.floor(duration / 60)} min {duration % 60} seg
            </p>
          )}
        </Field>

        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title">Título</FieldLabel>
              <Input {...field} id="title" aria-invalid={fieldState.invalid} disabled={isBusy} />
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
              <Textarea {...field} id="description" rows={4} disabled={isBusy} />
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
                disabled={isBusy}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="">Selecciona una categoría</option>
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

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={isBusy || !file}>
          {uploadProgress === 'reading' && 'Leyendo video...'}
          {uploadProgress === 'uploading' && 'Subiendo video...'}
          {uploadProgress === 'saving' && 'Guardando...'}
          {uploadProgress === 'idle' && 'Publicar video'}
        </Button>
      </FieldGroup>
    </form>
  );
}