'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { makeParticleTargets } from '@/components/hero/particle-text';

interface Props {
  text: string;
  particleCount?: number;
}

function Swarm({ text, particleCount = 3000 }: Props) {
  const ref = useRef<THREE.Points>(null);
  const { viewport, size } = useThree();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mql.matches);
    const onChange = () => setReduceMotion(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const targets = useMemo(() => {
    return makeParticleTargets(text, 'sans-serif', 4);
  }, [text]);

  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    const len = Math.max(targets.length, 1);
    for (let i = 0; i < particleCount; i++) {
      const t = targets[i % len] ?? { x: 0, y: 0 };
      arr[i * 3] = t.x;
      arr[i * 3 + 1] = t.y;
      arr[i * 3 + 2] = 0;
    }
    return arr;
  }, [particleCount, targets]);

  useFrame((state, delta) => {
    if (!ref.current || reduceMotion) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const t = state.clock.elapsedTime;
    const len = Math.max(targets.length, 1);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const target = targets[i % len] ?? { x: 0, y: 0 };
      const drift = Math.sin(t * 0.5 + i * 0.01) * 0.05;
      arr[i3] = target.x + drift;
      arr[i3 + 1] = target.y + Math.cos(t * 0.3 + i * 0.01) * 0.05;
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
      </bufferGeometry>
      <pointsMaterial
        color="#C6FF3D"
        size={0.015}
        sizeAttenuation
        transparent
        opacity={0.9}
      />
    </points>
  );
}

export function ParticleField({ text }: { text: string }) {
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    setDpr(isMobile ? 0.75 : Math.min(window.devicePixelRatio || 1, 2));
  }, []);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <Swarm text={text} />
    </Canvas>
  );
}
