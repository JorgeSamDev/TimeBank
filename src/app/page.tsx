import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PageBackground } from '@/components/shared/page-background';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="h-screen overflow-hidden">
      <PageBackground src="/images/landing.jpg" />

      <section className="container mx-auto flex h-full flex-col items-center justify-center px-6 text-center">
        <Image src="/icon.png" alt="TimeBank" width={180} height={180} className="mb-6 rounded-3xl" />

        <span className="glass rounded-full px-4 py-1 text-sm text-[var(--tb-mist)]">
          Bienvenido a TimeBank
        </span>

        <h1 className="mt-6 max-w-4xl font-[family-name:var(--font-space-grotesk)] text-5xl font-extrabold tracking-tight text-[var(--tb-paper)] md:text-6xl">
          Intercambia <span className="text-[var(--tb-glow)]">conocimiento</span>, no dinero.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-[var(--tb-mist)]">
          Aprende nuevas habilidades enseñando aquello que ya sabes. Cada hora compartida te
          permite aprender algo nuevo dentro de una comunidad colaborativa.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button size="lg" render={<Link href="/login">Iniciar sesión</Link>} nativeButton={false} />
          <Button
            variant="outline"
            size="lg"
            render={<Link href="/register">Crear cuenta</Link>}
            nativeButton={false}
          />
        </div>

        <Link
          href="/catalogo"
          className="mt-6 flex items-center gap-2 text-sm text-[var(--tb-mist)] transition-colors hover:text-[var(--tb-tide)]"
        >
          Explorar el catálogo sin registrarme
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}