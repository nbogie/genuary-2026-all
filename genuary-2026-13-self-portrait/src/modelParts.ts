export type LoadedModelPart = ModelPart & { loadedModel: p5.Geometry };

export type ModelPart = {
  /** relative filename to .obj file including extension*/
  path: string;
  position: { x: number; y: number; z: number };
  rotationDeg?: { x: number; y: number; z: number };
  rotationAxis?: "x" | "y" | "z";
  inVector: { x: number; y: number; z: number };
  isFixedPeg?: boolean;
  /**
   *indicates this part should not be translated, rotated, randomly or by user.  (probably the potato-body)
   */
  isStatic: boolean;
};

export const modelParts: ModelPart[] = [
  {
    path: "item-arm1.obj",
    position: {
      x: -0.782,
      y: -0.153,
      z: 0.25,
    },
    inVector: { x: 1, y: 0, z: 0 },
    isStatic: false,
  },
  {
    path: "item-arm2.obj",
    position: {
      x: 0.78,
      y: -0.153,
      z: 0.25,
    },
    inVector: { x: -1, y: 0, z: 0 },
    isStatic: false,
  },
  {
    path: "item-brow1.obj",
    position: {
      x: -0.19,
      y: -0.61,
      z: 1.035,
    },
    isStatic: false,
    inVector: { x: 0, y: 0, z: -1 },
  },
  {
    path: "item-brow2.obj",
    position: { x: 0.185, y: -0.59, z: 1.07 },
    isStatic: false,
    rotationDeg: { x: -19, y: 90, z: 0 },
    inVector: { x: 0, y: 0, z: -1 },
  },
  {
    path: "item-eye1.obj",
    position: { x: -0.2, y: -0.67, z: 0.68 },
    rotationDeg: { x: 80, y: 0, z: 0 },
    rotationAxis: "y",
    inVector: { x: 0, y: 0, z: 1 },
    isStatic: false,
  },
  {
    path: "item-eye2.obj",
    position: { x: 0.2, y: -0.67, z: 0.68 },
    rotationDeg: { x: 80, y: 0, z: 0 },
    rotationAxis: "y",
    inVector: { x: 0, y: 0, z: 1 },
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
    inVector: { x: 0, y: 1, z: 0 },
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
    inVector: { x: 0, y: 0, z: 1 },
  },
  {
    path: "item-nose.obj",
    position: { x: 0, y: -0.8233, z: 0.3 },
    isStatic: false,
    rotationDeg: { x: -13, y: 3.5, z: 14.5 },
    inVector: { x: 0, y: 0, z: 1 },
  },
  {
    path: "item-potato.obj",
    position: { x: 0, y: 0, z: 0 },
    isStatic: true,
    inVector: { x: 0, y: 1, z: 0 },
  },
];

export type AttachmentSlot = {
  name: string;
  position: { x: number; y: number; z: number };
  normal: { x: number; y: number; z: number };
  /** is reserved for a specific item.  don't jumble into here */
  isReserved?: boolean;
};

export const attachmentSlots: AttachmentSlot[] = [
  {
    name: "item-arm1.slot",
    position: {
      x: -0.782,
      y: -0.153,
      z: 0.25,
    },
    normal: { x: -1, y: 0, z: 0 },
  },
  {
    name: "item-arm2.slot",
    position: {
      x: 0.78,
      y: -0.153,
      z: 0.25,
    },
    normal: { x: 1, y: 0, z: 0 },
  },
  {
    name: "item-brow1.slot",
    position: {
      x: -0.19,
      y: -0.61,
      z: 1.035,
    },
    normal: { x: 0, y: 0, z: 1 },
  },
  {
    name: "item-brow2.slot",
    position: { x: 0.185, y: -0.59, z: 1.07 },
    normal: { x: 0, y: 0, z: 1 },
  },
  {
    name: "item-eye1.slot",
    position: { x: -0.2, y: -0.67, z: 0.68 },
    normal: { x: 0, y: 0, z: 1 },
  },
  {
    name: "item-eye2.slot",
    position: { x: 0.2, y: -0.67, z: 0.68 },
    normal: { x: 0, y: 0, z: 1 },
  },
  {
    name: "item-hat.slot",
    position: {
      x: 0,
      y: 0,
      z: 1.51,
    },
    isReserved: true,
    normal: { x: 0, y: -1, z: 0 },
  },
  {
    name: "item-mouth.slot",
    position: {
      x: 0,
      y: -0.91,
      z: -0.33,
    },
    normal: { x: 0, y: 0, z: 1 },
  },
  {
    name: "item-nose.slot",
    position: { x: 0, y: -0.8233, z: 0.3 },
    normal: { x: 0, y: 0, z: 1 },
  },
];
