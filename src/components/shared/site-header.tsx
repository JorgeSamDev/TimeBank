import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase/auth';
import { getMyProfile } from '@/features/profile/actions/profile.actions';
import { getMyBalance } from '@/features/credits/actions/credit.actions';
import { Button } from '@/components/ui/button';
import { UserMenu } from './user-menu';

export async function SiteHeader() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <header className="glass sticky top-0 z-10 flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--tb-paper)]">
  TimeBank
</Link>
        <div className="flex items-center gap-4">
          <Link href="/catalogo" className="text-sm text-muted-foreground hover:underline">
            Catálogo
          </Link>
          <Button size="sm" variant="outline" render={<Link href="/login">Iniciar sesión</Link>} nativeButton={false} />
          <Button size="sm" render={<Link href="/register">Registrarte</Link>} nativeButton={false} />
        </div>
      </header>
    );
  }

  const [profile, balance] = await Promise.all([getMyProfile(), getMyBalance()]);
  const displayName = profile?.fullName || profile?.username || 'Usuario';

  return (
    <header className="glass sticky top-0 z-10 flex items-center justify-between px-4 py-3">
      <Link href="/" className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--tb-paper)]">
  TimeBank
</Link>
      <div className="flex items-center gap-4">
        <Link href="/catalogo" className="text-sm text-muted-foreground hover:underline">
          Catálogo
        </Link>
        <span className="font-mono text-sm text-[var(--tb-ember)]">{balance.toFixed(2)} hrs</span>
        <UserMenu displayName={displayName} avatarUrl={profile?.avatarUrl ?? null} />
      </div>
    </header>
  );
}