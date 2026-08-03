import { notFound } from 'next/navigation';
import { ReportVideoButton } from '@/features/videos/components/report-video-button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
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

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  if (minutes === 0) return `${remaining} seg`;
  return `${minutes} min ${remaining} seg`;
}

function BackLink() {
  return (
    <Link
      href="/catalogo"
      className="glass flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm text-[var(--tb-mist)] hover:text-[var(--tb-paper)]"
    >
      <ArrowLeft className="h-4 w-4" />
      Volver al catálogo
    </Link>
  );
}

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
        <BackLink />
        <div className="glass rounded-2xl p-6">
          <p className="text-[var(--tb-paper)]">Inicia sesión para ver este video.</p>
          <Link href="/login" className="text-sm underline">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user.id === video.ownerId;
  const chargeResult = isOwner ? { success: true } : await chargeForView(video.id, video.durationSeconds);

  if (!chargeResult.success) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-10 text-center">
        <PageBackground src="/images/video.jpg" />
        <BackLink />
        <div className="glass rounded-2xl p-6">
          <p className="font-medium text-[var(--tb-paper)]">No tienes créditos suficientes</p>
          <p className="text-sm text-muted-foreground">{chargeResult.error}</p>
          <Link href="/dashboard/videos/nuevo" className="text-sm underline">
            Sube un video para ganar créditos
          </Link>
        </div>
      </div>
    );
  }

  const ownerName = video.ownerFullName || video.ownerUsername || 'Usuario';

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10">
      <PageBackground src="/images/video.jpg" />

      <BackLink />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <video
            src={video.videoUrl}
            poster={video.thumbnailUrl ?? undefined}
            controls
            className="w-full rounded-2xl bg-black"
          />
        </div>

        <div className="flex flex-col gap-4">
          {video.ownerUsername && (
            <Link
              href={`/perfil/${video.ownerUsername}`}
              className="glass flex items-center gap-3 rounded-2xl p-4 hover:bg-white/10"
            >
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                {video.ownerAvatarUrl && (
                  <Image
                    src={video.ownerAvatarUrl}
                    alt={ownerName}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compartido por</p>
                <p className="font-medium text-[var(--tb-paper)]">{ownerName}</p>
              </div>
            </Link>
          )}

          <div className="glass flex flex-col gap-2 rounded-2xl p-6">
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--tb-paper)]">
              {video.title}
            </h1>

            <div className="flex items-center gap-3 text-sm">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[var(--tb-mist)]">
                {CATEGORY_LABELS[video.category] ?? video.category}
              </span>
              <span className="font-mono text-[var(--tb-ember)]">
                {formatDuration(video.durationSeconds)}
              </span>
            </div>

            {video.description && <p className="text-sm text-[var(--tb-mist)]">{video.description}</p>}
          </div>

          {!isOwner && (
            <div className="glass rounded-2xl p-4">
              <ReportVideoButton videoId={video.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}