import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';

describe('design tokens', () => {
  const css = readFileSync('app/globals.css', 'utf-8');

  it('defines --bg', () => expect(css).toMatch(/--bg:\s*#0A0A0B/));
  it('defines --accent', () => expect(css).toMatch(/--accent:\s*#C6FF3D/));
  it('defines --text-muted', () => expect(css).toMatch(/--text-muted:\s*#8A8A93/));
  it('respects reduced-motion', () => expect(css).toMatch(/prefers-reduced-motion/));
});
