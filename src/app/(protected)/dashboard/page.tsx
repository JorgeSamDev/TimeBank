import Image from 'next/image';
import Link from 'next/link';
import { getMyProfile } from '@/features/profile/actions/profile.actions';
import { getMyVideos } from '@/features/videos/actions/video.actions';
import { signOut } from '@/features/auth/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { ComingSoonCard } from '@/components/shared/coming-soon-card';
import { MyVideosList } from '@/features/videos/components/my-videos-list';

export default async function DashboardPage() {
  const profile = await getMyProfile();
  const videos = await getMyVideos();

  const displayName = profile?.fullName || profile?.username || 'Usuario';

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
            {profile?.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={displayName}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg text-muted-foreground">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="font-medium">Hola, {displayName}</p>
            {profile?.bio && (
              <p className="line-clamp-1 text-sm text-muted-foreground">{profile.bio}</p>
            )}
          </div>
        </div>

        <form action={signOut}>
          <Button type="submit" variant="outline" size="sm">
            Cerrar sesión
          </Button>
        </form>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/dashboard/perfil">Editar perfil</Link>}
          nativeButton={false}
        />
        {profile?.username && (
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/perfil/${profile.username}`}>Ver perfil público</Link>}
            nativeButton={false}
          />
        )}
        <Button
          size="sm"
          render={<Link href="/dashboard/videos/nuevo">Subir video</Link>}
          nativeButton={false}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ComingSoonCard
          title="Tus créditos"
          description="Aquí verás tus horas disponibles para ver videos de otros usuarios."
        />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Tus videos</p>
          <MyVideosList videos={videos} />
        </div>
      </div>
    </div>
  );
}