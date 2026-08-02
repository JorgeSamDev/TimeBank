import Image from 'next/image';
import Link from 'next/link';
import type { VideoWithOwner } from '../actions/video.actions';

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

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  if (minutes === 0) {
    return `${remaining} seg`;
  }

  return `${minutes} min`;
}

export function VideoCard({ video }: { video: VideoWithOwner }) {
  const ownerName = video.ownerFullName || video.ownerUsername || 'Usuario';

  return (
    <div className="flex flex-col gap-2 overflow-hidden rounded-lg border border-border">
      <Link href={`/video/${video.id}`} className="aspect-video w-full bg-muted">
        {video.thumbnailUrl && (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            width={320}
            height={180}
            className="h-full w-full object-cover"
          />
        )}
      </Link>

      <div className="flex flex-col gap-2 p-3">
        <Link href={`/video/${video.id}`}>
          <p className="line-clamp-2 font-medium hover:underline">{video.title}</p>
        </Link>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{CATEGORY_LABELS[video.category] ?? video.category}</span>
          <span>{formatDuration(video.durationSeconds)}</span>
        </div>

        {video.ownerUsername && (
          <Link
            href={`/perfil/${video.ownerUsername}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:underline"
          >
            <div className="h-5 w-5 overflow-hidden rounded-full bg-muted">
              {video.ownerAvatarUrl && (
                <Image
                  src={video.ownerAvatarUrl}
                  alt={ownerName}
                  width={20}
                  height={20}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            {ownerName}
          </Link>
        )}
      </div>
    </div>
  );
}