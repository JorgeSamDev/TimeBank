'use client';

import { useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { uploadAvatar } from '../actions/profile.actions';

export function AvatarUpload({ currentAvatarUrl }: { currentAvatarUrl: string | null }) {
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setError(null);

    const formData = new FormData();
    formData.set('avatar', file);

    startTransition(async () => {
      const result = await uploadAvatar(formData);
      if (!result.success) {
        setError(result.error ?? 'Error al subir la imagen');
        setPreview(currentAvatarUrl);
      }
    });
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-24 w-24 overflow-hidden rounded-full bg-muted">
        {preview ? (
          <Image src={preview} alt="Avatar" width={96} height={96} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl text-muted-foreground">
            ?
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        {isPending ? 'Subiendo...' : 'Cambiar foto'}
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
