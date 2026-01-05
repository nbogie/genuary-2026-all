import type p5 from "p5";
import type { Player } from "./player.ts";
import { repeat, snapTo } from "./utils/functional.ts";
import { getPalette } from "./utils/palette.ts";

type TerrainNoiseContribution = {
  freq: number;
  maxContrib: number;
};
type TerrainLevels = {
  deepSeaTopLevel: number;
  mediumSeaTopLevel: number;
  shallowSeaTopLevel: number;
  beachTopLevel: number;
  grassTopLevel: number;
  rockTopLevel: number;
  snowTopLevel: number;
};

export type BiomeTerrainConfig = {
  baseNoiseScale: number;
  contributions: TerrainNoiseContribution[];
};

export type TerrainConfig = {
  shouldDrawMilePosts: boolean;
  biomeConfig: BiomeTerrainConfig;
  levels: TerrainLevels;
};

export function drawTerrainAround(player: Player, terrainConfig: TerrainConfig) {
  repeat(1005, (ix) => drawRandomTerrainBlock(player.pos, ix, terrainConfig));
  if (terrainConfig.shouldDrawMilePosts) {
    drawMilePosts();
  }
}

function drawMilePosts() {
  for (let x = -5000; x <= 5000; x += 1000) {
    for (let z = -5000; z <= 5000; z += 1000) {
      push();
      noStroke();

      translate(x, 0, z);
      box(10, 10, 10);
      pop();
    }
  }
}

function drawRandomTerrainBlock(
  basePos: p5.Vector,
  ix: number,
  terrainConfig: TerrainConfig
): void {
  push();
  const worldWindowWidth = 30;
  const gridX = ix % worldWindowWidth;
  const gridZ = ix / worldWindowWidth;

  const x = snapTo(basePos.x, 10) + snapTo(10 * (gridX - worldWindowWidth / 2), 10);
  const z = snapTo(basePos.z, 10) + snapTo(10 * (gridZ - worldWindowWidth / 2), 10);

  const seaLevel = terrainConfig.levels.shallowSeaTopLevel;
  const groundY = snapTo(getTerrainHeightAt(x, z, terrainConfig), 10);
  const seaCheatShift = 5; //move sea up by some amount (0 - 10) to meet sand
  const groundOrSeaCapY = groundY >= seaLevel ? seaLevel - seaCheatShift : groundY;

  const posGroundMaybeSubmarine = createVector(x, groundY, z);
  const posGroundMaybeSeaLevelCapped = createVector(x, groundOrSeaCapY, z);
  const { fillColour, shouldStroke } = colourForPos(posGroundMaybeSubmarine, terrainConfig);
  fill(fillColour);
  shouldStroke ? stroke(30) : noStroke();
  noStroke();
  push();
  translate(posGroundMaybeSeaLevelCapped);
  box(10, 10, 10);
  pop();
  pop();
}

export function randomWorldPos() {
  const extent = 500;
  return createVector(
    round(random(-extent, extent)),
    round(random(-extent / 10, extent / 10)),
    round(random(-extent, extent))
  );
}

function colourForPos(
  pos: p5.Vector,
  terrainConfig: TerrainConfig
): { fillColour: string; shouldStroke: boolean } {
  const levels = terrainConfig.levels;
  const pal = getPalette().terrain;
  if (pos.y >= levels.deepSeaTopLevel) {
    return { fillColour: pal.water.deepest, shouldStroke: false };
  }
  if (pos.y >= levels.mediumSeaTopLevel) {
    return { fillColour: pal.water.medium, shouldStroke: false };
  }
  if (pos.y >= levels.shallowSeaTopLevel) {
    return { fillColour: pal.water.shallowest, shouldStroke: false };
  }
  if (pos.y >= levels.beachTopLevel) {
    return { fillColour: pal.beach, shouldStroke: true };
  }
  if (pos.y >= levels.grassTopLevel) {
    return { fillColour: pal.grass, shouldStroke: true };
  }
  if (pos.y >= levels.rockTopLevel) {
    return { fillColour: pal.rocks, shouldStroke: true };
  }
  if (pos.y >= levels.snowTopLevel) {
    return { fillColour: pal.snow, shouldStroke: true };
  }
  return { fillColour: "red", shouldStroke: true };
}

export function createTerrainConfig(): TerrainConfig {
  return {
    shouldDrawMilePosts: false,
    biomeConfig: createBiomeConfig("simplest"),
    levels: {
      deepSeaTopLevel: 70,
      mediumSeaTopLevel: 60,
      shallowSeaTopLevel: 50,
      beachTopLevel: 40,
      grassTopLevel: 20,
      rockTopLevel: 10,
      snowTopLevel: -20,
    },
  };
}

function getTerrainHeightAt(x: number, z: number, terrainConfig: TerrainConfig): number {
  const cfg = terrainConfig.biomeConfig;

  //add a value for each
  const contributionsAndResults = cfg.contributions.map((c) => ({
    ...c,
    value: 0,
  }));

  //sum each layer
  for (let [ix, contribution] of contributionsAndResults.entries()) {
    //offset to avoid symmetries around 0
    const offset = (ix + 1) * 100_000;
    //just for fun, terrain races initially
    const scrollInOffset = -min(millis(), 1000) / 300;
    const mapped = map(
      noise(
        offset + x * cfg.baseNoiseScale * contribution.freq,
        scrollInOffset + offset + z * cfg.baseNoiseScale * contribution.freq,
        offset
      ),
      0.15,
      0.85,
      0,
      contribution.maxContrib,
      true
    );
    contribution.value = mapped;
  }

  const totals = contributionsAndResults.reduce(
    (acc, curr) => ({
      value: acc.value + curr.value,
      maxPossible: acc.maxPossible + curr.maxContrib,
    }),
    { value: 0, maxPossible: 0 }
  );

  const mx = totals.maxPossible;
  return map(totals.value, 0, mx, -20, 100, true);
}

export function createBiomeConfig(biomeName: "plains" | "simplest" | "weird"): BiomeTerrainConfig {
  switch (biomeName) {
    case "plains":
      return {
        contributions: [
          { maxContrib: 1, freq: 1 },
          { maxContrib: 1, freq: 1 },
          { maxContrib: 0.5, freq: 4 },
          { maxContrib: 0.25, freq: 8 },
        ],
        baseNoiseScale: 0.003,
      };
    case "simplest":
      return {
        contributions: [{ maxContrib: 1, freq: 1 }],
        baseNoiseScale: 0.01,
      };
    case "weird":
      return {
        contributions: [
          { maxContrib: 1, freq: 1 },
          { maxContrib: 0.5, freq: 2 },
        ],
        baseNoiseScale: 0.01,
      };
    default:
      throw new Error("unhandled biome name");
  }
}
