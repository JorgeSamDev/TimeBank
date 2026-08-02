import { VideoUploadFormLoader } from '@/features/videos/components/video-upload-form-loader';
import { PageBackground } from '@/components/shared/page-background';

export default function NewVideoPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10">
      <PageBackground src="/images/upload.jpg" />
      <div className="glass flex flex-col gap-1 rounded-2xl p-4">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--tb-paper)]">
          Sube tu video
        </h1>
        <p className="text-sm text-muted-foreground">
          Comparte lo que sabes y gana tiempo para aprender de otros.
        </p>
      </div>
      <VideoUploadFormLoader />
    </div>
  );
}