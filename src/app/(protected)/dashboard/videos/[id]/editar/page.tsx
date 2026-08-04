import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getVideoById } from '@/features/videos/actions/video.actions';
import { getCurrentUser } from '@/lib/supabase/auth';
import { EditVideoForm } from '@/features/videos/components/edit-video-form';
import { PageBackground } from '@/components/shared/page-background';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditVideoPage({ params }: PageProps) {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) {
    notFound();
  }

  const user = await getCurrentUser();

  if (!user || user.id !== video.ownerId) {
    redirect('/dashboard');
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-10">
      <PageBackground src="/images/upload.jpg" />

      <Link
        href="/dashboard"
        className="glass flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm text-[var(--tb-mist)] hover:text-[var(--tb-paper)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al dashboard
      </Link>

      <div className="glass rounded-2xl p-6">
        <h1 className="mb-4 font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--tb-paper)]">
          Editar video
        </h1>
        <EditVideoForm video={video} />
      </div>
    </div>
  );
}