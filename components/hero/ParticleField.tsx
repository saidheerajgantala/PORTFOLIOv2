'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { makeParticleTargets } from '@/components/hero/particle-text';

const TEXT_CYCLE = ['Hello.', 'Hi.', 'Hey.', 'Namaste.', 'Howdy.'];
const CYCLE_MS = 4000;
const SPAWN_DURATION = 1.8; // seconds for particles to fly into place
const HOLD_DURATION = 1.2; // seconds particles hold the text before morphing
const MORPH_DURATION = 1.0; // seconds for one text → next text transition

interface Props {
  text?: string;
  particleCount?: number;
}

// Build a per-particle color so the swarm isn't monotone. Mix of full accent,
// faded accent, and off-white so the letterforms read as solid shapes but with
// subtle depth.
function makeColors(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const accent = new THREE.Color('#C6FF3D');
  const dim = new THREE.Color('#C6FF3D').multiplyScalar(0.35);
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

function Swarm({
  text,
  nextText,
  morphT,
  particleCount = 3200,
}: {
  text: string;
  nextText: string;
  morphT: number; // 0..1 progress through morph
  particleCount?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const { size, viewport } = useThree();
  const [reduceMotion, setReduceMotion] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
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
  const colors = useMemo(() => makeColors(particleCount), [particleCount]);

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

    const len = Math.max(targets.length, nextTargets.length, 1);
    const mx = mouse.current.x * 0.25;
    const my = -mouse.current.y * 0.25;

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

      const x = THREE.MathUtils.lerp(sx, targetX + mx, spawnEase) + swirl;
      const y = THREE.MathUtils.lerp(sy, targetY + my, spawnEase) + bob;
      // Fade the spawn z so particles fly toward camera on entrance.
      const z = THREE.MathUtils.lerp(sz, 0, spawnEase);

      arr[i3] = x;
      arr[i3 + 1] = y;
      arr[i3 + 2] = z;
    }
    pos.needsUpdate = true;
  });

  // Slight scale-up while spawning so the canvas reads as "arriving" rather
  // than "fully painted" the moment it mounts.
  const scale = (() => {
    if (reduceMotion) return 1;
    return 0.85 + 0.15 * 1; // visual scale handled by camera; canvas size stable
  })();

  return (
    <points ref={ref} scale={scale}>
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

export function ParticleField({ text: initialText = 'Hello.' }: { text?: string }) {
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
      setNextIndex((n) => (n + 1) % TEXT_CYCLE.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

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

  const text = TEXT_CYCLE[textIndex];
  const nextText = TEXT_CYCLE[nextIndex];

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <Swarm text={text} nextText={nextText} morphT={morphT} />
    </Canvas>
  );
}
