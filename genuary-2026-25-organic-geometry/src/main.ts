import "p5/global";
//@ts-ignore
import p5 from "p5";
import {
  createTentacle,
  drawTentacle,
  updateTentacle,
  updateTentacleTargetTowardsNoisily,
  type Tentacle,
} from "./tentacle.ts";
import { mousePos } from "./utils/utils.ts";

p5.disableFriendlyErrors = true;

let gTentacles: Tentacle[];

window.setup = function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  gTentacles = createTentacles();
};

window.draw = function draw() {
  background(30);

  for (let tentacle of gTentacles) {
    drawTentacle(tentacle);
    updateTentacle(tentacle);
  }
};
function createTentacles(): Tentacle[] {
  const tentacles: Tentacle[] = [];
  const numTentacles = 8;
  for (let index = 0; index < numTentacles / 2; index++) {
    for (let direction of [1, -1]) {
      const y = (height * (index + 1)) / (numTentacles + 1);
      const len = 0.5 * width;
      const startPos = createVector(direction > 0 ? -50 : width + 50, y);
      const endPos = createVector(direction > 0 ? 100 + len : width - 100 - len, y);
      const startRadius = min(width, height) * 0.12;
      const endRadius = startRadius * random(0.1, 0.3);
      const tentacle = createTentacle({
        index,
        startPos,
        endPos,
        startRadius,
        endRadius,
        baseHue: direction > 0 ? randomGaussian(105, 5) : randomGaussian(270, 5),
        hueDeviation: direction > 0 ? 8 : 3,
      });
      tentacles.push(tentacle);
    }
  }
  return tentacles;
}

window.mouseMoved = function mouseMoved() {
  gTentacles.forEach((t) => updateTentacleTargetTowardsNoisily(t, mousePos()));
};
