'use client';

import dynamic from 'next/dynamic';

const VideoUploadForm = dynamic(
  () => import('./video-upload-form').then((mod) => mod.VideoUploadForm),
  { ssr: false },
);

export function VideoUploadFormLoader() {
  return <VideoUploadForm />;
}