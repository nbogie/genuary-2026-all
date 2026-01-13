//have all models be attached to simple matter.js bodies (spheres?)
//and have those bodies sprung to random attachment points.
//ideally, drag and drop would move a model/body between attachment parts.

import "p5/global";
//@ts-ignore
import p5 from "p5";

p5.disableFriendlyErrors = true;
let mainModel: p5.Geometry;
let itemModelParts: LoadedModelPart[];
let config: ReturnType<typeof createConfig>;

function createConfig() {
  return { seed: 123, shouldJumble: false };
}

window.setup = async function setup() {
  config = createConfig();
  createCanvas(windowWidth, windowHeight, WEBGL);
  mainModel = await loadModel("mr-potatohead.obj");
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
  background(30);
  orbitControl();
  randomSeed(config.seed);
  // debugMode();
  lights();
  ambientLight("#aaaaaa");
  noStroke();
  scale(100);
  // model(mainModel);

  //TODO: fix p5 type for shuffle<T>(arr:T[]):T[]

  const freeAttachmentSlots = shuffle(
    attachmentSlot.filter((p) => !p.isReserved)
  ) as AttachmentSlot[];
  itemModelParts.forEach((part) => {
    push();
    if (config.shouldJumble && !part.isStatic && !part.isFixedPeg) {
      const aPos = freeAttachmentSlots.pop();
      if (!aPos) {
        console.error("ran out of attachment slots at part: " + part.path);
        return;
      }

      //todo; align to the attachment normal at that pos.

      translate(aPos.position.x, -aPos.position.z, -aPos.position.y);
    } else {
      translate(part.position.x, -part.position.z, -part.position.y);
    }
    //fix up eyes. they have to be rotated to align with body.
    if (part.path.startsWith("item-eye")) {
      rotateX(-radians(part.rotationDeg?.x));
    }
    if (!part.isStatic) {
      // translate(randomGaussian(0, v), randomGaussian(0, v), randomGaussian(0, v));
      // if (part.path === "item-eye1.obj") {
      // rotateY(frameCount / 30);
      rotatePartOnAxis(part, random(TWO_PI));
      // }
    }

    model(part.loadedModel);
    // }
    pop();
  });
};

type LoadedModelPart = ModelPart & { loadedModel: p5.Geometry };

type ModelPart = {
  /** relative filename to .obj file including extension*/
  path: string;
  position: { x: number; y: number; z: number };
  rotationDeg?: { x: number; y: number; z: number };
  rotationAxis?: "x" | "y" | "z";
  isFixedPeg?: boolean;
  /**
   *indicates this part should not be translated, rotated, randomly or by user.  (probably the potato-body)
   */
  isStatic: boolean;
};

const modelParts: ModelPart[] = [
  {
    path: "item-brow1.obj",
    position: {
      x: -0.19,
      y: -0.61,
      z: 1.035,
    },
    isStatic: false,
  },
  {
    path: "item-brow2.obj",
    position: { x: 0.185, y: -0.59, z: 1.07 },
    isStatic: false,
    rotationDeg: { x: -19, y: 90, z: 0 },
  },
  {
    path: "item-eye1.obj",
    position: { x: -0.2, y: -0.67, z: 0.68 },
    rotationDeg: { x: 80, y: 0, z: 0 },
    rotationAxis: "y",
    isStatic: false,
  },
  {
    path: "item-eye2.obj",
    position: { x: 0.2, y: -0.67, z: 0.68 },
    rotationDeg: { x: 80, y: 0, z: 0 },
    rotationAxis: "y",
    isStatic: false,
  },
  {
    path: "item-hat.obj",
    position: {
      x: 0,
      y: 0,
      z: 1.51,
    },
    isStatic: false,
    isFixedPeg: true,
    rotationAxis: "y",
  },
  {
    path: "item-mouth.obj",
    position: {
      x: 0,
      y: -0.91,
      z: -0.33,
    },
    isStatic: false,
  },
  {
    path: "item-nose.obj",
    position: { x: 0, y: -0.8233, z: 0.3 },
    isStatic: false,
    rotationDeg: { x: -13, y: 3.5, z: 14.5 },
  },
  { path: "item-potato.obj", position: { x: 0, y: 0, z: 0 }, isStatic: true },
];
type AttachmentSlot = {
  name: string;
  position: { x: number; y: number; z: number };
  normal: { x: number; y: number; z: number };
  /** is reserved for a specific item.  don't jumble into here */
  isReserved?: boolean;
};
const attachmentSlot: AttachmentSlot[] = [
  {
    name: "item-brow1.obj",
    position: {
      x: -0.19,
      y: -0.61,
      z: 1.035,
    },
    normal: { x: 0, y: 0, z: 1 },
  },
  {
    name: "item-brow2.obj",
    position: { x: 0.185, y: -0.59, z: 1.07 },
    normal: { x: 0, y: 0, z: 1 },
  },
  {
    name: "item-eye1.obj",
    position: { x: -0.2, y: -0.67, z: 0.68 },
    normal: { x: 0, y: 0, z: 1 },
  },
  {
    name: "item-eye2.obj",
    position: { x: 0.2, y: -0.67, z: 0.68 },
    normal: { x: 0, y: 0, z: 1 },
  },
  {
    name: "item-hat.obj",
    position: {
      x: 0,
      y: 0,
      z: 1.51,
    },
    isReserved: true,
    normal: { x: 0, y: -1, z: 0 },
  },
  {
    name: "item-mouth.obj",
    position: {
      x: 0,
      y: -0.91,
      z: -0.33,
    },
    normal: { x: 0, y: 0, z: 1 },
  },
  {
    name: "item-nose.obj",
    position: { x: 0, y: -0.8233, z: 0.3 },
    normal: { x: 0, y: 0, z: 1 },
  },
];

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
