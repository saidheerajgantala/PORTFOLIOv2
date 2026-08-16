import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        404 · Not found
      </p>
      <h1 className="mt-4 font-display text-5xl text-text">Lost in the agent graph.</h1>
      <p className="mt-6 text-muted max-w-prose">
        The page you tried to reach doesn't exist — at least not here. It might have
        moved, been renamed, or never existed in the first place.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block font-mono text-xs uppercase tracking-widest text-accent hover:underline"
      >
        ← Back to home
      </Link>
    </main>
  );
}