//have all models be attached to simple matter.js bodies (spheres?)
//and have those bodies sprung to random attachment points.
//ideally, drag and drop would move a model/body between attachment parts.

import "p5/global";
//@ts-ignore
import p5 from "p5";
import {
  attachmentSlots,
  blenderCoordsToP5,
  modelParts,
  vecLiteToP5,
  type AttachmentSlot,
  type LoadedModelPart,
  type ModelPart,
  type VecLite,
} from "./modelParts.ts";

p5.disableFriendlyErrors = true;
let itemModelParts: LoadedModelPart[];
let config: ReturnType<typeof createConfig>;

function createConfig() {
  return {
    seed: 123,
    shouldJumble: true,
    overallScale: 120,
    rotateContinually: true,
    shouldRotateRandomly: true,
    hideBody: false,
  };
}

window.setup = async function setup() {
  config = createConfig();
  createCanvas(windowWidth, windowHeight, WEBGL);
  itemModelParts = await loadItemPartModels();
};

async function loadItemPartModels(): Promise<LoadedModelPart[]> {
  return Promise.all(modelParts.map((part) => loadAndTagOneModelPart(part)));
}

async function loadAndTagOneModelPart(part: ModelPart): Promise<LoadedModelPart> {
  const loadedModel = await loadModel(part.path);
  const loadedPart: LoadedModelPart = {
    ...part,
    loadedModel,
  };
  return loadedPart;
}
window.draw = function draw() {
  background(100);
  orbitControl(1, 1, 0.2);
  randomSeed(config.seed);
  debugMode();
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

  itemModelParts.forEach((part) => {
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
      rotatePartOnAxis(part, config.rotateContinually ? millis() / 1000 : random(TWO_PI));
    }

    if (!(config.hideBody && part.path.startsWith("item-potato"))) {
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

window.keyPressed = function keyPressed() {
  if (key === " ") {
    config.seed = millis();
  }
  if (key === "j") {
    config.shouldJumble = !config.shouldJumble;
  }
  if (key === "b") {
    config.hideBody = !config.hideBody;
  }
  if (key === "c") {
    config.rotateContinually = !config.rotateContinually;
  }
};

function showDebugLineBox() {
  push();
  translate(0, 0, 0.5);
  box(0.02, 0.02, 1);
  pop();
}
