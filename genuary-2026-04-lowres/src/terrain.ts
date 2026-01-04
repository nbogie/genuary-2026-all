import type p5 from "p5";
import { repeat } from "./utils/functional.ts";
import type { Player } from "./player.ts";
import { getPalette } from "./utils/palette.ts";

export function drawTerrainAround(player: Player, terrainConfig: TerrainConfig) {
  repeat(1000, (ix) => drawRandomTerrainBlock(player.pos, ix, terrainConfig));

  for (let x = -5000; x <= 5000; x += 1000) {
    for (let z = -5000; z <= 5000; z += 1000) {
      push();
      translate(x, 0, z);
      sphere(20, 2, 2);
      pop();
    }
  }
}
export type TerrainConfig = {
  noiseScale: number;
  seaLevel: number;
};
function drawRandomTerrainBlock(
  basePos: p5.Vector,
  ix: number,
  terrainConfig: TerrainConfig
): void {
  push();
  const worldWindowWidth = 30;
  const gridX = ix % worldWindowWidth;
  const gridZ = ix / worldWindowWidth;

  const x = snapTo(basePos.x, 10) + 10 * (gridX - worldWindowWidth / 2);
  const z = snapTo(basePos.z, 10) + 10 * (gridZ - worldWindowWidth / 2);
  let y = getTerrainHeightAt(x, z, terrainConfig);
  const seaLevel = terrainConfig.seaLevel;
  if (y > seaLevel) {
    y = seaLevel;
  }

  const pos = createVector(x, y, z);
  const { fillColour, shouldStroke } = colourForPos(pos, terrainConfig);
  fill(fillColour);
  shouldStroke ? stroke(30) : noStroke();
  push();
  translate(pos);
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

function colourForPos(pos: p5.Vector, terrainConfig: TerrainConfig) {
  const palette = getPalette();
  if (pos.y >= terrainConfig.seaLevel) {
    return { fillColour: palette.terrain.water.medium, shouldStroke: false };
  }

  return {
    fillColour: pos.y < 10 ? palette.terrain.snow : palette.terrain.grass,
    shouldStroke: true,
  };
}

function snapTo(val: number, inc: number) {
  return inc * round(val / inc);
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
