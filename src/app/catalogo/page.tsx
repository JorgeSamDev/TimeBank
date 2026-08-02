import Link from 'next/link';
import { getVideos } from '@/features/videos/actions/video.actions';
import { VideoCard } from '@/features/videos/components/video-card';
import { VIDEO_CATEGORIES } from '@/features/videos/schemas/video.schema';

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

type PageProps = {
  searchParams: Promise<{ categoria?: string }>;
};

export default async function CatalogoPage({ searchParams }: PageProps) {
  const { categoria } = await searchParams;
  const videos = await getVideos(categoria);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-[var(--tb-paper)]">
  Explora TimeBank
</h1>
        <p className="text-sm text-muted-foreground">
          Aprende de lo que otros usuarios han compartido.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/catalogo"
          className={`rounded-full px-3 py-1 text-sm transition-colors ${!categoria ? 'bg-[var(--tb-glow)] text-white' : 'glass text-[var(--tb-mist)] hover:text-[var(--tb-paper)]'}`}
        >
          Todas
        </Link>
        {VIDEO_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/catalogo?categoria=${cat}`}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${categoria === cat ? 'bg-[var(--tb-glow)] text-white' : 'glass text-[var(--tb-mist)] hover:text-[var(--tb-paper)]'}`}
          >
            {CATEGORY_LABELS[cat]}
          </Link>
        ))}
      </div>

      {videos.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay videos en esta categoría todavía.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}