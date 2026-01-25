import "p5/global";
//@ts-ignore
import p5 from "p5";
import { buildTentacle, drawTentacle, updateTentacle, type Tentacle } from "./tentacle.ts";

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
  const numTentacles = 5;
  for (let i = 0; i < 5; i++) {
    const y = (height * (i + 1)) / (numTentacles + 1);
    const len = random(0.4, 0.5) * width;
    const startPos = createVector(-50, y);
    const endPos = createVector(100 + len, y);
    const startRadius = random(100, 200);
    const endRadius = random(50, 10);
    const tentacle = buildTentacle(startPos, endPos, startRadius, endRadius);
    tentacles.push(tentacle);
  }
  return tentacles;
}
