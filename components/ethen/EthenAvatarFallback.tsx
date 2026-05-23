"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const IDLE_SPEED = 0.3;
const SPEAKING_SPEED = 2.5;
const THINKING_SPEED = 1.2;

const JAW_DAMPING = 8;
const BODY_DAMPING = 4;

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function lerp(current: number, target: number, delta: number, damping: number) {
  return current + (target - current) * Math.min(delta * damping, 1);
}

type FallbackProps = {
  state?:
    | "idle"
    | "listening"
    | "user_speaking"
    | "thinking"
    | "speaking"
    | "interrupted"
    | "recovering"
    | "offline"
    | "error";
  mouthOpen?: number;
};

export default function EthenAvatarFallback({
  state = "idle",
  mouthOpen = 0,
}: FallbackProps) {
  const groupRef = useRef<THREE.Group>(null);
  const jawRef = useRef<THREE.Group>(null);
  const accumulator = useRef(0);

  const stateColor = useMemo(() => {
    switch (state) {
      case "listening":
      case "user_speaking":
        return "#4ade80";
      case "thinking":
        return "#facc15";
      case "speaking":
        return "#a78bfa";
      case "interrupted":
      case "recovering":
        return "#fbbf24";
      case "offline":
        return "#6b7280";
      case "error":
        return "#f87171";
      default:
        return "#7c6ff0";
    }
  }, [state]);

  const avatarMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: stateColor,
        roughness: 0.4,
        metalness: 0.1,
      }),
    [stateColor],
  );

  const innerMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: stateColor,
        roughness: 0.2,
        metalness: 0.3,
        emissive: stateColor,
        emissiveIntensity: 0.15,
      }),
    [stateColor],
  );

  const accentColor = useMemo(() => {
    switch (state) {
      case "listening":
      case "user_speaking":
        return "#bbf7d0";
      case "thinking":
        return "#fef08a";
      case "speaking":
        return "#ddd6fe";
      case "interrupted":
      case "recovering":
        return "#fde68a";
      case "offline":
        return "#9ca3af";
      case "error":
        return "#fecaca";
      default:
        return "#ddd6fe";
    }
  }, [state]);

  useFrame((_, delta) => {
    if (!groupRef.current || !jawRef.current) return;

    const clamped = Math.min(delta, 0.1);
    accumulator.current += clamped;

    const t = accumulator.current;

    let breathingAmplitude = 0.015;
    let breathingSpeed = IDLE_SPEED;
    let jawOscillation = 0;
    let jawSpeed = SPEAKING_SPEED;
    let headSwayAmplitude = 0.015;

    if (state === "speaking") {
      breathingAmplitude = 0.025;
      breathingSpeed = SPEAKING_SPEED;
      jawOscillation = mouthOpen * 0.1 + Math.sin(t * jawSpeed * 2.7) * 0.02;
      headSwayAmplitude = 0.03;
    } else if (state === "thinking") {
      breathingSpeed = THINKING_SPEED;
      headSwayAmplitude = 0.02;
    } else if (state === "listening" || state === "user_speaking") {
      breathingSpeed = 0.2;
      headSwayAmplitude = 0.012;
      breathingAmplitude = 0.01;
    } else if (state === "interrupted") {
      breathingSpeed = 0.15;
      headSwayAmplitude = 0.005;
      breathingAmplitude = 0.005;
    } else if (state === "recovering") {
      breathingSpeed = 0.25;
      headSwayAmplitude = 0.01;
      breathingAmplitude = 0.01;
    } else if (state === "offline") {
      breathingSpeed = 0.1;
    }

    const breathing = Math.sin(t * breathingSpeed) * breathingAmplitude;
    groupRef.current.position.y = breathing;

    const headSway =
      Math.sin(t * 0.5) * headSwayAmplitude +
      Math.sin(t * 1.3) * headSwayAmplitude * 0.5;
    groupRef.current.rotation.z = headSway;
    groupRef.current.rotation.x = Math.cos(t * 0.7) * headSwayAmplitude * 0.3;

    jawRef.current.position.y = jawOscillation;
  });

  return (
    <group ref={groupRef} dispose={null}>
      <mesh position={[0, 0.75, 0]} material={innerMaterial}>
        <capsuleGeometry args={[0.22, 0.28, 8, 16]} />
      </mesh>

      <mesh position={[0, 0.1, 0]} material={avatarMaterial}>
        <capsuleGeometry args={[0.38, 0.55, 16, 32]} />
      </mesh>

      <mesh position={[0, -0.55, 0]} material={avatarMaterial}>
        <capsuleGeometry args={[0.32, 0.45, 12, 32]} />
      </mesh>

      <mesh
        position={[0.2, -0.1, 0.32]}
        rotation={[Math.PI / 3, 0, 0]}
        material={avatarMaterial}
      >
        <capsuleGeometry args={[0.1, 0.55, 8, 16]} />
      </mesh>

      <mesh
        position={[-0.2, -0.1, 0.32]}
        rotation={[Math.PI / 3, 0, 0]}
        material={avatarMaterial}
      >
        <capsuleGeometry args={[0.1, 0.55, 8, 16]} />
      </mesh>

      <group ref={jawRef}>
        <mesh position={[0, 0.5, 0.1]} material={avatarMaterial}>
          <capsuleGeometry args={[0.07, 0.06, 6, 12]} />
        </mesh>
      </group>

      <mesh
        position={[0.07, 0.82, 0.25]}
        material={
          new THREE.MeshStandardMaterial({
            color: accentColor,
            roughness: 0.1,
            emissive: accentColor,
            emissiveIntensity: 0.6,
          })
        }
      >
        <sphereGeometry args={[0.03, 8, 8]} />
      </mesh>
      <mesh
        position={[-0.07, 0.82, 0.25]}
        material={
          new THREE.MeshStandardMaterial({
            color: accentColor,
            roughness: 0.1,
            emissive: accentColor,
            emissiveIntensity: 0.6,
          })
        }
      >
        <sphereGeometry args={[0.03, 8, 8]} />
      </mesh>
    </group>
  );
}
