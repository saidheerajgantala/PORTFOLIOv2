/**
 * Generates a 2D particle layout from a text string by sampling glyph pixels
 * from a hidden canvas. The result is an array of {x, y} target positions.
 * No rendering; no DOM.
 */
export interface ParticleTarget {
  x: number;
  y: number;
}

export function makeParticleTargets(text: string, font: string, sampling: number): ParticleTarget[] {
  if (typeof document === 'undefined') return [];
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 220;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#fff';
  ctx.font = `${font} 700 160px ${font}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(text, width / 2, height / 2);

  const { data } = ctx.getImageData(0, 0, width, height);
  const targets: ParticleTarget[] = [];

  for (let y = 0; y < height; y += sampling) {
    for (let x = 0; x < width; x += sampling) {
      const i = (y * width + x) * 4;
      if (data[i] > 128) {
        targets.push({
          x: (x - width / 2) / 100,
          y: (y - height / 2) / 100,
        });
      }
    }
  }

  return targets;
}