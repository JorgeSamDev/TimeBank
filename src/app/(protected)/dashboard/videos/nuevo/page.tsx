import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { VideoUploadFormLoader } from '@/features/videos/components/video-upload-form-loader';
import { PageBackground } from '@/components/shared/page-background';

export default function NewVideoPage() {
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

      <div className="glass flex flex-col gap-1 rounded-2xl p-6">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--tb-paper)]">
          Sube tu video
        </h1>
        <p className="text-sm text-muted-foreground">
          Comparte lo que sabes y gana tiempo para aprender de otros.
        </p>
      </div>

      <div className="glass rounded-2xl p-6">
        <VideoUploadFormLoader />
      </div>
    </div>
  );
}