// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';

describe('makeParticleTargets', () => {
  it('returns empty array outside browser', async () => {
    const { makeParticleTargets } = await import('@/components/hero/particle-text');
    const result = makeParticleTargets('hello', 'sans-serif', 4);
    expect(Array.isArray(result)).toBe(true);
  });

  it('produces targets when document is available', async () => {
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: () => ({
        fillStyle: '',
        fillRect: () => {},
        font: '',
        textBaseline: '',
        textAlign: '',
        fillText: () => {},
        getImageData: () => ({
          data: new Uint8ClampedArray(1200 * 220 * 4).fill(255),
        }),
      }),
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas as unknown as HTMLCanvasElement);
    const { makeParticleTargets } = await import('@/components/hero/particle-text');
    const result = makeParticleTargets('hello', 'sans-serif', 4);
    expect(result.length).toBeGreaterThan(0);
  });
});