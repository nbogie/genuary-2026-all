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
};

window.draw = function draw() {
  background(30);
  drawAnimation(gState);
  updateAnimation(gState);
};

window.mousePressed = function mousePressed() {
  animationHandleMousePressed(gState);
};
