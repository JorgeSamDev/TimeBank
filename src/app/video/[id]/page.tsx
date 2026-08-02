import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getVideoById } from '@/features/videos/actions/video.actions';

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

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function VideoPage({ params }: PageProps) {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) {
    notFound();
  }

  const ownerName = video.ownerFullName || video.ownerUsername || 'Usuario';

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-10">
      <video
        src={video.videoUrl}
        poster={video.thumbnailUrl ?? undefined}
        controls
        className="w-full rounded-lg bg-black"
      />

      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">{video.title}</h1>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{CATEGORY_LABELS[video.category] ?? video.category}</span>
        </div>

        {video.ownerUsername && (
          <Link
            href={`/perfil/${video.ownerUsername}`}
            className="flex items-center gap-2 text-sm hover:underline"
          >
            <div className="h-8 w-8 overflow-hidden rounded-full bg-muted">
              {video.ownerAvatarUrl && (
                <Image
                  src={video.ownerAvatarUrl}
                  alt={ownerName}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            {ownerName}
          </Link>
        )}

        {video.description && <p className="text-sm">{video.description}</p>}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) {
    return { title: 'Video no encontrado — TimeBank' };
  }

  return {
    title: `${video.title} — TimeBank`,
    description: video.description ?? undefined,
  };
}