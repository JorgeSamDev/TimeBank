import Link from 'next/link';
import { MyVideoCard } from './my-video-card';
import type { Video } from '../types';

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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <MyVideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}