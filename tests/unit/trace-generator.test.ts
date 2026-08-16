import { describe, it, expect } from 'vitest';
import { generateTraceLine } from '@/components/ambient/trace-generator';

describe('generateTraceLine', () => {
  it('returns a trace line with required fields', () => {
    const line = generateTraceLine();
    expect(line.timestamp).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(line.component).toBeTruthy();
    expect(line.message).toBeTruthy();
    expect(['ok', 'retry', 'fail']).toContain(line.level);
  });

  it('produces unique IDs', () => {
    const set = new Set<string>();
    for (let i = 0; i < 100; i++) set.add(generateTraceLine().id);
    expect(set.size).toBeGreaterThan(90);
  });
});