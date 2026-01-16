import p5 from "p5";
import { drawTarget } from "./target.ts";

export type EntityType = "order" | "chaos";
export type Entity = {
  typ: EntityType;
  pos: p5.Vector;
  vel: p5.Vector;
  targetPos: p5.Vector;
};

export function createEntityOrder(p: p5): Entity {
  return {
    typ: "order",
    pos: p.createVector(p.random(p.width), p.random(p.height)),
    vel: p5.Vector.random2D().mult(1),
    targetPos: createRandomTargetPosForEntity(p),
  };
}

export function createEntityChaos(p: p5): Entity {
  return {
    typ: "chaos",
    pos: p.createVector(p.random(p.width), p.random(p.height)),
    vel: p5.Vector.random2D().mult(1),
    targetPos: createRandomTargetPosForEntity(p),
  };
}

export function createRandomTargetPosForEntity(p: p5): p5.Vector {
  return p
    .createVector(p.width / 2, p.height / 2)
    .add(p5.Vector.random2D().mult(p.random(100, p.height / 2)));
}

export function drawOrderEntity(entity: Entity, p: p5) {
  p.push();
  p.translate(entity.pos);
  //TODO: this finds a strudel export function, "rotate".  use ESM strudel, or p5 instance mode (or both)
  p.rotate(p.frameCount / 10);
  const sz = p.map(p.sin(p.millis() / 160), -1, 1, 0.6, 1, true) * 40;
  p.fill("skyblue");
  p.rectMode(p.CENTER);
  //TODO: have entity be a slow-rotating cog-wheel, no visual indication of time-signature
  p.rect(0, 0, sz * 0.2, sz);
  p.rotate(p.PI / 2);
  p.rect(0, 0, sz * 0.2, sz);
  p.pop();
  drawTarget(entity.targetPos, "dodgerblue", p);
}
export function drawChaosEntity(entity: Entity, p: p5) {
  p.push();
  p.translate(entity.pos);
  //TODO: this finds a strudel export function, "rotate".  use ESM strudel, or p5 instance mode (or both)
  p.rotate(p.frameCount / 10);
  const sz = p.map(p.sin(p.millis() / 160), -1, 1, 0.6, 1, true) * 40;
  p.fill("tomato");
  p.rectMode(p.CENTER);

  //TODO: have entity be a slow-rotating cog-wheel, no visual indication of time-signature
  p.rect(0, 0, sz * 0.2, sz);
  p.rotate(p.PI / 2);
  p.rect(0, 0, sz * 0.2, sz);
  p.pop();
  drawTarget(entity.targetPos, "purple", p);
}

export function updateEntity(entity: Entity, p: p5) {
  entity.pos.lerp(entity.targetPos, 0.02);
  if (entity.targetPos.dist(entity.pos) < 30 && p.random() < 0.01) {
    entity.targetPos = createRandomTargetPosForEntity(p);
  }
}
