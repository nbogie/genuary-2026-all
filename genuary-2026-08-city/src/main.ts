import "p5/global";
//@ts-ignore
import p5 from "p5";

p5.disableFriendlyErrors = true;
let myGraphics: p5.Graphics;
let config: ReturnType<typeof createConfig>;

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
  };
}

window.draw = function draw() {
  myGraphics = createGraphics(width, height, WEBGL);
  // orbitControl();
  background(30);
  myGraphics.background(30);
  randomSeed(config.seed);
  myGraphics.lights();
  const numLayers = 6;

  for (let ix = 0; ix < numLayers; ix++) {
    myGraphics.clear();
    // camera(random([-20, 20]), random([-700, -400]), 700);

    const z = map(ix, 0, numLayers - 1, 100, 300);
    drawOneLayerOfBuildingsOnto(myGraphics, z);

    const blurFraction = map(ix, 0, numLayers - 1, 0, 1);
    const blurAmount = 4 * (config.focusDepthFar ? blurFraction : 1 - blurFraction);

    myGraphics.push();

    myGraphics.fill(30, config.fogDensity * 255);
    myGraphics.noStroke();
    myGraphics.rect(-width / 2, -height / 2, myGraphics.width, myGraphics.height);
    myGraphics.filter(BLUR, blurAmount);
    myGraphics.pop();
    image(myGraphics, 0, 0);
  }
};

function drawOneLayerOfBuildingsOnto(g: p5.Graphics, z: number) {
  push();
  const worldWidth = 500;
  g.translate(randomGaussian(0, 20), randomGaussian(20, 20), 0);
  for (let x = -worldWidth; x < worldWidth; x += 20) {
    g.push();
    const y = random([0, 0, random(10, 100)]);
    if (y) {
      g.translate(x, -y / 2, z);
      const colour = pickBiased(palette.colors, 0.8);
      g.ambientMaterial(colour);
      g.box(20, y, 20);
    }

    g.pop();
  }
  pop();
  return g;
}

const palette = {
  name: "book",
  colors: ["#1c2738", "#d8b1a5", "#c95a3f", "#d1a082", "#037b68", "#be1c24"],
  stroke: "#0e0f27",
  background: "#f5b28a",
  size: 6,
  type: "chromotome",
};

window.keyPressed = function keyPressed() {
  if (key === "f") {
    config.focusDepthFar = !config.focusDepthFar;

    redraw();
  }
  if (key === " ") {
    config.seed = millis();

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
