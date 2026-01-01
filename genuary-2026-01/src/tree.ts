import type { Config } from "./config.ts";
import { getBackgroundColour, getTreeColour } from "./utils/palette.ts";

export function drawTree(config: Config) {
  const startPos = calcStartingPoint();
  rectMode(CENTER);
  push();
  translate(startPos);
  rotate(-PI / 2);

  const { sectionLength, sectionAspectRatio } = config;
  const w = sectionLength;
  const h = w / sectionAspectRatio;
  config.shouldUseShadow && setShadowBlur();
  drawTreeRecursive(w, h, 0, config);
  pop();
}

function drawTreeRecursive(w: number, h: number, depth: number, config: Config) {
  if (depth > config.maxDepth) {
    return;
  }
  push();
  config.shouldDrawMarkers && drawMarker("dodgerblue", 20);

  translate(createVector(w / 2, 0));
  noStroke();
  fill(getTreeColour());
  rect(0, 0, w, h);
  translate(w * 0.45, 0);

  const quitEarly = depth > 1 && random() < 0.1;
  const numBranches = quitEarly ? 0 : random([1, 2, 2, 2, 2, 3]);
  for (let i = 0; i < numBranches; i++) {
    push();
    const angle = randomGaussian(0, PI / 10);
    rotate(angle);
    const scaling = constrain(randomGaussian(0.8, 0.1), 0.1, 0.9);
    scale(scaling);
    drawTreeRecursive(w, h, depth + 1, config);
    config.shouldDrawMarkers && drawMarker("tomato", 10);
    pop();
  }
  pop();
}

function calcStartingPoint() {
  return createVector(random(0.2, 0.8) * width, height * 0.8);
}

function setShadowBlur() {
  (drawingContext as CanvasRenderingContext2D).shadowBlur = 10;
  (drawingContext as CanvasRenderingContext2D).shadowColor = getBackgroundColour().toString();
}
function disableBlur() {
  (drawingContext as CanvasRenderingContext2D).shadowBlur = 0;
}

function drawMarker(colourStr: string, diameter: number) {
  push();
  disableBlur();
  fill(colourStr);
  circle(0, 0, diameter);
  pop();
}
