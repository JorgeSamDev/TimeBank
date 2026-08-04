'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { deleteMyVideo } from '../actions/video.actions';
import type { Video } from '../types';

const CATEGORY_LABELS: Record<string, string> = {
  musica: 'Música',
  cocina: 'Cocina',
  idiomas: 'Idiomas',
  tecnologia: 'Tecnología',
  deporte: 'Deporte',
  arte: 'Arte',
  negocios: 'Negocios',
  bienestar: 'Bienestar',
  otro: 'Otro',
};

const STATUS_LABELS: Record<Video['status'], string> = {
  active: 'Activo',
  reported: 'Reportado',
  removed: 'Eliminado',
};

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes} min ${remaining} seg`;
}

export function MyVideoCard({ video }: { video: Video }) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [removed, setRemoved] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteMyVideo(video.id);
      if (result.success) {
        setRemoved(true);
      }
    });
  }

  if (removed) return null;

  return (
    <div className="glass flex flex-col gap-3 rounded-2xl p-3">
      <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
        {video.thumbnailUrl && (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            width={320}
            height={180}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between">
          <p className="font-medium text-[var(--tb-paper)]">{video.title}</p>
          <span className="text-xs text-muted-foreground">{STATUS_LABELS[video.status]}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {CATEGORY_LABELS[video.category] ?? video.category} · {formatDuration(video.durationSeconds)}
        </p>
      </div>

      {!confirming ? (
        <div className="flex gap-2 text-sm">
          <Link href={`/dashboard/videos/${video.id}/editar`} className="text-[var(--tb-glow)] hover:underline">
            Editar
          </Link>
          <button type="button" onClick={() => setConfirming(true)} className="text-destructive hover:underline">
            Eliminar
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">¿Eliminar este video?</span>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="font-medium text-destructive hover:underline"
          >
            {isPending ? 'Eliminando...' : 'Sí'}
          </button>
          <button type="button" onClick={() => setConfirming(false)} className="text-muted-foreground hover:underline">
            No
          </button>
        </div>
      )}
    </div>
  );
}