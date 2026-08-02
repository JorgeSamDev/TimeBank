import Image from 'next/image';

export function PageBackground({ src }: { src: string }) {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Image src={src} alt="" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-[var(--tb-void)]/70 backdrop-blur-sm" />
    </div>
  );
}