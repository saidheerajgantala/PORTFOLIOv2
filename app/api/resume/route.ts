import { NextResponse } from 'next/server';
import { renderResume } from '@/lib/resume-pdf';

// @react-pdf/renderer relies on Node built-ins, so pin this route to the Node runtime.
export const runtime = 'nodejs';

export async function GET() {
  try {
    const buffer = await renderResume();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="saidheeraj-gantala-resume.pdf"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error('[resume] render failed', err);
    return NextResponse.json({ error: 'Resume render failed' }, { status: 500 });
  }
}
