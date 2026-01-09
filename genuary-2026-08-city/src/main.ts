import "p5/global";
//@ts-ignore
import p5 from "p5";

p5.disableFriendlyErrors = true;
type Config = ReturnType<typeof createConfig>;
type PartialConfig = Partial<Config>;
let config: Config;

window.setup = function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(2);
  config = createConfig();
};

function createConfig() {
  return {
    focusDepthFar: random([true, false]),
    seed: 123,
    fogDensity: 0.1,
    buildingWidth: 30,
    shouldRotateY: true as boolean | "mixed",
  };
}

window.draw = function draw() {
  background(30);
  const numSkylines = 3;
  for (let ix = 0; ix < numSkylines; ix++) {
    const img = drawOneSkyline({
      seed: config.seed + ix,
      focusDepthFar: random([true, false]),
      shouldRotateY:
        config.shouldRotateY === "mixed" ? [true, false][ix % 2] : config.shouldRotateY,
    });
    const h = map(ix, 0, numSkylines, 0, 1, true) * height;
    image(img, 0, h);
  }
};

function drawOneSkyline(configOverride: PartialConfig) {
  const layerG = createGraphics(width, height / 3, WEBGL);
  const finalG = createGraphics(width, height / 3);

  layerG.background(30);
  randomSeed(configOverride.seed ?? config.seed);
  layerG.lights();
  const numLayers = 6;

  for (let ix = 0; ix < numLayers; ix++) {
    layerG.clear();
    // camera(random([-20, 20]), random([-700, -400]), 700);
    const z = map(ix, 0, numLayers - 1, -100, 300);
    drawOneLayerOfBuildingsOnto(layerG, z, configOverride);

    const blurFraction = map(ix, 0, numLayers - 1, 0, 1);
    const focusDepthFar = configOverride.focusDepthFar ?? config.focusDepthFar;
    const blurAmount = 4 * (focusDepthFar ? blurFraction : 1 - blurFraction);

    layerG.push();

    layerG.fill(30, config.fogDensity * 255);
    layerG.noStroke();
    layerG.rect(-width / 2, -height / 2, layerG.width, layerG.height);
    layerG.filter(BLUR, blurAmount);
    layerG.pop();
    finalG.image(layerG, 0, 0);
  }
  return finalG;
}
function drawOneLayerOfBuildingsOnto(g: p5.Graphics, z: number, partialConfig: PartialConfig) {
  push();
  const worldWidth = 500;

  const layerXOffset = randomGaussian(0, 5);
  g.translate(layerXOffset, 20 - z / 10, 0);
  for (let x = -worldWidth; x < worldWidth; x += config.buildingWidth * 1.1) {
    g.push();
    const maxBuildingHeight = config.buildingWidth * 5;
    const y = random([0, 0, random(0.1, 1) * maxBuildingHeight]);
    if (y) {
      g.translate(x, -y / 2, z);
      const colour = pickBiased(palette.colors, 0.8);
      g.ambientMaterial(colour);
      const w = config.buildingWidth;
      g.noStroke();
      // g.rotateX(random(-1, 1) * 0.1);
      // g.rotateZ(random(-1, 1) * 0.02);
      if (partialConfig.shouldRotateY === true) {
        g.rotateY(random(-1, 1) * 0.9);
      }
      g.box(w, y, w);
    }

    g.pop();
  }
  pop();
  return g;
}

window.keyPressed = function keyPressed() {
  if (key === "f") {
    config.focusDepthFar = !config.focusDepthFar;

    redraw();
  }
  if (key === " ") {
    config.seed = millis();
    config.shouldRotateY = random([true, false, "mixed", "mixed"]);

    redraw();
  }
  if (key === ".") {
    config.fogDensity += 0.05;
    redraw();
  }
  if (key === ",") {
    config.fogDensity -= 0.05;
    redraw();
  }
};

/**
 * Pick from an array preferring the earlier elements, based on exponential distribution
 */
function pickBiased<T>(arr: T[], decay = 0.5): T {
  if (arr.length === 0) {
    throw new Error("can't pick from empty array");
  }
  const arrayLength = arr.length;
  const index = Math.floor(Math.log(1 - random()) / Math.log(1 - decay));
  const indexCapped = Math.min(index, arrayLength - 1);
  return arr[indexCapped];
}

const palette = {
  name: "book",
  colors: ["#1c2738", "#d8b1a5", "#c95a3f", "#d1a082", "#037b68", "#be1c24"],
  stroke: "#0e0f27",
  background: "#f5b28a",
  size: 6,
  type: "chromotome",
};
