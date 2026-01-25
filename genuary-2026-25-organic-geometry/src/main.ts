import "p5/global";
import p5 from "p5";
import {
  attractTentaclesTowards,
  createTentacle,
  drawTentacle,
  updateTentacle,
  type Tentacle,
} from "./tentacle.ts";
import { mousePos } from "./utils/utils.ts";

p5.disableFriendlyErrors = true;

let gTentacles: Tentacle[];
let gConfig: ReturnType<typeof createConfig>;

window.setup = function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  gConfig = createConfig();
  gTentacles = createTentacles();
};

window.draw = function draw() {
  background(30);

  for (let tentacle of gTentacles) {
    drawTentacle(tentacle);
    updateTentacle(tentacle);
  }
};

function createConfig() {
  return { numSegments: looksLikeMobile() ? 50 : 80, numTentacles: looksLikeMobile() ? 6 : 8 };
}

function looksLikeMobile() {
  return width < 600;
}

function createTentacles(): Tentacle[] {
  const tentacles: Tentacle[] = [];
  const numTentacles = gConfig.numTentacles;
  for (let index = 0; index < numTentacles / 2; index++) {
    for (let direction of [1, -1]) {
      const y = (height * (index + 1)) / (numTentacles + 1);
      const len = 0.5 * width;
      const startPos = createVector(direction > 0 ? -50 : width + 50, y);
      const endPos = createVector(direction > 0 ? 100 + len : width - 100 - len, y);
      const startRadius = min(width, height) * 0.12;
      const endRadius = startRadius * random(0.1, 0.3);
      const numSegments = gConfig.numSegments;
      const tentacle = createTentacle({
        index,
        startPos,
        endPos,
        startRadius,
        endRadius,
        baseHue: direction > 0 ? randomGaussian(105, 5) : randomGaussian(270, 5),
        hueDeviation: direction > 0 ? 8 : 3,
        numSegments,
      });
      tentacles.push(tentacle);
    }
  }
  return tentacles;
}

window.mouseMoved = function mouseMoved() {
  attractTentaclesTowards(gTentacles, mousePos());
};

window.mouseDragged = function mouseDragged() {
  attractTentaclesTowards(gTentacles, mousePos());
};
