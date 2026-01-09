import "p5/global";
//@ts-ignore
import p5 from "p5";

p5.disableFriendlyErrors = true;
type Config = ReturnType<typeof createConfig>;
type PartialConfig = Partial<Config>;
let config: Config;
let palette: Palette;
let timeouts: number[] = [];

type Palette = {
  name: string;
  colors: string[];
  stroke: string;
  background: string;
  wireframeBackground: string;
  fog: string;
  framing: string;
  size: number;
  weightOverride?: number;
  type: string;
};

window.setup = function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(2);
  config = createConfig();
  palette = createPalette();
  noLoop();
};

type FilterName = "INVERT" | "GRAY" | "THRESHOLD" | "POSTERIZE";

function createConfig() {
  return {
    focusDepthFar: random([true, false]),
    invertFocus: false,
    useTVNoise: true,
    seed: 123,
    fogDensity: 0.1,
    shouldRotateOnXAndZ: false,
    buildingWidth: 30,
    shouldRotateY: true as boolean | "mixed",
    wireframe: random() < 0.1,
    shouldDrawFraming: true,
    wildcardFilters: false,
    extraFilter: random(["POSTERIZE", undefined, undefined, undefined]) as undefined | FilterName,
  };
}

window.draw = function draw() {
  background(config.wireframe ? palette.wireframeBackground : palette.background);
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
    fill(palette.framing);
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

  const distortFrontRowsIfAny = false;

  for (let ix = 0; ix < numLayers; ix++) {
    layerG.clear();
    /** 0 when layer is furthest, 1 when foreground layer */
    const zFraction = map(ix, 0, numLayers - 1, 0, 1, true);

    // camera(random([-20, 20]), random([-700, -400]), 700);

    //originally, -100
    // const maxZ = random([-1000, -500, -500, -100, -100]);
    const maxZ = random([-100, -100, -200]);
    const z = map(ix, 0, numLayers - 1, maxZ, 250);
    drawOneLayerOfBuildingsOnto(layerG, z, configOverride);

    layerG.push();

    const fogColour = color(palette.fog);
    fogColour.setAlpha(config.fogDensity * 255);
    layerG.fill(fogColour);
    layerG.noStroke();
    layerG.rect(-layerG.width / 2, -layerG.height / 2, layerG.width, layerG.height);

    const blurFraction = map(ix, 0, numLayers - 1, 0, 1);
    const focusDepthFar = config.wireframe
      ? false
      : (configOverride.focusDepthFar ?? config.focusDepthFar) !== config.invertFocus;
    const shouldBlur = !config.wireframe;
    const blurAmount = 4 * (focusDepthFar ? blurFraction : 1 - blurFraction);

    if (shouldBlur) {
      layerG.filter(BLUR, blurAmount);
    }
    if (
      config.useTVNoise &&
      ((distortFrontRowsIfAny && zFraction > 0.5) || (!distortFrontRowsIfAny && zFraction < 0.5))
    ) {
      // Pass dynamic values to the shader
      // tvNoiseShader.copyToContext(layerG);
      //TODO:this should be compiled once and copied to the context when needed
      //TODO: dispose of this
      //TODO: check if it is messing with alpha - can we see behind a layer it has touched?
      const tvNoiseShader = layerG.createFilterShader(fragSrc);
      tvNoiseShader.setUniform("time", random());
      tvNoiseShader.setUniform("distortionAmount", random([0.1, 0.01]));
      layerG.filter(tvNoiseShader);
    }

    const extraFilter = config.wildcardFilters
      ? random(["GRAY", "INVERT", "POSTERIZE", "THRESHOLD"] satisfies FilterName[])
      : config.extraFilter;

    if (extraFilter === "POSTERIZE") {
      if (random() < 0.5) {
        layerG.filter(POSTERIZE, random([1, 2, 3]));
      }
    }
    if (extraFilter === "INVERT") {
      layerG.filter(INVERT);
    }
    if (extraFilter === "THRESHOLD") {
      layerG.filter(THRESHOLD);
    }
    if (extraFilter === "GRAY") {
      layerG.filter(GRAY);
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
    const y = random() < 0.6 ? 0 : random(0.2, 1) * maxBuildingHeight;
    if (y) {
      g.translate(x, -y / 2, z);
      const w = config.buildingWidth;
      if (config.shouldRotateOnXAndZ) {
        g.rotateX(random(-1, 1) * 0.1);
        g.rotateZ(random(-1, 1) * 0.03);
      }
      if (partialConfig.shouldRotateY === true) {
        g.rotateY(random(-1, 1) * 0.6);
      }

      if (config.wireframe) {
        g.stroke(palette.stroke);
        g.noFill();
      } else {
        const colour = pickBiased(palette.colors, palette.weightOverride ?? 0.8);
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
window.mousePressed = function mousePressed() {
  config.invertFocus = !config.invertFocus;
  redraw();
};
window.keyPressed = function keyPressed() {
  if (key === "f") {
    config.focusDepthFar = !config.focusDepthFar;
    redraw();
  }

  if (key === "w") {
    config.seed = millis();
    config.wildcardFilters = true;
    redraw();
  }

  if (key === " ") {
    config.seed = millis();
    config.useTVNoise = random([true, false]);
    config.shouldRotateY = random([true, false, "mixed", "mixed"]);
    config.wireframe = random() < 0.08;
    config.shouldRotateOnXAndZ = random() < 0.2;
    config.wildcardFilters = random() < 0.1;
    // config.fogDensity = random([0.1, 0.15, 0.2, 0.25, 0.3]);
    palette = createPalette();
    redraw();

    if (!config.wireframe) {
      clearAllTimeouts();
      //schedule some focus-flipped redraws
      timeouts.push(
        setTimeout(() => {
          config.invertFocus = !config.invertFocus;
          redraw();
        }, 2000)
      );
      timeouts.push(
        setTimeout(() => {
          config.invertFocus = !config.invertFocus;
          redraw();
        }, 4000)
      );
    }
  }
  if (key === ".") {
    config.fogDensity += 0.05;
    redraw();
  }
  if (key === ",") {
    config.fogDensity -= 0.05;
    redraw();
  }

  if (key === "0") {
    config.extraFilter = undefined;
    redraw();
  }
  if (key === "1") {
    toggleExtraFilter("INVERT");
    redraw();
  }
  if (key === "2") {
    toggleExtraFilter("GRAY");
    redraw();
  }
  if (key === "3") {
    toggleExtraFilter("THRESHOLD");
    redraw();
  }
  if (key === "4") {
    toggleExtraFilter("POSTERIZE");
    redraw();
  }
};

function toggleExtraFilter(filterName: FilterName) {
  if (config.extraFilter !== filterName) {
    config.extraFilter = filterName;
  } else {
    config.extraFilter = undefined;
  }
}
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

function createPalette(): Palette {
  const palette1: Palette = {
    name: "book",
    colors: ["#1c2738", "#d8b1a5", "#c95a3f", "#d1a082", "#037b68", "#be1c24"],
    stroke: "#0e0f27",
    background: "#f5b28a",
    wireframeBackground: "#d8b1a5",
    framing: "#d1a082", //"#0e0f27",
    fog: "#1e1e1e",
    size: 6,
    type: "chromotome",
  };

  const palette2: Palette = {
    name: "system.#05",
    colors: ["#2e3853", "#3e6a90", "#a3c9d3", "#d1e1e1", "#db4549"],
    stroke: "linen",
    background: "#141823ff",
    wireframeBackground: "#141823ff",
    framing: "#3e6a90",
    fog: "#141823ff",
    size: 5,
    weightOverride: 0.65,
    type: "chromotome",
  };

  const paletteBlueprint: Palette = (() => {
    return {
      name: "blueprint-book",
      colors: ["#1c2738", "#d8b1a5", "#c95a3f", "#d1a082", "#037b68", "#be1c24"],
      stroke: "white",
      background: "#1c2738",
      fog: "#1c2738",
      framing: "#c95a3f",
      wireframeBackground: "dodgerblue",
      size: 6,
      type: "chromotome",
    };
  })();
  return random([palette1, palette2, paletteBlueprint]);
}

function clearAllTimeouts() {
  timeouts.forEach((t) => clearTimeout(t));
  timeouts = [];
}

/** @AI: gemini (LLM) wrote this shader for me */
const fragSrc = `
  precision highp float;
  varying vec2 vTexCoord;
  uniform sampler2D tex0;
  uniform float time;
  uniform float distortionAmount;

  float noise(float p) {
    return fract(sin(p) * 43758.5453123);
  }

  void main() {
    vec2 uv = vTexCoord;
    
    // Calculate row-based jitter
    float row = floor(uv.y * 50.0); 
    float jitter = noise(row + time) * 2.0 - 1.0;
    
    // Only apply offset to specific random rows
    if (noise(row + time * 0.5) > 0.7) {
      uv.x += jitter * distortionAmount;
    }

    vec4 color = texture2D(tex0, uv);
    gl_FragColor = vec4(color.rgb, 1.0);
  }`;
