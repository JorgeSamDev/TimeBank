import Link from 'next/link';
import { getMyProfile } from '@/features/profile/actions/profile.actions';
import { EditProfileForm } from '@/features/profile/components/edit-profile-form';
import { PageBackground } from '@/components/shared/page-background';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export default async function EditProfilePage() {
  const profile = await getMyProfile();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <PageBackground src="/images/perfil.jpg" />

      <div className="glass flex flex-col gap-1 rounded-2xl p-6">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--tb-paper)]">
          Tu perfil público
        </h1>
        <p className="text-sm text-muted-foreground">Así te verán los demás usuarios de TimeBank.</p>
        {profile?.username && (
          <Link href={`/perfil/${profile.username}`} className="text-sm underline">
            Ver mi perfil público
          </Link>
        )}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="glass rounded-2xl p-6">
          <EditProfileForm initialProfile={profile} />
        </div>

        <div className="glass flex flex-col gap-3 rounded-2xl p-6">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--tb-paper)]">
            Cambiar contraseña
          </h2>
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}