import { Separator } from '@/components/ui/separator';
import type { PublicProfile } from '../types';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Calificación: ${rating} de 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < Math.round(rating) ? 'text-amber-500' : 'text-muted-foreground/30'}>
          ★
        </span>
      ))}
      <span className="ml-1 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}

export function PublicProfileView({ profile }: { profile: PublicProfile }) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <div className="flex items-center gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-muted">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.username}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-2xl font-medium text-muted-foreground">
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">@{profile.username}</h1>
          {profile.city && <p className="text-sm text-muted-foreground">{profile.city}</p>}
          <StarRating rating={profile.rating} />
        </div>
      </div>

      {profile.bio && <p className="text-sm leading-relaxed">{profile.bio}</p>}

      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
        <span className="font-medium">{profile.hours}</span>
        <span className="text-muted-foreground">horas disponibles en su banco de tiempo</span>
      </div>

      {profile.skills.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-muted-foreground">Habilidades</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <Separator />

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Videos</h2>
        {profile.videos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no hay videos.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {profile.videos.map((video) => (
              <a
                key={video.id}
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1.5"
              >
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                  {video.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="size-full object-cover transition-opacity group-hover:opacity-80"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      ▶
                    </div>
                  )}
                </div>
                <p className="line-clamp-2 text-xs">{video.title}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
