import "p5/global";
//@ts-ignore
import p5 from "p5";
import { createTentacle, drawTentacle, updateTentacle, type Tentacle } from "./tentacle.ts";

p5.disableFriendlyErrors = true;

let gTentacles: Tentacle[];

window.setup = function setup() {
  createCanvas(windowWidth, windowHeight);
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
  for (let i = 0; i < numTentacles / 2; i++) {
    for (let direction of [1, -1]) {
      const y = (height * (i + 1)) / (numTentacles + 1);
      const len = 0.5 * width;
      const startPos = createVector(direction > 0 ? -50 : width + 50, y);
      const endPos = createVector(direction > 0 ? 100 + len : width - 100 - len, y);
      const startRadius = 130;
      const endRadius = random(30, 10);
      const tentacle = createTentacle({
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
