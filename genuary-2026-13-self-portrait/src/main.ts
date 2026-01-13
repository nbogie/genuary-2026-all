//have all models be attached to simple matter.js bodies (spheres?)
//and have those bodies sprung to random attachment points.
//ideally, drag and drop would move a model/body between attachment parts.

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
};

function createConfig() {
  return {
    seed: performance.timeOrigin,
    shouldJumble: true,
    overallScale: 120,
    rotateContinually: true,
    shouldAutoRandomise: true,
    shouldRotateRandomly: true,
    hideBody: false,
    shouldShowDebug: false,
    shakeThreshold: 20,
    wireframe: false,
    noFill: false,
  };
}

window.setup = async function setup() {
  config = createConfig();
  createCanvas(windowWidth, windowHeight, WEBGL);
  setShakeThreshold(config.shakeThreshold);
  modelPartsLoaded = await loadItemPartModels();
  setInterval(maybeAutoRandomise, 2000);
};

function maybeAutoRandomise() {
  const timeUntouched = millis() - state.lastUserInteractionMillis;
  const timeInThisGen = millis() - state.generatedAtMillis;
  if (config.shouldAutoRandomise && timeUntouched >= 5000 && timeInThisGen >= 3000) {
    randomiseStuff();
    config.rotateContinually = random([true, false]);
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
  background(100);
  orbitControl(1, 1, 0.2);
  randomSeed(config.seed);
  lights();
  ambientLight("#aaaaaa");

  noStroke();
  drawJumbledParts();
};

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
        config.rotateContinually ? (part.autoRotateDir * millis()) / 1000 : random(TWO_PI)
      );
    }

    if (!(config.hideBody && part.path.startsWith("item-potato"))) {
      if (config.wireframe) {
        stroke(30, 60);
      }
      if (config.noFill) {
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
    config.hideBody = !config.hideBody;
  }
  if (key === "c") {
    config.rotateContinually = !config.rotateContinually;
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
    config.wireframe = !config.wireframe;
  }
  if (key === "f") {
    if (config.noFill) {
      config.noFill = false;
    } else if (!config.noFill && config.wireframe) {
      config.noFill = true;
    }
  }

  if (key === "%") {
    window.open(
      "https://github.com/nbogie/genuary-2026-all/tree/main/genuary-2026-13-self-portrait",
      "_blank"
    );
  }
};

export function showDebugLineBox() {
  push();
  translate(0, 0, 0.5);
  box(0.02, 0.02, 1);
  pop();
}

function randomiseStuff() {
  config.seed = millis();
  modelPartsLoaded.forEach((p) => (p.autoRotateDir = random([1, -1])));
  state.generatedAtMillis = millis();
}
