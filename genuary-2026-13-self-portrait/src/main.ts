//TODO:
// * Improve the lighting
// * Have all models be attached to simple matter.js bodies (spheres?)
//   and have those bodies sprung to random attachment points.
//   Ideally, drag and drop would move a model/body between attachment parts.
// * Fine-tune and observe attachment-point normals for angled faces, to lessen clipping
// * Model the rest of the character

import "p5/global";
//@ts-ignore
import p5 from "p5";
import {
  attachmentSlots,
  blenderCoordsToP5,
  modelPartsInfo,
  vecLiteToP5,
  type AttachmentSlot,
  type LoadedModelPart,
  type ModelPartInfo,
  type VecLite,
} from "./modelParts.ts";

p5.disableFriendlyErrors = true;
let modelPartsLoaded: LoadedModelPart[];
let config: ReturnType<typeof createConfig>;

const state = {
  generatedAtMillis: 0,
  lastUserInteractionMillis: 0,
  isMobile: detectIfMobileDevice(),
};

function createConfig() {
  return {
    overallScale: 120,
    seed: round(performance.timeOrigin),
    shakeThreshold: 20,
    shouldAutoRandomise: true,
    shouldHideBody: false,
    shouldJumble: true,
    shouldRotateContinually: true,
    shouldRotateRandomly: true,
    shouldShowDebug: false,
    shouldShowWireframe: false,
    shouldFill: true,
    shouldUseHorrorLightingWarningStrobing: false,
  };
}

window.setup = async function setup() {
  config = createConfig();
  createCanvas(windowWidth, windowHeight, WEBGL);
  setShakeThreshold(config.shakeThreshold);
  modelPartsLoaded = await loadItemPartModels();
  setInterval(maybeAutoRandomise, 500);
  if (state.isMobile) {
    setupFloatingInstructionElement({ msg: "(Shake Me!)", durationMillis: 2000 });
  }
};

function maybeAutoRandomise() {
  const timeUntouched = millis() - state.lastUserInteractionMillis;
  const timeInThisGen = millis() - state.generatedAtMillis;
  const minTimePerGen = config.shouldUseHorrorLightingWarningStrobing ? 1400 : 3000;
  if (config.shouldAutoRandomise && timeUntouched >= 5000 && timeInThisGen >= minTimePerGen) {
    randomiseStuff();
    config.shouldRotateContinually = random([true, false]);
  }
}
async function loadItemPartModels(): Promise<LoadedModelPart[]> {
  return Promise.all(modelPartsInfo.map((part) => loadAndTagOneModelPart(part)));
}

async function loadAndTagOneModelPart(part: ModelPartInfo): Promise<LoadedModelPart> {
  const loadedModel = await loadModel(part.path);
  const loadedPart: LoadedModelPart = {
    ...part,
    loadedModel,
    autoRotateDir: random([-1, 1]),
  };
  return loadedPart;
}
window.draw = function draw() {
  drawBackground();
  orbitControl(1, 1, 0.2);
  randomSeed(config.seed);
  drawLights();
  noStroke();
  drawJumbledParts();
};

function drawBackground() {
  if (config.shouldUseHorrorLightingWarningStrobing) {
    background(0);
  } else {
    background(100);
  }
}

function drawLights() {
  if (config.shouldUseHorrorLightingWarningStrobing) {
    drawHorrorModeLights();
    return;
  }
  lights();
  ambientLight("#c0c0c0");
}
function drawHorrorModeLights() {
  if (frameCount % 90 < 10) {
    directionalLight([255, 100, 100], createVector(0.1, -1, -0.6).normalize());
    ambientLight([255, 50, 50].map((v) => v * 0.2));
  } else {
    ambientLight(0);
  }
}
function drawJumbledParts() {
  push();
  scale(config.overallScale);

  const freeAttachmentSlots = shuffle(
    attachmentSlots.filter((p) => !p.isReserved)
  ) as AttachmentSlot[];

  modelPartsLoaded.forEach((part) => {
    push();

    if (config.shouldJumble && !part.isStatic && !part.isFixedPeg) {
      const slot = freeAttachmentSlots.pop();
      if (!slot) {
        console.error("ran out of attachment slots at part: " + part.path);
        return;
      }
      translate(blenderCoordsToP5(slot.position));
      orientPartToSlotNormal(part, slot.normal);
      // showDebugLineBox();
    } else {
      translate(blenderCoordsToP5(part.position));
      // orientPartToSlotNormal(part, slot.normal);
    }

    //fix up eyes. they have to be rotated to align with body.
    if (part.path.startsWith("item-eye")) {
      rotateX(-radians(part.rotationDeg?.x));
    }
    //do some fun rotation on one axis
    if (config.shouldRotateRandomly && !part.isStatic) {
      rotatePartOnAxis(
        part,
        config.shouldRotateContinually ? (part.autoRotateDir * millis()) / 1000 : random(TWO_PI)
      );
    }

    if (!(config.shouldHideBody && part.path.startsWith("item-potato"))) {
      if (config.shouldShowWireframe) {
        stroke(30, 60);
      }
      if (!config.shouldFill) {
        noFill();
      }
      model(part.loadedModel);
    }
    pop();
  });
  pop();
}
function rotatePartOnAxis(part: LoadedModelPart, angle: number) {
  if (!part.rotationAxis) {
    rotateZ(angle);
  } else {
    const lookup = { x: rotateX, y: rotateY, z: rotateZ };
    const fn = lookup[part.rotationAxis];
    if (!fn) {
      console.error("unrecognised rotationAxis: " + part.rotationAxis);
      return;
    }
    fn(angle);
  }
}

function orientPartToSlotNormal(_part: LoadedModelPart, targetNormalXYZ: VecLite) {
  //note, converting here.

  const targetNormal = vecLiteToP5(targetNormalXYZ);

  //TODO: record these vectors in the model part data.
  let initialUp = _part.path.startsWith("item-arm1")
    ? createVector(-1, 0, 0)
    : _part.path.startsWith("item-arm2")
    ? createVector(1, 0, 0)
    : createVector(0, 0, 1);

  // 2. Calculate rotation axis (perpendicular to both vectors)
  let axis = initialUp.cross(targetNormal);

  // 3. Calculate the angle between initial up and target normal
  let angle = acos(initialUp.dot(targetNormal));

  // 4. Apply transformation
  if (axis.mag() > 0) {
    // console.log("rotating! " + degrees(angle) + " on axis: " + axis);
    rotate(angle, axis);
  }
}

window.deviceShaken = function deviceShaken() {
  randomiseStuff();
  state.lastUserInteractionMillis = millis();
};

window.doubleClicked = function doubleClicked() {
  randomiseStuff();
  state.lastUserInteractionMillis = millis();
};

window.keyPressed = function keyPressed() {
  if (key === " ") {
    randomiseStuff();
    state.lastUserInteractionMillis = millis();
  }
  if (key === "a") {
    config.shouldAutoRandomise = !config.shouldAutoRandomise;
  }
  if (key === "b") {
    config.shouldHideBody = !config.shouldHideBody;
  }
  if (key === "c") {
    config.shouldRotateContinually = !config.shouldRotateContinually;
    state.lastUserInteractionMillis = millis();
  }
  if (key === "d") {
    config.shouldShowDebug = !config.shouldShowDebug;
    if (config.shouldShowDebug) {
      debugMode();
    } else {
      noDebugMode();
    }
  }
  if (key === "j") {
    config.shouldJumble = !config.shouldJumble;
    state.lastUserInteractionMillis = millis();
  }
  if (key === "w") {
    config.shouldShowWireframe = !config.shouldShowWireframe;
  }
  if (key === "H") {
    config.shouldUseHorrorLightingWarningStrobing = !config.shouldUseHorrorLightingWarningStrobing;
  }
  if (key === "s") {
    save("self-portrait-seed-" + config.seed);
  }
  if (key === "f") {
    if (config.shouldFill && config.shouldShowWireframe) {
      config.shouldFill = false;
    } else {
      config.shouldFill = true;
    }
  }

  if (key === "%") {
    window.open(
      "https://github.com/nbogie/genuary-2026-all/tree/main/genuary-2026-13-self-portrait",
      "_blank"
    );
  }
};

window.windowResized = function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  //TODO: update camera aspect ratio, perspective, etc?
};

export function showDebugLineBox() {
  push();
  translate(0, 0, 0.5);
  box(0.02, 0.02, 1);
  pop();
}

function randomiseStuff() {
  config.seed = round(1000 * millis());
  modelPartsLoaded.forEach((p) => (p.autoRotateDir = random([1, -1])));
  state.generatedAtMillis = millis();
}

function detectIfMobileDevice(): boolean {
  try {
    const check = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    return check || hasTouch;
  } catch (err) {
    console.log("ignoring error while trying to find if we are on mobile device: ", err);
    return false;
  }
}

/** setup and show a floating instruction over the canvas.  it will auto-remove */
function setupFloatingInstructionElement({
  msg,
  durationMillis,
}: {
  msg: string;
  durationMillis: number;
}) {
  const instructionElement = createElement("h1", msg);
  //This css-layout code is from an LLM
  instructionElement.style("position", "fixed");
  instructionElement.style("top", "70%");
  instructionElement.style("left", "50%");
  instructionElement.style("transform", "translate(-50%, -50%)");
  instructionElement.style("margin", "0");
  instructionElement.style("font-family", "sans-serif");
  instructionElement.style("color", "#ffffff");
  instructionElement.style("font-size", "2rem");
  // Clicks pass through to canvas
  instructionElement.style("pointer-events", "none");

  setTimeout(() => instructionElement.remove(), durationMillis);
  return instructionElement;
}
