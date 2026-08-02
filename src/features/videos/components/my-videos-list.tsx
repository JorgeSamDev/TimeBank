import Image from 'next/image';
import Link from 'next/link';
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

export function MyVideosList({ videos }: { videos: Video[] }) {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-dashed border-border p-4 text-center">
        <p className="text-sm text-muted-foreground">Aún no has subido ningún video.</p>
        <Link href="/dashboard/videos/nuevo" className="text-sm underline">
          Sube tu primer video
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {videos.map((video) => (
        <div key={video.id} className="glass flex gap-3 rounded-2xl p-3">
          <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
            {video.thumbnailUrl && (
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                width={96}
                height={64}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{video.title}</p>
              <span className="text-xs text-muted-foreground">{STATUS_LABELS[video.status]}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {CATEGORY_LABELS[video.category] ?? video.category} · {formatDuration(video.durationSeconds)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}