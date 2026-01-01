export interface Config {
  shouldUseShadow: boolean;
  shouldUseBlur: boolean;
  shouldDrawMarkers: boolean;
  maxDepth: number;
  sectionLength: number;
  sectionAspectRatio: number;
}

export function createDefaultConfig(): Config {
  return {
    maxDepth: 10,
    sectionAspectRatio: 3,
    sectionLength: height / 10,
    shouldDrawMarkers: false,
    shouldUseBlur: true,
    shouldUseShadow: true,
  };
}
