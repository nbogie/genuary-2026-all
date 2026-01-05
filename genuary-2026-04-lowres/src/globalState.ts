import { createConfig, type Config } from "./config.ts";
import { createPlayer, type Player } from "./player.ts";
import { createTerrainConfig, type TerrainConfig } from "./terrain.ts";

export interface GlobalState {
  player: Player;
  terrainConfig: TerrainConfig;
  config: Config;
}

export function createGlobalState(): GlobalState {
  return {
    player: createPlayer(),
    terrainConfig: createTerrainConfig(),
    config: createConfig(),
  };
}
