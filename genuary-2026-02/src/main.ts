import "p5/global";
//@ts-ignore
import p5 from "p5";
import {
  setupAnimation,
  drawAnimation,
  updateAnimation,
  type GlobalState,
  animationHandleMousePressed,
} from "./animation.ts";

p5.disableFriendlyErrors = true;
let gState: GlobalState;

window.setup = function setup() {
  createCanvas(windowWidth, windowHeight);
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
