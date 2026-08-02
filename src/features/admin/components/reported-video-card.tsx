'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { removeVideo, dismissReports, type ReportedVideo } from '../actions/moderation.actions';

export function ReportedVideoCard({ video }: { video: ReportedVideo }) {
  const [isPending, startTransition] = useTransition();
  const [resolved, setResolved] = useState(false);

  function handleRemove() {
    startTransition(async () => {
      await removeVideo(video.videoId);
      setResolved(true);
    });
  }

  function handleDismiss() {
    startTransition(async () => {
      await dismissReports(video.videoId);
      setResolved(true);
    });
  }

  if (resolved) return null;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <Link href={`/video/${video.videoId}`} className="font-medium hover:underline">
          {video.title}
        </Link>
        <span className="text-xs text-muted-foreground">
          {video.reportCount} {video.reportCount === 1 ? 'reporte' : 'reportes'}
        </span>
      </div>

      {video.ownerUsername && (
        <p className="text-sm text-muted-foreground">Autor: @{video.ownerUsername}</p>
      )}

      <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
        {video.reasons.map((reason, i) => (
          <li key={i}>· {reason}</li>
        ))}
      </ul>

      <div className="flex gap-2">
        <Button type="button" size="sm" variant="destructive" disabled={isPending} onClick={handleRemove}>
          Eliminar video
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={isPending} onClick={handleDismiss}>
          Descartar reportes
        </Button>
      </div>
    </div>
  );
}