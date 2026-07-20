import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="container mx-auto flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <span className="rounded-full border bg-muted px-4 py-1 text-sm text-muted-foreground">
          Bienvenido a TimeBank
        </span>

        <h1 className="mt-6 max-w-4xl text-5xl font-extrabold tracking-tight md:text-6xl">
          Intercambia <span className="text-primary">conocimiento</span>, no dinero.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Aprende nuevas habilidades enseñando aquello que ya sabes. Cada hora
          compartida te permite aprender algo nuevo dentro de una comunidad
          colaborativa.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href="/login">
            <Button size="lg">
              Iniciar sesión
            </Button>
          </Link>

          <Link href="/register">
            <Button variant="outline" size="lg">
              Crear cuenta
            </Button>
          </Link>
        </div>
      </section>

      {/* Beneficios */}
      <section className="container mx-auto grid gap-6 px-6 pb-20 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-8 shadow-sm transition hover:shadow-lg">
          <div className="mb-4 text-5xl">📚</div>

          <h3 className="mb-2 text-xl font-bold">
            Aprende sin límites
          </h3>

          <p className="text-muted-foreground">
            Encuentra personas que desean compartir sus conocimientos en
            distintas áreas.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-8 shadow-sm transition hover:shadow-lg">
          <div className="mb-4 text-5xl">⏱️</div>

          <h3 className="mb-2 text-xl font-bold">
            Intercambia tiempo
          </h3>

          <p className="text-muted-foreground">
            Enseña una habilidad y utiliza esas horas para aprender otra.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-8 shadow-sm transition hover:shadow-lg">
          <div className="mb-4 text-5xl">🤝</div>

          <h3 className="mb-2 text-xl font-bold">
            Construye comunidad
          </h3>

          <p className="text-muted-foreground">
            Conecta con personas interesadas en aprender y compartir
            conocimiento.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} TimeBank · Plataforma de intercambio de
        conocimientos.
      </footer>
    </main>
  );
}