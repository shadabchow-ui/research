export interface SceneSplitOptions {
  delimiter?: string;
}

export interface SceneSplitResult {
  scenes: string[];
  totalWords: number;
  estimatedReadSeconds: number;
}

const WORDS_PER_SECOND = 3.3;

export function splitScriptIntoScenes(
  script: string,
  options?: SceneSplitOptions,
): SceneSplitResult {
  const text = script.trim();
  if (!text) return { scenes: [], totalWords: 0, estimatedReadSeconds: 0 };

  const delimiter = options?.delimiter ?? "\n\n";
  const rawParts = text.split(delimiter);
  const scenes = rawParts
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  const totalWords = scenes.reduce((sum, scene) => {
    return sum + scene.split(/\s+/).filter(Boolean).length;
  }, 0);

  const estimatedReadSeconds = Math.ceil(totalWords / WORDS_PER_SECOND);

  return { scenes, totalWords, estimatedReadSeconds };
}
