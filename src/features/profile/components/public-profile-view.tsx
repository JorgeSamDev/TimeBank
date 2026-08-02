import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import type { PublicProfile } from '../types';
import type { Video } from '@/features/videos/types';
import { VideoCard } from '@/features/videos/components/video-card';

type PublicProfileViewProps = {
  profile: PublicProfile;
  videos: Video[];
};

export function PublicProfileView({ profile, videos }: PublicProfileViewProps) {
  const displayName = profile.fullName ?? profile.username ?? '?';

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <div className="glass flex items-center gap-4 rounded-2xl p-6">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-muted text-xl font-semibold">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={displayName}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--tb-paper)]">
            {displayName}
          </h1>
          {profile.city && <p className="text-sm text-muted-foreground">{profile.city}</p>}
        </div>
      </div>

      {profile.bio && <p className="text-sm">{profile.bio}</p>}

      {profile.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span key={skill} className="glass rounded-full px-3 py-1 text-xs">
              {skill}
            </span>
          ))}
        </div>
      )}

      <Separator />

      <div>
        <h2 className="mb-3 font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--tb-paper)]">
          Videos compartidos
        </h2>
        {videos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Este usuario aún no ha compartido videos.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={{
                  ...video,
                  ownerUsername: profile.username,
                  ownerFullName: profile.fullName,
                  ownerAvatarUrl: profile.avatarUrl,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}