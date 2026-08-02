import Link from 'next/link';
import { getMyProfile } from '@/features/profile/actions/profile.actions';
import { getMyVideos } from '@/features/videos/actions/video.actions';
import { Button } from '@/components/ui/button';
import { MyVideosList } from '@/features/videos/components/my-videos-list';

export default async function DashboardPage() {
  const profile = await getMyProfile();
  const videos = await getMyVideos();

  const displayName = profile?.fullName || profile?.username || 'Usuario';

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10">
      <div className="glass flex items-center justify-between rounded-2xl p-4">
        <div>
          <p className="font-[family-name:var(--font-space-grotesk)] text-lg font-medium">
            Hola, {displayName}
          </p>
          {profile?.bio && <p className="text-sm text-[var(--tb-mist)]">{profile.bio}</p>}
        </div>
        <Button size="sm" render={<Link href="/dashboard/videos/nuevo">Subir video</Link>} nativeButton={false} />
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
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Tus videos</p>
        <MyVideosList videos={videos} />
      </div>
    </div>
  );
}