import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase/auth';
import { getMyProfile } from '@/features/profile/actions/profile.actions';
import { EditProfileForm } from '@/features/profile/components/edit-profile-form';

export default async function EditProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await getMyProfile();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Tu perfil público</h1>
        <p className="text-sm text-muted-foreground">
          Así te verán los demás usuarios de TimeBank.
        </p>
        {profile?.username && (
          <Link href={`/perfil/${profile.username}`} className="text-sm underline">
            Ver mi perfil público
          </Link>
        )}
      </div>
      <EditProfileForm initialProfile={profile} />
    </div>
  );
}