import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getReportedVideos } from '@/features/admin/actions/moderation.actions';
import { ReportedVideoCard } from '@/features/admin/components/reported-video-card';
import { PageBackground } from '@/components/shared/page-background';

export default async function AdminReportsPage() {
  const reportedVideos = await getReportedVideos();

  return (
    <div className="flex flex-col gap-6">
      <PageBackground src="/images/admin.jpg" />

      <Link
        href="/dashboard"
        className="glass flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm text-[var(--tb-mist)] hover:text-[var(--tb-paper)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al dashboard
      </Link>

      <div className="glass flex items-center justify-between gap-4 rounded-2xl p-6">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--tb-paper)]">
            Videos reportados
          </h1>
          <p className="text-sm text-muted-foreground">
            Revisa y modera el contenido reportado por la comunidad.
          </p>
        </div>
        <span className="font-mono text-2xl font-semibold text-[var(--tb-ember)]">
          {reportedVideos.length}
        </span>
      </div>

      {reportedVideos.length === 0 ? (
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-sm text-muted-foreground">No hay reportes pendientes.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {reportedVideos.map((video) => (
            <ReportedVideoCard key={video.videoId} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}