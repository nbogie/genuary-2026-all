import "p5/global";
//@ts-ignore
import p5 from "p5";

p5.disableFriendlyErrors = true;
type Config = ReturnType<typeof createConfig>;
type PartialConfig = Partial<Config>;
let config: Config;
let palette: ReturnType<typeof createPalette>;

window.setup = function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(2);
  config = createConfig();
  palette = createPalette();
  noLoop();
};

function createConfig() {
  return {
    focusDepthFar: random([true, false]),
    seed: 123,
    fogDensity: 0.1,
    buildingWidth: 30,
    shouldRotateY: true as boolean | "mixed",
    wireframe: random([true, false, false, false]),
    shouldDrawFraming: false,
  };
}

window.draw = function draw() {
  background(palette.background);
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

  if (config.shouldDrawFraming) {
    drawFraming();
  }
};

function drawFraming() {
  //currently the skylines don't leave enough space to put this in
  const gapWidth = 10;
  const fakeHeight = height - gapWidth;
  for (let i = 0; i <= 3; i++) {
    const y = map(i, 0, 3, 0, fakeHeight, true);
    fill(50);
    noStroke();
    rect(0, y, width, gapWidth);
  }
}
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

    layerG.push();

    const fogColour = color(palette.fogColour);
    fogColour.setAlpha(config.fogDensity * 255);
    layerG.fill(fogColour);
    layerG.noStroke();
    layerG.rect(-layerG.width / 2, -layerG.height / 2, layerG.width, layerG.height);

    const blurFraction = map(ix, 0, numLayers - 1, 0, 1);
    const focusDepthFar = config.wireframe
      ? false
      : configOverride.focusDepthFar ?? config.focusDepthFar;
    const shouldBlur = !config.wireframe;
    const blurAmount = 4 * (focusDepthFar ? blurFraction : 1 - blurFraction);

    if (shouldBlur) {
      layerG.filter(BLUR, blurAmount);
    }
    layerG.pop();
    finalG.image(layerG, 0, 0);
  }
  return finalG;
}
function drawOneLayerOfBuildingsOnto(g: p5.Graphics, z: number, partialConfig: PartialConfig) {
  push();
  g.push();
  const worldWidth = 500;

  const layerXOffset = randomGaussian(0, 5);
  g.translate(layerXOffset, 50 + z / 10, 0);
  for (let x = -worldWidth; x < worldWidth; x += config.buildingWidth * 1.1) {
    g.push();
    const maxBuildingHeight = config.buildingWidth * 5;
    const y = random([0, 0, random(0.1, 1) * maxBuildingHeight]);
    if (y) {
      g.translate(x, -y / 2, z);
      const w = config.buildingWidth;
      // g.rotateX(random(-1, 1) * 0.1);
      // g.rotateZ(random(-1, 1) * 0.02);
      if (partialConfig.shouldRotateY === true) {
        g.rotateY(random(-1, 1) * 0.9);
      }

      if (config.wireframe) {
        g.stroke(palette.stroke);
        g.noFill();
      } else {
        const colour = pickBiased(palette.colors, 0.8);
        g.ambientMaterial(colour);
        g.noStroke();
      }

      g.box(w, y, w);
    }

    g.pop();
  }
  g.pop();
  pop();
  return g;
}
window.windowResized = function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
};

window.keyPressed = function keyPressed() {
  if (key === "f") {
    config.focusDepthFar = !config.focusDepthFar;

    redraw();
  }
  if (key === " ") {
    config.seed = millis();
    config.shouldRotateY = random([true, false, "mixed", "mixed"]);
    config.wireframe = random([true, false]);
    palette = createPalette();

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

function createPalette() {
  const palette1 = {
    name: "book",
    colors: ["#1c2738", "#d8b1a5", "#c95a3f", "#d1a082", "#037b68", "#be1c24"],
    stroke: "#0e0f27",
    background: "#f5b28a",
    fogColour: "#1e1e1e",
    size: 6,
    type: "chromotome",
  };
  const paletteBlueprint = (() => {
    const bg = random(["dodgerblue", "#1c2738", "#1c2738", "#1c2738"]);
    return {
      name: "blueprint-book",
      colors: ["#1c2738", "#d8b1a5", "#c95a3f", "#d1a082", "#037b68", "#be1c24"],
      stroke: "white",
      background: bg,
      fogColour: bg,
      size: 6,
      type: "chromotome",
    };
  })();
  return random([palette1, paletteBlueprint]);
}
