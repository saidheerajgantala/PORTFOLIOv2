import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/resume/route';

describe('GET /api/resume', () => {
  it('returns a PDF response', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/pdf');
    const buf = await res.arrayBuffer();
    expect(buf.byteLength).toBeGreaterThan(1000);
    // PDF magic number: %PDF
    const head = Buffer.from(buf.slice(0, 4)).toString();
    expect(head).toBe('%PDF');
  });
});
