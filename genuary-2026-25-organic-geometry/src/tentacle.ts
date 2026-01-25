import p5 from "p5";
import { mousePos } from "./utils/utils.ts";

export interface Tentacle {
  segments: TentacleSegment[];
}

export interface TentacleSegment {
  a: p5.Vector;
  b: p5.Vector;
  aRadius: number;
  isAnchored: boolean;
  target?: p5.Vector;
  colour: p5.Color;
}

export function createTentacle(spec: {
  startPos: p5.Vector;
  endPos: p5.Vector;
  startRadius: number;
  endRadius: number;
  baseHue: number;
}): Tentacle {
  const { startPos, endPos, startRadius, endRadius, baseHue } = spec;

  const numSegments = 80;
  const segs: TentacleSegment[] = [];
  let prevPos = startPos.copy();
  let towardsEnd = endPos.copy().sub(startPos);
  let len = towardsEnd.mag() / numSegments;
  push();
  colorMode(HSB);
  for (let i = 0; i < numSegments; i++) {
    const a = prevPos.copy();
    const b = prevPos.copy().add(towardsEnd.copy().setMag(len)); //startPos.copy().lerp(endPos, (i + 1) / numSegments);

    const aRadius = lerp(startRadius, endRadius, i / numSegments);
    len = aRadius * 0.2;

    const colour = color(randomGaussian(baseHue, 5), random(70, 80), randomGaussian(80, 5));
    const seg: TentacleSegment = { a, b, isAnchored: i === 0, aRadius, colour };
    segs.push(seg);
    prevPos = b.copy();
  }
  pop();
  return { segments: segs };
}

export function drawTentacle(tentacle: Tentacle) {
  push();
  fill("#121e0e");
  noStroke();
  for (let seg of tentacle.segments) {
    push();
    translate(seg.a);
    circle(0, 0, seg.aRadius);
    pop();
    push();
    translate(seg.b);
    circle(0, 0, seg.aRadius);
    pop();
  }
  push();
  noStroke();
  for (let seg of tentacle.segments) {
    push();
    translate(seg.a);
    fill(seg.colour);
    circle(0, 0, seg.aRadius * 0.8);
    pop();
    push();
    translate(seg.b);
    fill(seg.colour);
    circle(0, 0, seg.aRadius * 0.9);
    pop();
  }
  pop();
  pop();
}

/** mutates tentacle in place */
export function updateTentacle(tentacle: Tentacle) {
  const segsReversed = [...tentacle.segments].reverse();
  let prev: TentacleSegment | undefined = undefined;
  const posBefore = tentacle.segments[0].a.copy();
  for (const seg of segsReversed) {
    const oldLen = seg.a.dist(seg.b);
    const targetPos = prev ? prev.a : mousePos();
    seg.b = targetPos.copy();
    const newAPos = p5.Vector.sub(seg.a, seg.b).setMag(oldLen).add(seg.b);
    seg.a = newAPos;
    prev = seg;
  }
  const stretchedVec = p5.Vector.sub(tentacle.segments[0].a, posBefore);
  for (const seg of tentacle.segments) {
    seg.a.sub(stretchedVec);
    seg.b.sub(stretchedVec);
  }
}
