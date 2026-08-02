import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="container mx-auto flex min-h-screen flex-col items-center justify-center px-6 text-center">
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
      </section>

      {/* Footer */}
      <footer className="glass py-8 text-center text-sm text-[var(--tb-mist)]">
        © {new Date().getFullYear()} TimeBank · Plataforma de intercambio de conocimientos.
      </footer>
    </main>
  );
}