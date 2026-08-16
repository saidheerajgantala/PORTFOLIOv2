export function HeroFallback({ text }: { text: string }) {
  return (
    <h1
      className="font-display font-bold text-text leading-none tracking-[-0.04em]"
      style={{ fontSize: 'clamp(48px, 12vw, 160px)' }}
    >
      {text}
    </h1>
  );
}
