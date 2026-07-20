import Link from 'next/link';
import { signOut } from '@/features/auth/actions/auth.actions';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-lg">Dashboard — próximamente</p>
      <Link href="/dashboard/perfil" className="text-sm underline">
        Editar mi perfil público
      </Link>
      <form action={signOut}>
        <Button type="submit" variant="outline">
          Cerrar sesión
        </Button>
      </form>
    </div>
  );
}