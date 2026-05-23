"use client";

import { Suspense, useState, useEffect, useRef, useMemo } from "react";
import {
  useGLTF,
  Environment,
  ContactShadows,
  OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import EthenAvatarFallback from "./EthenAvatarFallback";

const MODEL_PATH = "/models/ethen/humanoid-robot-ai.glb";

if (typeof window !== "undefined") {
  useGLTF.preload(MODEL_PATH);
}

const FACE_CAMERA_POSITION: [number, number, number] = [0, 0.03, 1.62];
const FACE_CAMERA_FOV = 24;
const FACE_CAMERA_TARGET: [number, number, number] = [0, 0.04, 0];
const FACE_CAMERA_MIN_DISTANCE = 1.56;
const FACE_CAMERA_MAX_DISTANCE = 1.72;
const ROBOT_HEAD_BIAS_FROM_TOP = 0.18;
const PORTRAIT_HEIGHT = 1.35;
const PORTRAIT_UPPER_BODY_HEIGHT_FACTOR = 0.43;
const PORTRAIT_DEPTH_BIAS = 0.04;
// Set to Math.PI if the loaded GLB faces away from the camera.
const FACE_MODEL_Y_ROTATION = 0;

type ModelState =
  | "starting"
  | "model_loading"
  | "model_loaded"
  | "model_missing"
  | "model_error"
  | "fallback_active";

type EthenAvatarProps = {
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
  className?: string;
  compact?: boolean;
  mouthOpen?: number;
};

function LoadingPlaceholder() {
  return (
    <mesh>
      <octahedronGeometry args={[0.35, 1]} />
      <meshStandardMaterial
        color="#7c6ff0"
        wireframe
        emissive="#7c6ff0"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

function WebGLFallback({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        minHeight: "320px",
        borderRadius: "1rem",
        background: "var(--color-avatar-surface, #111827)",
        border: "1px solid var(--color-avatar-border, #1f2937)",
        padding: "2rem",
        textAlign: "center",
        gap: "0.75rem",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, var(--color-avatar-accent, #7c6ff0), var(--color-avatar-accent-subtle, rgba(124,111,240,0.2)))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
        }}
      >
        E
      </div>
      <p
        style={{
          color: "var(--color-avatar-text-muted, #9ca3af)",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
      >
        WebGL is not supported or was disabled.
        <br />
        Ethen requires a browser that supports WebGL.
      </p>
      <p
        style={{
          color: "var(--color-avatar-text-dim, #6b7280)",
          fontSize: "0.75rem",
        }}
      >
        Try Chrome, Firefox, Edge, or Safari on a modern device.
      </p>
    </div>
  );
}

function ModelScene({
  onLoad,
}: {
  onLoad: (info: {
    hasMorphTargets: boolean;
    jawBoneFound: boolean;
    blinkFound: boolean;
  }) => void;
}) {
  const gltf = useGLTF(MODEL_PATH);

  useEffect(() => {
    const scene = gltf.scene.clone(true);

    const hasMorphTargets = scene.children.some((child) => {
      if (child instanceof THREE.Mesh && child.morphTargetInfluences) {
        return child.morphTargetInfluences.length > 0;
      }
      return false;
    });

    let jawBoneFound = false;
    let blinkFound = false;

    scene.traverse((child) => {
      if (child instanceof THREE.Bone) {
        const name = child.name.toLowerCase();
        if (
          name.includes("jaw") ||
          name.includes("mouth") ||
          name.includes("chin")
        ) {
          jawBoneFound = true;
        }
        if (name.includes("blink") || name.includes("eye")) {
          blinkFound = true;
        }
      }
      if (child instanceof THREE.Mesh && child.morphTargetDictionary) {
        const morphNames = Object.keys(child.morphTargetDictionary);
        if (
          morphNames.some(
            (n) => n.includes("jawOpen") || n.includes("mouthOpen"),
          )
        ) {
          jawBoneFound = true;
        }
        if (morphNames.some((n) => n.includes("eyeBlink"))) {
          blinkFound = true;
        }
      }
    });

    onLoad({ hasMorphTargets, jawBoneFound, blinkFound });
  }, []);

  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    const meshNames: string[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshNames.push(`${child.name} (${child.type})`);
      }
    });
    console.log("[EthenAvatar3D] Loaded meshes:", meshNames);
    console.log("[EthenAvatar3D] Animations:", gltf.animations.length);
  }

  const box = new THREE.Box3().setFromObject(scene);
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  box.getCenter(center);
  box.getSize(size);

  const portraitCenter = new THREE.Vector3(
    center.x,
    box.max.y - size.y * ROBOT_HEAD_BIAS_FROM_TOP,
    center.z + size.z * PORTRAIT_DEPTH_BIAS,
  );
  const portraitReferenceHeight = Math.max(
    size.y * PORTRAIT_UPPER_BODY_HEIGHT_FACTOR,
    size.x,
    size.z * 1.1,
  );
  const uniformScale =
    portraitReferenceHeight > 0 ? PORTRAIT_HEIGHT / portraitReferenceHeight : 1;
  const portraitOffset = portraitCenter.clone().multiplyScalar(-uniformScale);

  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log("[EthenAvatar3D] Bounds center:", center);
    console.log("[EthenAvatar3D] Bounds size:", size);
    console.log("[EthenAvatar3D] Portrait center:", portraitCenter);
    console.log("[EthenAvatar3D] Scale:", uniformScale);
  }

  return (
    <group
      scale={[uniformScale, uniformScale, uniformScale]}
      position={[portraitOffset.x, portraitOffset.y, portraitOffset.z]}
      rotation={[0, FACE_MODEL_Y_ROTATION, 0]}
    >
      <primitive object={scene} />
    </group>
  );
}

function AvatarContent({
  state,
  mouthOpen,
  onModelState,
  onDiagnostics,
}: {
  state: string;
  mouthOpen: number;
  onModelState: (s: ModelState) => void;
  onDiagnostics: (d: {
    hasMorphTargets: boolean;
    jawBoneFound: boolean;
    blinkFound: boolean;
  }) => void;
}) {
  const [modelLoadAttempted, setModelLoadAttempted] = useState(false);
  const [modelLoadFailed, setModelLoadFailed] = useState(false);
  const triedRef = useRef(false);

  useEffect(() => {
    if (triedRef.current) return;
    triedRef.current = true;
    setModelLoadAttempted(true);
    onModelState("model_loading");
  }, [onModelState]);

  if (modelLoadFailed || !modelLoadAttempted) {
    return (
      <EthenAvatarFallback
        state={state as EthenAvatarProps["state"]}
        mouthOpen={mouthOpen}
      />
    );
  }

  return (
    <Suspense
      fallback={
        <group>
          <LoadingPlaceholder />
        </group>
      }
    >
      <ModelScene
        onLoad={(info) => {
          onModelState("model_loaded");
          onDiagnostics(info);
        }}
      />
    </Suspense>
  );
}

export function EthenAvatar3D({
  state = "idle",
  className,
  compact = false,
  mouthOpen = 0,
}: EthenAvatarProps) {
  const [webglSupported, setWebglSupported] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [modelState, setModelState] = useState<ModelState>("starting");
  const [hasMorphTargets, setHasMorphTargets] = useState(false);
  const [jawBoneFound, setJawBoneFound] = useState(false);
  const [blinkFound, setBlinkFound] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (!mounted) {
    return (
      <div
        className={className}
        style={{
          background: "var(--color-avatar-surface, #111827)",
          borderRadius: compact ? "9999px" : "1rem",
          border: compact
            ? "none"
            : "1px solid var(--color-avatar-border, #1f2937)",
          minHeight: compact ? "100%" : "320px",
        }}
      />
    );
  }

  if (!webglSupported) {
    return <WebGLFallback className={className} />;
  }

  return (
    <div
      className={className}
      style={{
        position: "relative",
        borderRadius: compact ? "9999px" : "1rem",
        overflow: "hidden",
        touchAction: "none",
        cursor: "grab",
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        camera={{
          position: FACE_CAMERA_POSITION,
          fov: FACE_CAMERA_FOV,
          near: 0.01,
          far: 100,
        }}
        style={{
          background: "var(--color-avatar-bg, #030712)",
          borderRadius: compact ? "9999px" : "1rem",
        }}
      >
        <ambientLight intensity={compact ? 0.5 : 0.4} />
        <pointLight
          position={[2, 3, 2]}
          intensity={compact ? 1 : 0.8}
          color="#f3f4f6"
        />
        <pointLight
          position={[-2, -0.5, 1]}
          intensity={compact ? 0.4 : 0.3}
          color="#d1d5db"
        />
        <spotLight
          position={[0, 3, 4]}
          angle={0.4}
          penumbra={0.6}
          intensity={compact ? 0.8 : 0.6}
          color="#e5e7eb"
        />
        <AvatarContent
          state={state}
          mouthOpen={mouthOpen}
          onModelState={setModelState}
          onDiagnostics={(d) => {
            setHasMorphTargets(d.hasMorphTargets);
            setJawBoneFound(d.jawBoneFound);
            setBlinkFound(d.blinkFound);
          }}
        />
        {!compact && (
          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.4}
            scale={4}
            blur={2.5}
            far={2}
          />
        )}
        <Environment preset="city" environmentIntensity={compact ? 0.2 : 0.3} />
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          enablePan={false}
          enableZoom
          enableRotate={false}
          autoRotate={false}
          rotateSpeed={0.35}
          zoomSpeed={0.7}
          minDistance={FACE_CAMERA_MIN_DISTANCE}
          maxDistance={FACE_CAMERA_MAX_DISTANCE}
          minPolarAngle={Math.PI / 2.08}
          maxPolarAngle={Math.PI / 2.02}
          minAzimuthAngle={-0.25}
          maxAzimuthAngle={0.25}
          target={FACE_CAMERA_TARGET}
        />
      </Canvas>
    </div>
  );
}
