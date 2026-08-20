'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { makeParticleTargets } from '@/components/hero/particle-text';
import { HERO_GREETING_CYCLE } from '@/content/hero-variants';

const TEXT_CYCLE_MS = 4000;
const SPAWN_DURATION = 1.8;
const MORPH_DURATION = 1.0;

// Particle count kept low (vs. 3200 previously) so additive blending doesn't
// saturate the canvas into a solid lime block when particles overlap.
const PARTICLE_COUNT = 1400;

function Swarm({
  text,
  nextText,
  morphT,
  particleCount,
}: {
  text: string;
  nextText: string;
  morphT: number;
  particleCount: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const [reduceMotion, setReduceMotion] = useState(false);
  // Cursor position, normalized to [-1, 1] across the viewport.
  const mouse = useRef({ x: 0, y: 0 });
  // Smoothed cursor position used for the subtle parallax drift.
  const drift = useRef({ x: 0, y: 0 });
  const spawnStart = useRef<number | null>(null);

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
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

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

  useFrame((state, delta) => {
    if (!ref.current || reduceMotion) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const t = state.clock.elapsedTime;

    if (spawnStart.current === null) spawnStart.current = t;
    const spawnElapsed = t - spawnStart.current;
    const spawnT = Math.min(1, spawnElapsed / SPAWN_DURATION);
    const spawnEase = 1 - Math.pow(1 - spawnT, 3);

    // Subtle cursor drift: lerp toward the cursor — particles lean toward
    // the cursor without ever fully reaching it.
    const lerpAmount = Math.min(1, delta * 5);
    drift.current.x += (mouse.current.x - drift.current.x) * lerpAmount;
    drift.current.y += (-mouse.current.y - drift.current.y) * lerpAmount;
    const dx = drift.current.x * 0.15;
    const dy = drift.current.y * 0.15;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const a = targets[i % Math.max(targets.length, 1)] ?? { x: 0, y: 0 };
      const b = nextTargets[i % Math.max(nextTargets.length, 1)] ?? a;
      const targetX = THREE.MathUtils.lerp(a.x, b.x, morphT);
      const targetY = THREE.MathUtils.lerp(a.y, b.y, morphT);

      const phase = i * 0.013;
      const swirl = Math.sin(t * 0.7 + phase) * 0.08;
      const bob = Math.cos(t * 0.5 + phase * 1.3) * 0.06;

      const sx = spawnPositions[i3];
      const sy = spawnPositions[i3 + 1];
      const sz = spawnPositions[i3 + 2];

      const x = THREE.MathUtils.lerp(sx, targetX + dx, spawnEase) + swirl;
      const y = THREE.MathUtils.lerp(sy, targetY + dy, spawnEase) + bob;
      const z = THREE.MathUtils.lerp(sz, 0, spawnEase);

      arr[i3] = x;
      arr[i3 + 1] = y;
      arr[i3 + 2] = z;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#F5F5F7"
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

export function ParticleField() {
  const [dpr, setDpr] = useState(1);
  const [textIndex, setTextIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [morphStart, setMorphStart] = useState<number | null>(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    setDpr(isMobile ? 0.75 : Math.min(window.devicePixelRatio || 1, 2));
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const id = setInterval(() => {
      setMorphStart(performance.now() / 1000);
      setNextIndex((n) => (n + 1) % HERO_GREETING_CYCLE.length);
    }, TEXT_CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  // morphT eases 0→1 over MORPH_DURATION then snaps; recomputed each frame.
  const morphT = (() => {
    if (morphStart === null) return 0;
    const elapsed = performance.now() / 1000 - morphStart;
    const t = Math.min(1, elapsed / MORPH_DURATION);
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

  const text = HERO_GREETING_CYCLE[textIndex];
  const nextText = HERO_GREETING_CYCLE[nextIndex];

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
        particleCount={PARTICLE_COUNT}
      />
    </Canvas>
  );
}
