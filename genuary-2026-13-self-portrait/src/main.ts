//have all models be attached to simple matter.js bodies (spheres?)
//and have those bodies sprung to random attachment points.
//ideally, drag and drop would move a model/body between attachment parts.

import "p5/global";
//@ts-ignore
import p5 from "p5";
import {
  attachmentSlots,
  modelParts,
  type AttachmentSlot,
  type LoadedModelPart,
  type ModelPart,
} from "./modelParts.ts";

p5.disableFriendlyErrors = true;
let itemModelParts: LoadedModelPart[];
let config: ReturnType<typeof createConfig>;

function createConfig() {
  return { seed: 123, shouldJumble: true };
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
  // debugMode();
  lights();
  ambientLight("#aaaaaa");
  noStroke();
  drawJumbledParts();
};

function drawJumbledParts() {
  scale(100);
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
      //todo; align to the attachment normal at that pos.
      translate(slot.position.x, -slot.position.z, -slot.position.y);
      orientPartToNormal(part, slot);
    } else {
      translate(part.position.x, -part.position.z, -part.position.y);
    }
    //fix up eyes. they have to be rotated to align with body.
    if (part.path.startsWith("item-eye")) {
      rotateX(-radians(part.rotationDeg?.x));
    }
    //do some fun rotation on one axis
    if (!part.isStatic) {
      rotatePartOnAxis(part, random(TWO_PI));
    }

    model(part.loadedModel);
    pop();
  });
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

window.keyPressed = function keyPressed() {
  if (key === " ") {
    config.seed = millis();
  }
  if (key === "j") {
    config.shouldJumble = !config.shouldJumble;
  }
};
function orientPartToNormal(_part: LoadedModelPart, slot: AttachmentSlot) {
  const targetNormal = createVector(slot.normal.x, slot.normal.z, slot.normal.y);

  //All models have been saved with the same up-vector
  let initialUp = createVector(0, -1, 0);

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
