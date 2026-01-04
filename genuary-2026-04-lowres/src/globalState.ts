import { createPlayer, type Player } from "./player.ts";
import type { TerrainConfig } from "./terrain.ts";

export interface GlobalState {
  player: Player;
  terrainConfig: TerrainConfig;
}

export function createGlobalState(): GlobalState {
  return {
    player: createPlayer(),
    terrainConfig: {
      seaLevel: 50,
      noiseScale: 0.01,
    },
  };
}
