import "p5/global";
//@ts-ignore
import p5 from "p5";

//Credits: hatching algorithm loosely (and lazily) following that described by Arwan Beetooh (R1B2) here: https://www.r1b2.com/2022/01/28/mining-structures-walkthrough/, via Duaran on birb's nest discord.
p5.disableFriendlyErrors = true;

interface BoulderConfig {
  maxRadius: number;
  numVerts: number;
  radiusVariation: number;
}

interface Boulder {
  originalGroundTouchPos: p5.Vector;
  currentGroundTouchPos: p5.Vector;
  pts: p5.Vector[];
  config: BoulderConfig;
  fillColour: string;
}

type Config = {
  shouldShowBoulderShadow: boolean;
  lightDirection: p5.Vector;
  seed: number;
  isLightOn: boolean;
  generationTimeMillis: number;
};

type Edge = { a: p5.Vector; b: p5.Vector; normal: p5.Vector; midpoint: p5.Vector };
type Palette = {
  readonly colours: string[];
  readonly background: string;
  readonly backgroundDark: string;
  readonly stroke: string;
};

let gBoulders: Boulder[];
let gConfig: Config;
let gPalette: Palette;
let gFloorLines: FloorLine[];
type LightHistoryEntry = { wasOn: boolean; startMillis: number; endMillis?: number };
let gLightsHistory: LightHistoryEntry[] = [];

window.setup = function setup() {
  createCanvas(min(windowWidth, 1000), 400);
  frameRate(5);
  gConfig = {
    isLightOn: false,
    seed: 123,
    lightDirection: createVector(0, 1),
    shouldShowBoulderShadow: false,
    generationTimeMillis: millis(),
  };
  setInterval(maybeToggleLights, 1000);
  setInterval(maybeRegenerate, 1000);
  regenerate();
  describe(
    [
      "Some mischievious rocks shuffle around in the dark, ",
      "playing dead when the lights are turned on.",
    ].join("")
  );
  setCredits(
    [
      "The hatching algorithm is loosely (and lazily) following that ",
      "described by Arwan Beetooh (R1B2) in this great write-up: ",
      "https://www.r1b2.com/2022/01/28/mining-structures-walkthrough/, ",
      "via @Duaran on birb's-nest discord.",
    ].join("")
  );
};

function maybeToggleLights() {
  //if lights have been in one state more than n seconds, definitely change them
  //otherwise, change them with some probability based on how long they've been in that state

  const millisInCurrentState = millis() - gLightsHistory.at(-1)!.startMillis;
  if (millisInCurrentState > 5000) {
    toggleLights();
    return;
  }
  const prob = map(millisInCurrentState, 0, 5000, 0, 0.9, true);
  if (noise(millis() * 3333) < prob) {
    toggleLights();
  }
}
function maybeRegenerate() {
  const millisInCurrentGeneration = millis() - gConfig.generationTimeMillis;
  if (gConfig.isLightOn) {
    return;
  }
  if (millisInCurrentGeneration > 10000) {
    regenerate();
  }
}

function regenerate() {
  gConfig.seed = millis();
  gPalette = createPalette();
  gBoulders = createBoulders();
  gFloorLines = generateFloorLines();
  gLightsHistory = [{ wasOn: gConfig.isLightOn, startMillis: millis(), endMillis: undefined }];
  gConfig.generationTimeMillis = millis();
}

window.draw = function draw() {
  drawAll();
  updateAll();
};

function updateAll() {
  if (gConfig.isLightOn) {
    return;
  }
  gBoulders.forEach(updateBoulderScurry);
}

function updateBoulderScurry(boulder: Boulder) {
  //mostly sideways
  const angle = random([0, PI]); //randomGaussian(0, PI / 8);
  const speed = random([-1, 1]) * random(10);
  const vel = p5.Vector.fromAngle(angle, speed);
  boulder.currentGroundTouchPos.add(vel);
}

function drawAll() {
  setBackgrounds();
  push();
  if (gConfig.isLightOn) {
    randomSeed(gConfig.seed);
  }
  drawFloorLines(gFloorLines);

  gBoulders.forEach((b) => drawBoulder(b));
  pop();

  //if lights off, draw a layer of background colour over top to dim the scene.
  if (!gConfig.isLightOn) {
    const bgLayer = color(gPalette.backgroundDark);
    bgLayer.setAlpha(150);
    background(bgLayer);
  }
}
type LineSeg = {
  a: p5.Vector;
  b: p5.Vector;
};

type FloorLine = {
  segs: LineSeg[];
  direction: 1 | -1;
};

function generateFloorLines(): FloorLine[] {
  const lines: FloorLine[] = [];

  const fracs = [0.6, 0.65, 0.73, 0.9];
  const topY = fracs[0] * height;

  lines.push({
    direction: 1,
    segs: [{ a: createVector(0, topY), b: createVector(width, topY) }],
  });

  for (let yFrac of fracs) {
    const y = height * yFrac;
    const startX = random(0.1, 0.8) * width;
    const lineW = width / 6;
    const gapSize = lineW / 7;
    const lineEnd1 = startX + lineW;
    const floorLine: FloorLine = { direction: random([-1, 1]), segs: [] };
    floorLine.segs.push({ a: createVector(startX, y), b: createVector(lineEnd1, y) });

    if (random() < 0.35) {
      const lineStart2 = lineEnd1 + gapSize;
      floorLine.segs.push({
        a: createVector(lineStart2, y),
        b: createVector(lineStart2 + gapSize, y),
      });
    }
    lines.push(floorLine);
  }
  return lines;
}

function drawFloorLines(floorLines: FloorLine[]) {
  push();
  const strokeC = gConfig.isLightOn ? color(gPalette.stroke) : darkerStroke(gPalette);
  stroke(strokeC);
  strokeWeight(2);
  for (let floorLine of floorLines) {
    push();
    translate(floorLine.direction < 1 ? width : 0, 0);
    scale(floorLine.direction, 1);
    for (let { a, b } of floorLine.segs) {
      line(a.x, a.y, b.x, b.y);
    }
    pop();
  }
  pop();
}

function hatchWithLines(
  boulderConfig: BoulderConfig,
  boulderPoints: p5.Vector[],
  strokeColour: p5.Color
) {
  stroke(strokeColour);
  const edges = calcEdgesFromPoints(boulderPoints);

  edges.forEach((edge) => hatchOneEdge(edge, boulderConfig));
}
function hatchOneEdge(edge: Edge, cfg: BoulderConfig) {
  push();
  const strokeWt = random([1, 2]);
  // const angle = edge.normal.heading();
  // const colour2 = color(random(palette.colors));
  // colour2.setAlpha(30);
  for (let angle of [0, 1, 2, 3].map((n) => PI / 4 + ((n + 1) * PI) / 2)) {
    strokeWeight(strokeWt);
    for (let frac = 0; frac <= 1; frac += random(0.01, 0.2)) {
      const normalContrib = gConfig.isLightOn ? constrain(-edge.normal.y * 2, 0, 1) : 1;
      const strokeColour = gConfig.isLightOn ? normalStroke(gPalette) : darkerStroke(gPalette);
      stroke(strokeColour);
      const len = cfg.maxRadius * random(0.1, 0.4) * normalContrib;
      const start = p5.Vector.lerp(edge.a, edge.b, frac);
      const offset = p5.Vector.fromAngle(angle, len);
      const end = p5.Vector.add(start, offset);
      line(start.x, start.y, end.x, end.y);
      if (random() < 0.15) {
        //draw terminating dot
        push();
        strokeWeight(strokeWt * random([1.2, 1.5, 2, 2]));
        p5.Vector.add(end, p5.Vector.random2D().mult(random([0.1, 0.1, 1, 2]) * strokeWt));
        point(end);
        pop();
      }
      if (random() < 0.02) {
        //draw trail of dots
        push();
        strokeWeight(strokeWt);

        for (let frac of [1, 2, 3, 4]) {
          const dotPos = p5.Vector.add(end, offset.copy().setMag(frac * (cfg.maxRadius / 20))).add(
            p5.Vector.random2D().mult(random(0, 1))
          );

          point(dotPos);
        }
        pop();
      }
    }
  }
  pop();
}
function drawBoulderShape(boulderPoints: p5.Vector[]) {
  push();
  beginShape();
  boulderPoints.forEach((p) => vertex(p.x, p.y));
  endShape(CLOSE);
  pop();
}

function createBoulder(
  groundTouchPos: p5.Vector,
  bConfig: BoulderConfig,
  fillColour: string
): Boulder {
  const points = [];
  const { maxRadius, numVerts, radiusVariation } = bConfig;

  for (let i = 0; i < numVerts; i++) {
    const angle = map(i, 0, numVerts, 0, TWO_PI);

    const minR = maxRadius * (1 - radiusVariation);
    const r = random(minR, maxRadius);

    const v = p5.Vector.fromAngle(angle).mult(r);

    points.push(v);
  }
  return {
    config: bConfig,
    pts: points,
    originalGroundTouchPos: groundTouchPos.copy(),
    currentGroundTouchPos: groundTouchPos.copy(),
    fillColour,
  };
}

function createRandomBoulderAt(fillColour: string, ix: number): Boulder {
  const config: BoulderConfig = {
    maxRadius: randomGaussian(100, 20),
    numVerts: floor(random(8, 30)),
    radiusVariation: random(0.1, 0.25),
  };

  const r = config.maxRadius;
  const x = constrain(randomGaussian(width / 2, width / 4), r, width - r);
  const y = height * map(ix, 0, 1, 0.7, 0.9, true);
  const groundTouchPos: p5.Vector = createVector(x, y);

  return createBoulder(groundTouchPos, config, fillColour);
}

window.mousePressed = function mousePressed() {
  if (mouseButton.right) {
    return;
  }
  toggleLights();
};
function toggleLights() {
  gConfig.isLightOn = !gConfig.isLightOn;
  gLightsHistory.at(-1)!.endMillis = millis();
  gLightsHistory.push({ wasOn: gConfig.isLightOn, startMillis: millis() });
}
window.keyPressed = function keyPressed() {
  if (key === "r") {
    regenerate();
  }
  if (key === "s") {
    gConfig.shouldShowBoulderShadow = !gConfig.shouldShowBoulderShadow;
  }
};

function calcEdgesFromPoints(pts: p5.Vector[]) {
  const edges: Edge[] = [];
  for (let ix = 0; ix < pts.length; ix++) {
    const a = pts[ix];
    const b = ix === pts.length - 1 ? pts[0] : pts[ix + 1];
    const norm = p5.Vector.sub(b, a)
      .rotate(PI / 2)
      .normalize();
    const midpoint = p5.Vector.lerp(a, b, 0.5);
    edges.push({ a, b, normal: norm, midpoint });
  }
  return edges;
}

function createBoulders(): Boulder[] {
  const arr: Boulder[] = [];
  for (let i = 0; i < 5; i++) {
    const fillColour = random(gPalette.colours);
    arr.push(createRandomBoulderAt(fillColour, i / 4));
  }
  return arr;
}
function generateDarkerColour(orig: string) {
  //TODO: this should get less chroma/saturation, and darker, maybe more towards purple
  const darkerFillColour = color(orig);
  const darkeningAmount = 100;
  darkerFillColour.setRed(red(darkerFillColour) - darkeningAmount);
  darkerFillColour.setGreen(green(darkerFillColour) - darkeningAmount);
  darkerFillColour.setBlue(blue(darkerFillColour) - darkeningAmount);
  return darkerFillColour;
}

function drawBoulder(b: Boulder): void {
  //we'll need this to forget the eventual clipping
  push();
  translate(b.currentGroundTouchPos);
  translate(0, -b.config.maxRadius);
  //"sit down" if lights are on
  translate(0, gConfig.isLightOn ? random(15, 20) : 0);

  push();
  if (gConfig.shouldShowBoulderShadow) {
    //buggy
    setBoulderShadow(b);
  }
  //fill and outline the boulder shape
  const darkerFillColour = generateDarkerColour(b.fillColour);
  const actualFillColour = gConfig.isLightOn ? color(b.fillColour) : darkerFillColour;
  fill(actualFillColour);
  strokeWeight(2);
  stroke(gConfig.isLightOn ? color(gPalette.stroke) : darkerStroke(gPalette));
  drawBoulderShape(b.pts);
  pop();

  //set clipping region outwith which hatching lines won't be shown
  clip(() => drawBoulderShape(b.pts));
  hatchWithLines(b.config, b.pts, color(gPalette.stroke));

  //forget the clip region
  pop();
}

function createPalette(): Palette {
  const palettes: Palette[] = [
    {
      colours: [
        "rgb(79.697% 71.556% 60.461%)",
        "rgb(81.552% 42.476% 47.158%)",
        "rgb(87.51% 59.208% 52.62%)",
        "rgb(90.689% 77.945% 58.445%)",
        "rgb(81.575% 74.356% 61.523%)",
        "rgb(88.629% 77.249% 54.748%)",
      ],

      background: "rgb(79.697% 71.556% 60.461%)",
      backgroundDark: "rgb(27.414% 23.512% 17.949%)",
      stroke: "rgb(27.414% 23.512% 17.949%)",
    } as const,
    {
      colours: [
        "rgb(76.644% 71.949% 64.213%)",
        "rgb(48.52% 46.991% 38.241%)",
        "rgb(72.504% 50.089% 41.785%)",
        "rgb(80.59% 72.957% 49.691%)",
        "rgb(86.686% 54.603% 58.264%)",
        "rgb(91.801% 75.574% 55.341%)",
      ],
      background: "rgb(76.644% 71.949% 64.213%)",
      backgroundDark: "rgb(48.52% 46.991% 38.241%)",
      stroke: "rgb(27.414% 23.512% 17.949%)",
    } as const,
  ];

  return palettes[0];
}

function setBodyBackgroundAsDarkerThan(baseColour: string) {
  const lightnessFrac = 0.92;
  document.body.style.backgroundColor = `oklch(from ${baseColour} calc(l * ${lightnessFrac}) c h)`;
}

function setBackgrounds() {
  const bgColour = gConfig.isLightOn ? gPalette.background : gPalette.backgroundDark;
  background(bgColour);
  setBodyBackgroundAsDarkerThan(bgColour);
}

function darkerStroke(pal: Palette): p5.Color {
  const s = color(pal.stroke);
  s.setRed(red(s) - 100);
  s.setGreen(green(s) - 100);
  s.setBlue(blue(s) - 100);
  return s;
}
function normalStroke(pal: Palette): p5.Color {
  return color(pal.stroke);
}

function strokeForLighting(pal: Palette): p5.Color {
  return gConfig.isLightOn ? normalStroke(pal) : darkerStroke(pal);
}
function setBoulderShadow(b: Boulder) {
  const xOffset = gConfig.isLightOn ? gConfig.lightDirection.x : 0;
  const yOffset = gConfig.isLightOn ? gConfig.lightDirection.y : 0;
  const shadowLength = gConfig.isLightOn ? b.config.maxRadius : 10;
  const shadowBlur = gConfig.isLightOn ? 10 : 20;
  (drawingContext as CanvasRenderingContext2D).shadowBlur = shadowBlur;
  (drawingContext as CanvasRenderingContext2D).shadowColor = strokeForLighting(gPalette).toString();
  (drawingContext as CanvasRenderingContext2D).shadowOffsetX = xOffset * shadowLength;
  (drawingContext as CanvasRenderingContext2D).shadowOffsetY = yOffset * shadowLength;
}
function setCredits(msg: string) {
  if (random() < 0) {
    console.log("credits: " + msg);
  }
}
