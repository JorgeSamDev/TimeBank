import { Separator } from '@/components/ui/separator';
import type { PublicProfile } from '../types';

export function PublicProfileView({ profile }: { profile: PublicProfile }) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xl font-semibold">
          {(profile.fullName ?? profile.username ?? '?').charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-semibold">{profile.fullName ?? profile.username}</h1>
          {profile.city && <p className="text-sm text-muted-foreground">{profile.city}</p>}
        </div>
      </div>

      {profile.bio && <p className="text-sm">{profile.bio}</p>}

      {profile.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span key={skill} className="rounded-full bg-muted px-3 py-1 text-xs">
              {skill}
            </span>
          ))}
        </div>
      )}

      <Separator />

      <p className="text-sm text-muted-foreground">
        Próximamente: los videos que este usuario ha compartido.
      </p>
    </div>
  );
}