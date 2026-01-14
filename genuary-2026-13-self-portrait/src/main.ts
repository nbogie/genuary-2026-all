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
  myCamera: undefined! as p5.Camera,
  generatedAtMillis: 0,
  lastUserInteractionMillis: 0,
  isMobile: detectIfMobileDevice(),
  horrorModeStepCount: 0,
};

type CamInfo = { eye: [number, number, number]; look: [number, number, number] };

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
    shouldUseThreePointLighting: true,
    shouldUseHorrorLightingWarningStrobing: false,
    desktop: {
      cameras: {
        start: { eye: [18, -94, 456], look: [-0.4, -31, 0] } satisfies CamInfo,
        horrorStart: { eye: [134, -486, 3300], look: [-0.4, -31, 0] } satisfies CamInfo,
        horrorEnd: { eye: [-38, 23, 364], look: [-0.4, -31, 0] } satisfies CamInfo,
      },
    },
    mobile: {
      cameras: { start: { eye: [0, 0, 800], look: [0, 0, 0] } satisfies CamInfo },
    },
  };
}

window.setup = async function setup() {
  config = createConfig();
  createCanvas(windowWidth, windowHeight, WEBGL);
  state.myCamera = createCamera();

  configureCamera(state.isMobile ? config.mobile.cameras.start : config.desktop.cameras.start);
  setCamera(state.myCamera);

  setShakeThreshold(config.shakeThreshold);
  modelPartsLoaded = await loadItemPartModels();
  setInterval(maybeRandomise, 500);
  if (state.isMobile) {
    setupFloatingInstructionElement({ msg: "(Shake Me!)", durationMillis: 2000 });
  }
};

function maybeRandomise() {
  if (config.shouldUseHorrorLightingWarningStrobing) {
    return;
  }
  const timeUntouched = millis() - state.lastUserInteractionMillis;
  const timeInThisGen = millis() - state.generatedAtMillis;
  const minTimePerGen = 3000;
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
  if (config.shouldUseThreePointLighting) {
    drawThreePointLighting();
    return;
  }
  lights();
  ambientLight("#c0c0c0");
}

//I don't think this an improvement!
function drawThreePointLighting() {
  //key light, warm.  called twice for more intensity
  for (let i = 0; i < 2; i++) {
    directionalLight("#ffebae", createVector(-0.6, 0.7, -0.8).normalize());
  }
  //key light - teal-ish
  for (let i = 0; i < 1; i++) {
    directionalLight("#005050", createVector(0.7, 0.5, -0.6).normalize());
  }
  //back light not worth it - no hair, etc catching this rim light

  ambientLight("#8a739a");
}
function drawHorrorModeLights() {
  const remainder = frameCount % 90;
  if (remainder < 10) {
    //blink on
    directionalLight([255, 100, 100], createVector(0.1, -1, -0.6).normalize());
    ambientLight([255, 50, 50].map((v) => v * 0.2));
  } else {
    ambientLight(0);
  }
  if (remainder === 20) {
    progressTehHorror();
  }
}

function progressTehHorror() {
  //under cover of darkness, randomise limbs and step camera closer, to a max.
  randomiseStuff();

  //frozen snapshots for first n strobes.  then maybe allow some twisting.
  config.shouldRotateContinually = state.horrorModeStepCount > 4 && random([true, false]);

  const camInfo: CamInfo = lerpCameraInfos(
    config.desktop.cameras.horrorStart,
    config.desktop.cameras.horrorEnd,
    min(2, state.horrorModeStepCount) / 2
  );
  configureCamera(camInfo);

  state.horrorModeStepCount++;
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
  if (millis() - state.generatedAtMillis < 500) {
    return;
  }
  randomiseStuff();
  state.lastUserInteractionMillis = millis();
  if (touches.length > 0) {
    config.shouldUseThreePointLighting = !config.shouldUseThreePointLighting;
  }
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
  if (key === "#") {
    copyCameraPositionToClipboard();
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
    state.horrorModeStepCount = 0;
    if (config.shouldUseHorrorLightingWarningStrobing) {
      progressTehHorror();
    } else {
      configureCamera(config.desktop.cameras.start);
    }
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
  if (key === "t") {
    config.shouldUseThreePointLighting = !config.shouldUseThreePointLighting;
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

function copyCameraPositionToClipboard() {
  const camera = state.myCamera;
  const position = {
    eyeX: camera.eyeX,
    eyeY: camera.eyeY,
    eyeZ: camera.eyeZ,
    lookX: camera.centerX,
    lookY: camera.centerY,
    lookZ: camera.centerZ,
  };
  navigator.clipboard.writeText(JSON.stringify(position, null, 2));
}

function configureCamera(config: CamInfo) {
  state.myCamera.camera(...config.eye, ...config.look);
}

function lerpCameraInfos(a: CamInfo, b: CamInfo, frac: number): CamInfo {
  frac = constrain(frac, 0, 1);
  return {
    eye: [
      lerp(a.eye[0], b.eye[0], frac),
      lerp(a.eye[1], b.eye[1], frac),
      lerp(a.eye[2], b.eye[2], frac),
    ],
    look: [
      lerp(a.look[0], b.look[0], frac),
      lerp(a.look[1], b.look[1], frac),
      lerp(a.look[2], b.look[2], frac),
    ],
  };
}
