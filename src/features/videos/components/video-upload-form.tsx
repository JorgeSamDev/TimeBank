'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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

type FormMetadata = Omit<CreateVideoInput, 'videoUrl' | 'durationSeconds' | 'thumbnailUrl'>;

// Captura un frame del video en el segundo indicado y lo devuelve como Blob (JPEG).
function captureVideoFrame(videoEl: HTMLVideoElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve(null);
      return;
    }

    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8);
  });
}

export function VideoUploadForm() {
  const router = useRouter();
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [thumbnailBlob, setThumbnailBlob] = useState<Blob | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'reading' | 'uploading' | 'saving'>('idle');
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<FormMetadata>({
    resolver: zodResolver(createVideoSchema.omit({ videoUrl: true, durationSeconds: true, thumbnailUrl: true })),
    defaultValues: { title: '', description: '', category: undefined },
  });

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    setError(null);
    setDuration(null);
    setThumbnailBlob(null);
    setThumbnailPreview(null);

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

    const videoEl = document.createElement('video');
    videoEl.preload = 'metadata';
    videoEl.muted = true;

    videoEl.onloadedmetadata = () => {
      setDuration(Math.round(videoEl.duration));
      // Saltamos al segundo 1 (o al inicio si el video es más corto) para capturar el frame.
      videoEl.currentTime = Math.min(1, videoEl.duration / 2);
    };

    videoEl.onseeked = async () => {
      const blob = await captureVideoFrame(videoEl);
      URL.revokeObjectURL(videoEl.src);

      if (blob) {
        setThumbnailBlob(blob);
        setThumbnailPreview(URL.createObjectURL(blob));
      }

      setFile(selected);
      setUploadProgress('idle');
    };

    videoEl.onerror = () => {
      setError('No se pudo leer el archivo de video');
      setUploadProgress('idle');
    };

    videoEl.src = URL.createObjectURL(selected);
  }

  function handleCustomThumbnail(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      setError('Selecciona una imagen válida para la miniatura');
      return;
    }

    setThumbnailBlob(selected);
    setThumbnailPreview(URL.createObjectURL(selected));
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

    const videoExtension = file.name.split('.').pop();
    const videoId = crypto.randomUUID();
    const videoPath = `${user.id}/${videoId}.${videoExtension}`;

    const { error: uploadError } = await supabase.storage.from('videos').upload(videoPath, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploadProgress('idle');
      return;
    }

    const {
      data: { publicUrl: videoUrl },
    } = supabase.storage.from('videos').getPublicUrl(videoPath);

    let thumbnailUrl: string | undefined;

    if (thumbnailBlob) {
      const thumbnailPath = `${user.id}/${videoId}-thumb.jpg`;
      const { error: thumbError } = await supabase.storage
        .from('videos')
        .upload(thumbnailPath, thumbnailBlob, { contentType: 'image/jpeg' });

      if (!thumbError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from('videos').getPublicUrl(thumbnailPath);
        thumbnailUrl = publicUrl;
      }
    }

    setUploadProgress('saving');

    const result = await createVideo({
      ...metadata,
      videoUrl,
      thumbnailUrl,
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
          <input id="file" type="file" accept="video/*" onChange={handleFileChange} disabled={isBusy} />
          {duration !== null && (
            <p className="text-sm text-muted-foreground">
              Duración detectada: {Math.floor(duration / 60)} min {duration % 60} seg
            </p>
          )}
        </Field>

        {thumbnailPreview && (
          <Field>
            <FieldLabel>Miniatura</FieldLabel>
            <div className="flex items-center gap-3">
              <Image src={thumbnailPreview}alt="Miniatura del video" width={128} height={80} unoptimized className="h-20 w-32 rounded-md object-cover" />
              <div className="flex flex-col gap-1">
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCustomThumbnail}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isBusy}
                  onClick={() => thumbnailInputRef.current?.click()}
                >
                  Cambiar miniatura
                </Button>
              </div>
            </div>
          </Field>
        )}

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
          {uploadProgress === 'reading' && 'Procesando video...'}
          {uploadProgress === 'uploading' && 'Subiendo...'}
          {uploadProgress === 'saving' && 'Guardando...'}
          {uploadProgress === 'idle' && 'Publicar video'}
        </Button>
      </FieldGroup>
    </form>
  );
}