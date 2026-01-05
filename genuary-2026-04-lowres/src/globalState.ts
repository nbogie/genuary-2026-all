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
    config: {
      lighting: {
        blueTopLightEnabled: true,
        pinkAmbientLightEnabled: false,
        whiteDirectionalLightEnabled: false,
      },
    },
  };
}

export type Config = {
  lighting: {
    blueTopLightEnabled: boolean;
    pinkAmbientLightEnabled: boolean;
    whiteDirectionalLightEnabled: boolean;
  };
};
