import { PageBackground } from '@/components/shared/page-background';

export default function TermsPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <PageBackground src="/images/landing.jpg" />

      <div className="glass flex flex-col gap-6 rounded-2xl p-8 text-sm text-[var(--tb-mist)]">
        <div>
          <h1 className="mb-1 font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-[var(--tb-paper)]">
            Términos y Condiciones
          </h1>
          <p className="text-xs text-muted-foreground">Última actualización: agosto de 2026</p>
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-[var(--tb-paper)]">1. Descripción del servicio</h2>
          <p>
            TimeBank es una plataforma de intercambio de conocimiento basada en tiempo. Los
            usuarios comparten videos educativos y, a cambio, obtienen créditos de tiempo que
            pueden usar para ver videos de otros usuarios. Al registrarte y usar TimeBank, aceptas
            estos Términos y Condiciones en su totalidad.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-[var(--tb-paper)]">2. Cuentas de usuario</h2>
          <p>
            Debes proporcionar información veraz al registrarte y eres responsable de mantener la
            confidencialidad de tu contraseña y de toda actividad que ocurra en tu cuenta. TimeBank
            no se hace responsable de pérdidas derivadas del uso no autorizado de tu cuenta si esto
            ocurre por negligencia tuya en proteger tus credenciales.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-[var(--tb-paper)]">3. Contenido del usuario</h2>
          <p>
            Conservas la propiedad de los videos que subes. Al publicar contenido en TimeBank, nos
            otorgas una licencia no exclusiva, mundial y libre de regalías para almacenar,
            reproducir y mostrar dicho contenido dentro de la plataforma, con el único fin de
            operar el servicio. Eres el único responsable del contenido que compartes y garantizas
            que tienes los derechos necesarios para publicarlo.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-[var(--tb-paper)]">4. Conducta prohibida</h2>
          <p>Al usar TimeBank, te comprometes a no:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Subir contenido falso, engañoso, o que no corresponda a lo que describe.</li>
            <li>Subir contenido que infrinja derechos de autor de terceros.</li>
            <li>Publicar contenido ofensivo, discriminatorio, violento o sexualmente explícito.</li>
            <li>Manipular el sistema de créditos de forma fraudulenta.</li>
            <li>Crear múltiples cuentas para eludir restricciones de la plataforma.</li>
            <li>Acosar, amenazar o dañar a otros usuarios de la comunidad.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-[var(--tb-paper)]">
            5. Sistema de moderación y sanciones
          </h2>
          <p>
            TimeBank se reserva el derecho de revisar contenido reportado por la comunidad. Si un
            video acumula reportes válidos, puede ser eliminado de la plataforma.
          </p>
          <p>
            Si un mismo usuario recibe reportes válidos en <strong>3 videos distintos</strong>, su
            cuenta será suspendida temporalmente por un periodo de <strong>una semana</strong>. Si,
            tras la reincidencia, el usuario vuelve a acumular reportes válidos en 3 videos
            adicionales, su cuenta será <strong>bloqueada de forma permanente</strong>.
          </p>
          <p>
            TimeBank se reserva el derecho de aplicar estas medidas a su entera discreción, así
            como de tomar acciones adicionales en casos de infracciones graves, sin necesidad de
            aviso previo.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-[var(--tb-paper)]">6. Sistema de créditos</h2>
          <p>
            Los créditos de tiempo de TimeBank no constituyen dinero real, no tienen valor
            monetario fuera de la plataforma, no son transferibles a terceros, no son reembolsables
            y no pueden ser canjeados por dinero. Los créditos existen únicamente para regular el
            acceso al contenido dentro de TimeBank.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-[var(--tb-paper)]">7. Edad mínima para el uso de la plataforma</h2>
          <p>
            Para utilizar TimeBank, el usuario debe tener al menos 13 años o la edad mínima establecida
            por la legislación aplicable en su país de residencia. Si el usuario es menor de 18 años, 
            declara contar con el consentimiento de su padre, madre o tutor legal para utilizar la plataforma.
          </p>
        </section>


        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-[var(--tb-paper)]">8. Limitación de responsabilidad</h2>
          <p>
            TimeBank se proporciona &quot;tal cual&quot;, sin garantías de ningún tipo. No garantizamos que
            el contenido subido por los usuarios sea preciso, seguro o de calidad. TimeBank no será
            responsable por daños indirectos, incidentales o consecuentes derivados del uso de la
            plataforma.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-[var(--tb-paper)]">9. Terminación de cuenta</h2>
          <p>
            Puedes cerrar tu cuenta en cualquier momento. TimeBank puede suspender o terminar tu
            acceso a la plataforma si incumples estos Términos y Condiciones, de acuerdo con la
            sección 5.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-[var(--tb-paper)]">10. Cambios a estos términos</h2>
          <p>
            Podemos actualizar estos Términos y Condiciones ocasionalmente. Los cambios entrarán en
            vigor al ser publicados en esta página. El uso continuo de TimeBank después de una
            actualización constituye tu aceptación de los nuevos términos.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-[var(--tb-paper)]">11. Contacto</h2>
          <p>
            Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos a través de
            los canales de soporte disponibles en la plataforma.
          </p>
        </section>
      </div>
    </div>
  );
}