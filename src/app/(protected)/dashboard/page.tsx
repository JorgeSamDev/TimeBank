import Link from 'next/link';
import { getMyProfile } from '@/features/profile/actions/profile.actions';
import { getMyVideos } from '@/features/videos/actions/video.actions';
import { Button } from '@/components/ui/button';
import { PageBackground } from '@/components/shared/page-background';
import { MyVideosList } from '@/features/videos/components/my-videos-list';

export default async function DashboardPage() {
  const profile = await getMyProfile();
  const videos = await getMyVideos();

  const displayName = profile?.fullName || profile?.username || 'Usuario';

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <PageBackground src="/images/dashboard.jpg" />

      <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
        <div>
          <p className="font-[family-name:var(--font-space-grotesk)] text-xl font-medium text-[var(--tb-paper)]">
            Hola, {displayName}
          </p>
          {profile?.bio && <p className="text-sm text-muted-foreground">{profile.bio}</p>}
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
          <Button size="sm" render={<Link href="/dashboard/videos/nuevo">Subir video</Link>} nativeButton={false} />
        </div>
      </div>

      <div>
        <p className="mb-3 font-[family-name:var(--font-space-grotesk)] text-lg font-medium text-[var(--tb-paper)]">
          Tus videos
        </p>
        <MyVideosList videos={videos} />
      </div>
    </div>
  );
}