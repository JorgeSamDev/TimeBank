import { getReportedVideos } from '@/features/admin/actions/moderation.actions';
import { ReportedVideoCard } from '@/features/admin/components/reported-video-card';

export default async function AdminReportsPage() {
  const reportedVideos = await getReportedVideos();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Videos reportados</h1>
        <p className="text-sm text-muted-foreground">
          Revisa y modera el contenido reportado por la comunidad.
        </p>
      </div>

      {reportedVideos.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay reportes pendientes.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reportedVideos.map((video) => (
            <ReportedVideoCard key={video.videoId} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}