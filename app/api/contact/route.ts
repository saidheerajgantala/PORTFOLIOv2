import { NextResponse } from 'next/server';
import { z } from 'zod';

const Schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(1).max(5000),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name, email, message } = parsed.data;

  // Log so dev can verify; production would forward to Resend + Discord webhook.
  console.log('[contact]', { name, email, message });

  return NextResponse.json({ ok: true });
}