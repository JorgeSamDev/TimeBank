import Link from 'next/link';
import { getMyProfile } from '@/features/profile/actions/profile.actions';
import { EditProfileForm } from '@/features/profile/components/edit-profile-form';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export default async function EditProfilePage() {
  const profile = await getMyProfile();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10">
      <div className="glass flex flex-col gap-1 rounded-2xl p-4">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--tb-paper)]">
          Tu perfil público
        </h1>
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

      <div className="flex flex-col gap-2 border-t border-border pt-6">
        <h2 className="text-lg font-semibold">Cambiar contraseña</h2>
        <ResetPasswordForm />
      </div>
    </div>
    
  );
}