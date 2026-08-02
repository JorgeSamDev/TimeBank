import { notFound } from 'next/navigation';
import { getPublicProfileByUsername } from '@/features/profile/actions/profile.actions';
import { PublicProfileView } from '@/features/profile/components/public-profile-view';
import { getVideosByOwner } from '@/features/videos/actions/video.actions';

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const videos = await getVideosByOwner(profile.id);

  return <PublicProfileView profile={profile} videos={videos} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(username);

  if (!profile) {
    return { title: 'Perfil no encontrado — TimeBank' };
  }

  return {
    title: `@${profile.username} — TimeBank`,
    description: profile.bio ?? `Perfil de @${profile.username} en TimeBank`,
  };
}
