export type ModelFormat = "glb" | "vrm";

export type BlendshapeStandard =
  | "none"
  | "jaw_open"
  | "arkit_52"
  | "oculus_viseme";

export interface ModelAssetManifest {
  id: string;
  label: string;
  format: ModelFormat;
  path: string;
  blendshapeStandard: BlendshapeStandard;
  hasEyes: boolean;
  hasJaw: boolean;
  hasTeeth: boolean;
  hasIdleAnimation: boolean;
  fileSizeBytes?: number;
  triangleCount?: number;
  drawCallCount?: number;
  textureMemoryMb?: number;
}

export const ETHEN_MODEL_MANIFEST: ModelAssetManifest = {
  id: "ethen",
  label: "Ethen Browser Avatar",
  format: "glb",
  path: "/models/ethen/ethen.glb",
  blendshapeStandard: "none",
  hasEyes: false,
  hasJaw: false,
  hasTeeth: false,
  hasIdleAnimation: false,
};

export const MODEL_ASSETS: ModelAssetManifest[] = [ETHEN_MODEL_MANIFEST];
