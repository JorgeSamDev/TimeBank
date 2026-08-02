import { notFound } from 'next/navigation';
import { ReportVideoButton } from '@/features/videos/components/report-video-button';
import Link from 'next/link';
import Image from 'next/image';
import { PageBackground } from '@/components/shared/page-background';
import { getVideoById } from '@/features/videos/actions/video.actions';
import { chargeForView } from '@/features/credits/actions/credit.actions';
import { getCurrentUser } from '@/lib/supabase/auth';

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

  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-10 text-center">
        <PageBackground src="/images/video.jpg" />
        <p>Inicia sesión para ver este video.</p>
        <Link href="/login" className="underline">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  // El dueño del video siempre puede verlo sin gastar crédito.
  const isOwner = user.id === video.ownerId;
  const chargeResult = isOwner
    ? { success: true }
    : await chargeForView(video.id, video.durationSeconds);

  if (!chargeResult.success) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-10 text-center">
        <p className="font-medium">No tienes créditos suficientes</p>
        <p className="text-sm text-muted-foreground">{chargeResult.error}</p>
        <Link href="/dashboard/videos/nuevo" className="text-sm underline">
          Sube un video para ganar créditos
        </Link>
      </div>
    );
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

      <div className="glass flex flex-col gap-2 rounded-2xl p-4">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--tb-paper)]">
          {video.title}
        </h1>

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

        {!isOwner && <ReportVideoButton videoId={video.id} />}
      </div>
    </div>
  );
}