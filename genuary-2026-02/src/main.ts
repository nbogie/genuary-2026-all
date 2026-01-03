import "p5/global";
//@ts-ignore
import p5 from "p5";
import { randomColour } from "./utils/palette.ts";

p5.disableFriendlyErrors = true;

window.setup = function setup() {
  createCanvas(windowWidth, windowHeight);
  background(30);
  noLoop();
};

window.draw = function draw() {
  fill(randomColour());
  circle(200, 300, 200);
};
