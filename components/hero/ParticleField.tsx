'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { makeParticleTargets } from '@/components/hero/particle-text';
import { HERO_GREETING_CYCLE } from '@/content/hero-variants';
import type { Role } from '@/lib/types';
import type { HeroVariant } from '@/content/hero-variants';

const TEXT_CYCLE_MS = 4000;
const SPAWN_DURATION = 1.8; // seconds for particles to fly into place
const MORPH_DURATION = 1.0; // seconds for one text → next text transition

// Build a per-particle color so the swarm isn't monotone. Mix of full accent,
// faded accent, and off-white so the letterforms read as solid shapes but
// with subtle depth.
function makeColors(count: number, baseTint: string): Float32Array {
  const out = new Float32Array(count * 3);
  const accent = new THREE.Color(baseTint);
  const dim = new THREE.Color(baseTint).multiplyScalar(0.35);
  const white = new THREE.Color('#F5F5F7');
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    const c = r < 0.65 ? accent : r < 0.85 ? dim : white;
    out[i * 3] = c.r;
    out[i * 3 + 1] = c.g;
    out[i * 3 + 2] = c.b;
  }
  return out;
}

// Time-of-day hue interpolation for the 'hue' motif.
// Cool (210°) at 6am → accent (90°) at noon → warm (40°) at 6pm → cool (210°) at midnight.
function tintForHour(baseTint: string, hour: number): string {
  const segments: Array<[number, number]> = [
    [0, 210],
    [6, 210],
    [12, 90],
    [18, 40],
    [24, 210],
  ];
  let hue = segments[segments.length - 1][1];
  for (let i = 0; i < segments.length - 1; i++) {
    const [a, ha] = segments[i];
    const [b, hb] = segments[i + 1];
    if (hour >= a && hour <= b) {
      const t = (hour - a) / (b - a);
      hue = ha + (hb - ha) * t;
      break;
    }
  }
  const c = new THREE.Color(`hsl(${hue.toFixed(0)}, 90%, 60%)`);
  const base = new THREE.Color(baseTint);
  return `#${c.lerp(base, 0.7).getHexString()}`;
}

function Swarm({
  text,
  nextText,
  morphT,
  scrollTilt,
  hueTint,
  variant,
  particleCount = 3200,
}: {
  text: string;
  nextText: string;
  morphT: number;
  scrollTilt: number;
  hueTint: string;
  variant: HeroVariant;
  particleCount?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const [reduceMotion, setReduceMotion] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const spawnStart = useRef<number | null>(null);
  // Cached click-ripple state, kept across frames so particles can return
  // smoothly to their letterform targets once the shockwave finishes.
  const ripple = useRef<{ active: boolean; t: number; cx: number; cy: number } | null>(null);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mql.matches);
    const onChange = () => setReduceMotion(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onClick = (e: PointerEvent) => {
      if (variant.motif !== 'ripple' || reduceMotion) return;
      ripple.current = {
        active: true,
        t: 0,
        cx: (e.clientX / window.innerWidth) * 2 - 1,
        cy: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onClick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onClick);
    };
  }, [variant.motif, reduceMotion]);

  const targets = useMemo(() => makeParticleTargets(text, 'sans-serif', 4), [text]);
  const nextTargets = useMemo(
    () => makeParticleTargets(nextText, 'sans-serif', 4),
    [nextText],
  );

  const spawnPositions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    const radius = Math.max(viewport.width, viewport.height) * 0.8;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = Math.sin(angle) * r * 0.6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, [particleCount, viewport.width, viewport.height]);

  const positions = useMemo(() => spawnPositions.slice(), [spawnPositions]);
  const colors = useMemo(() => makeColors(particleCount, hueTint), [particleCount, hueTint]);

  useFrame((state, delta) => {
    if (!ref.current || reduceMotion) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const t = state.clock.elapsedTime;

    if (spawnStart.current === null) spawnStart.current = t;
    const spawnElapsed = t - spawnStart.current;
    const spawnT = Math.min(1, spawnElapsed / SPAWN_DURATION);
    // ease-out cubic — fast start, soft landing
    const spawnEase = 1 - Math.pow(1 - spawnT, 3);

    // Tug motif: cursor magnet (only on pointer-fine devices).
    const tug =
      variant.motif === 'tug' && typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
        ? { x: mouse.current.x * 0.4, y: -mouse.current.y * 0.4 }
        : { x: 0, y: 0 };

    // Ripple motif: pointer-down shockwave radiating from click point.
    let rippleDx = 0;
    let rippleDy = 0;
    if (variant.motif === 'ripple' && ripple.current?.active) {
      ripple.current.t += delta;
      const elapsed = ripple.current.t;
      const DURATION = 0.8;
      if (elapsed > DURATION) {
        ripple.current.active = false;
      } else {
        const rT = elapsed / DURATION;
        const wave = Math.sin(rT * Math.PI) * (1 - rT);
        const dist = Math.hypot(
          mouse.current.x - ripple.current.cx,
          mouse.current.y - ripple.current.cy,
        );
        const falloff = Math.max(0, 1 - dist * 1.5);
        rippleDx = (mouse.current.x - ripple.current.cx) * wave * 0.6 * falloff;
        rippleDy = -(mouse.current.y - ripple.current.cy) * wave * 0.6 * falloff;
      }
    }

    // Tilt motif: scroll position drives a per-particle z displacement
    // (mocked Y-axis rotation via the 3D plane).
    const tiltZ = variant.motif === 'tilt' ? scrollTilt * 1.2 : 0;

    const len = Math.max(targets.length, nextTargets.length, 1);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const a = targets[i % Math.max(targets.length, 1)] ?? { x: 0, y: 0 };
      const b = nextTargets[i % Math.max(nextTargets.length, 1)] ?? a;
      const targetX = THREE.MathUtils.lerp(a.x, b.x, morphT);
      const targetY = THREE.MathUtils.lerp(a.y, b.y, morphT);

      // Per-particle phase so the swarm doesn't move in lockstep.
      const phase = i * 0.013;
      const swirl = Math.sin(t * 0.7 + phase) * 0.08;
      const bob = Math.cos(t * 0.5 + phase * 1.3) * 0.06;

      const sx = spawnPositions[i3];
      const sy = spawnPositions[i3 + 1];
      const sz = spawnPositions[i3 + 2];

      const x = THREE.MathUtils.lerp(sx, targetX + tug.x + rippleDx, spawnEase) + swirl;
      const y = THREE.MathUtils.lerp(sy, targetY + tug.y + rippleDy, spawnEase) + bob;
      const z = THREE.MathUtils.lerp(sz, tiltZ, spawnEase);

      arr[i3] = x;
      arr[i3 + 1] = y;
      arr[i3 + 2] = z;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        color="#FFFFFF"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function ParticleField({ role, variant }: { role: Role; variant: HeroVariant }) {
  const [dpr, setDpr] = useState(1);
  const [textIndex, setTextIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [morphStart, setMorphStart] = useState<number | null>(null);
  const [scrollTilt, setScrollTilt] = useState(0);
  const [hueTint, setHueTint] = useState(variant.tint);

  const cycle = HERO_GREETING_CYCLE[role];

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    setDpr(isMobile ? 0.75 : Math.min(window.devicePixelRatio || 1, 2));
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const id = setInterval(() => {
      setMorphStart(performance.now() / 1000);
      setNextIndex((n) => (n + 1) % cycle.length);
    }, TEXT_CYCLE_MS);
    return () => clearInterval(id);
  }, [cycle.length]);

  // Tilt: listen to scroll position and update a normalized tilt value.
  useEffect(() => {
    if (variant.motif !== 'tilt') return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const t = max > 0 ? window.scrollY / max : 0;
      // Map scroll 0→1 to ±0.1 (i.e. ±6° tilt when rendered).
      setScrollTilt((t - 0.5) * 0.2);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [variant.motif]);

  // Hue: time-of-day tint, refreshed every minute.
  useEffect(() => {
    if (variant.motif !== 'hue') return;
    const update = () => {
      const hour = new Date().getHours() + new Date().getMinutes() / 60;
      setHueTint(tintForHour(variant.tint, hour));
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [variant.motif, variant.tint]);

  // morphT eases 0→1 over MORPH_DURATION then snaps; recomputed each frame.
  const morphT = (() => {
    if (morphStart === null) return 0;
    const elapsed = performance.now() / 1000 - morphStart;
    const t = Math.min(1, elapsed / MORPH_DURATION);
    // ease-in-out cubic
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  })();

  // When morph completes, commit nextIndex → textIndex and reset.
  useEffect(() => {
    if (morphStart === null) return;
    const elapsed = performance.now() / 1000 - morphStart;
    if (elapsed >= MORPH_DURATION) {
      setTextIndex(nextIndex);
      setMorphStart(null);
    }
  }, [morphStart, nextIndex]);

  const text = cycle[textIndex];
  const nextText = cycle[nextIndex];

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <Swarm
        text={text}
        nextText={nextText}
        morphT={morphT}
        scrollTilt={scrollTilt}
        hueTint={hueTint}
        variant={variant}
      />
    </Canvas>
  );
}
