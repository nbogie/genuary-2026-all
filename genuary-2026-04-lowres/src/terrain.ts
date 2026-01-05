import type p5 from "p5";
import { repeat, snapTo } from "./utils/functional.ts";
import type { Player } from "./player.ts";
import { getPalette } from "./utils/palette.ts";

export function drawTerrainAround(player: Player, terrainConfig: TerrainConfig) {
  repeat(1000, (ix) => drawRandomTerrainBlock(player.pos, ix, terrainConfig));

  drawMilePosts();
}

export type TerrainConfig = {
  noiseScale: number;
  deepSeaTopLevel: number;
  mediumSeaTopLevel: number;
  shallowSeaTopLevel: number;
  beachTopLevel: number;
  grassTopLevel: number;
  rockTopLevel: number;
  snowTopLevel: number;
};
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

  const seaLevel = terrainConfig.shallowSeaTopLevel;
  const groundY = snapTo(getTerrainHeightAt(x, z, terrainConfig), 10);
  const groundOrSeaCapY = groundY > seaLevel ? seaLevel : groundY;

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
  const pal = getPalette().terrain;
  if (pos.y >= terrainConfig.deepSeaTopLevel) {
    return { fillColour: pal.water.deepest, shouldStroke: false };
  }
  if (pos.y >= terrainConfig.mediumSeaTopLevel) {
    return { fillColour: pal.water.medium, shouldStroke: false };
  }
  if (pos.y >= terrainConfig.shallowSeaTopLevel) {
    return { fillColour: pal.water.shallowest, shouldStroke: false };
  }
  if (pos.y >= terrainConfig.beachTopLevel) {
    return { fillColour: pal.beach, shouldStroke: true };
  }
  if (pos.y >= terrainConfig.grassTopLevel) {
    return { fillColour: pal.grass, shouldStroke: true };
  }
  if (pos.y >= terrainConfig.rockTopLevel) {
    return { fillColour: pal.rocks, shouldStroke: true };
  }
  if (pos.y >= terrainConfig.snowTopLevel) {
    return { fillColour: pal.snow, shouldStroke: true };
  }
  return { fillColour: "red", shouldStroke: true };
}

function getTerrainHeightAt(x: number, z: number, terrainConfig: TerrainConfig): number {
  return map(
    noise(100000 + x * terrainConfig.noiseScale, 100000 + z * terrainConfig.noiseScale),
    0.15,
    0.85,
    -20,
    100,
    true
  );
}

export function createTerrainConfig(): TerrainConfig {
  return {
    noiseScale: 0.01,
    deepSeaTopLevel: 70,
    mediumSeaTopLevel: 60,
    shallowSeaTopLevel: 50,
    beachTopLevel: 40,
    grassTopLevel: 10,
    rockTopLevel: 0,
    snowTopLevel: -20,
  };
}
