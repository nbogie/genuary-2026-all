export type VecLite = { x: number; y: number; z: number };
export type LoadedModelPart = ModelPartInfo & { loadedModel: p5.Geometry; autoRotateDir: 1 | -1 };
export type ModelPartInfo = {
  /** relative filename to .obj file including extension*/
  path: string;
  position: VecLite;
  rotationDeg?: VecLite;
  rotationAxis?: "x" | "y" | "z";
  inVector: VecLite;
  isFixedPeg?: boolean;
  /**
   *indicates this part should not be translated, rotated, randomly or by user.  (probably the potato-body)
   */
  isStatic: boolean;
};
//convert a position from blender (where z is up)
//to one in p5 (where -y is up)
//return a p5.Vector for convenience
export function blenderCoordsToP5(vec: VecLite): p5.Vector {
  return createVector(vec.x, -vec.z, -vec.y);
}

export function vecLiteToP5(vec: VecLite): p5.Vector {
  return createVector(vec.x, vec.y, vec.z);
}
export const modelPartsInfo: ModelPartInfo[] = [
  {
    path: "item-arm1.obj",
    position: { x: -0.782, y: -0.153, z: 0.25 },
    inVector: { x: 1, y: 0, z: 0 },
    rotationAxis: "x",
    isStatic: false,
  },
  {
    path: "item-arm2.obj",
    position: { x: 0.78, y: -0.153, z: 0.25 },
    inVector: { x: -1, y: 0, z: 0 },
    rotationAxis: "x",
    isStatic: false,
  },
  {
    path: "item-brow1.obj",
    position: { x: -0.19, y: -0.61, z: 1.035 },
    isStatic: false,
    rotationAxis: "z",
    inVector: { x: 0, y: 0, z: -1 },
  },
  {
    path: "item-brow2.obj",
    position: { x: 0.185, y: -0.59, z: 1.07 },
    isStatic: false,
    rotationDeg: { x: -19, y: 90, z: 0 },
    rotationAxis: "z",
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
    position: { x: 0, y: 0, z: 1.51 },
    isStatic: false,
    isFixedPeg: true,
    inVector: { x: 0, y: 1, z: 0 },
    rotationAxis: "y",
  },
  {
    path: "item-mouth.obj",
    position: { x: 0, y: -0.91, z: -0.33 },
    isStatic: false,
    inVector: { x: 0, y: 0, z: -1 },
    rotationAxis: "z",
  },
  {
    path: "item-nose.obj",
    position: { x: 0, y: -0.8233, z: 0.3 },
    isStatic: false,
    rotationDeg: { x: -13, y: 3.5, z: 14.5 },
    inVector: { x: 0, y: 0, z: -1 },
    rotationAxis: "z",
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
  position: VecLite;
  normal: VecLite;
  /** is reserved for a specific item.  don't jumble into here */
  isReserved?: boolean;
};

export const attachmentSlots: AttachmentSlot[] = [
  {
    name: "item-arm1.slot",
    position: { x: -0.782, y: -0.153, z: 0.25 },
    normal: { x: -1, y: 0, z: 0 },
  },
  {
    name: "item-arm2.slot",
    position: { x: 0.78, y: -0.153, z: 0.25 },
    normal: { x: 1, y: 0, z: 0 },
  },
  {
    name: "item-brow1.slot",
    position: { x: -0.19, y: -0.61, z: 1.035 },
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
    position: { x: 0, y: 0, z: 1.51 },
    isReserved: true,
    normal: { x: 0, y: -1, z: 0 },
  },
  {
    name: "item-mouth.slot",
    position: { x: 0, y: -0.91, z: -0.33 },
    normal: { x: 0, y: 0, z: 1 },
  },
  {
    name: "item-nose.slot",
    position: { x: 0, y: -0.8233, z: 0.3 },
    normal: { x: 0, y: 0, z: 1 },
  },
];
