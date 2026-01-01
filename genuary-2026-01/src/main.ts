import "p5/global";
import p5 from "p5";
import { createDefaultConfig, type Config } from "./config.ts";
import { drawTree } from "./tree.ts";
import { aboutThisSourceCode, getAccessibleDescription } from "./header.ts";
import { getBackgroundColour } from "./utils/palette.ts";

/**
 * ideas:
 * draw a tree with a single uniformly scaled rectangle shape
 * have its limbs moving with noise
 * animate the blocks moving into their places to highlight how it is composed
 */
p5.disableFriendlyErrors = true;

let gConfig: Config;

window.setup = function setup() {
  createCanvas(windowWidth, windowHeight);
  gConfig = createDefaultConfig();
  frameRate(2);
  describe(getAccessibleDescription());
  background(getBackgroundColour());
};

window.draw = function draw() {
  gConfig.shouldUseBlur && filter(BLUR, 2);
  blendMode(DARKEST);
  const bgC = getBackgroundColour();

  bgC.setAlpha(30);
  background(bgC);
  blendMode(BLEND);
  drawTree(gConfig);
};

window.keyPressed = function keyPressed() {
  if (key === "a") {
    console.log(aboutThisSourceCode());
  }
  if (key === "b") {
    gConfig.shouldUseBlur = !gConfig.shouldUseBlur;
  }
  if (key === "s") {
    gConfig.shouldUseShadow = !gConfig.shouldUseShadow;
  }
  if (key === "v") {
    save();
  }
};
