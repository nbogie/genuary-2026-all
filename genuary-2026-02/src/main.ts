import "p5/global";
//@ts-ignore
import p5 from "p5";
import {
  setupAnimation,
  drawAnimation,
  updateAnimation,
  animationHandleMousePressed,
} from "./animation.ts";
import type { GlobalState } from "./globalState.ts";

p5.disableFriendlyErrors = true;
let gState: GlobalState;

window.setup = function setup() {
  const minDim = Math.min(windowWidth, windowHeight, 800);
  createCanvas(minDim, minDim);
  gState = setupAnimation();
  setBodyBackgroundAsDarkerThan("#1e1e1e");
};

window.draw = function draw() {
  background("#1e1e1e");
  drawAnimation(gState);
  updateAnimation(gState);
};

window.mousePressed = function mousePressed() {
  animationHandleMousePressed(gState);
};

function setBodyBackgroundAsDarkerThan(baseColour: string) {
  const lightnessFrac = 0.92;
  document.body.style.backgroundColor = `oklch(from ${baseColour} calc(l * ${lightnessFrac}) c h)`;
}
