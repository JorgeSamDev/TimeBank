import { VideoUploadFormLoader } from '@/features/videos/components/video-upload-form-loader';

export default function NewVideoPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Sube tu video</h1>
        <p className="text-sm text-muted-foreground">
          Comparte lo que sabes y gana tiempo para aprender de otros.
        </p>
      </div>
      <VideoUploadFormLoader />
    </div>
  );
}