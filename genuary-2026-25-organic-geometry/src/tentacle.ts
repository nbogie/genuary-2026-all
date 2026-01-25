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
}

export function buildTentacle(
  startPos: p5.Vector,
  endPos: p5.Vector,
  startRadius: number,
  endRadius: number
): Tentacle {
  const numSegments = 20;
  const segs: TentacleSegment[] = [];
  for (let i = 0; i < numSegments; i++) {
    const a = startPos.copy().lerp(endPos, i / numSegments);
    const b = startPos.copy().lerp(endPos, (i + 1) / numSegments);
    const aRadius = lerp(startRadius, endRadius, i / numSegments);
    const seg: TentacleSegment = { a, b, isAnchored: i === 0, aRadius };
    segs.push(seg);
  }
  return { segments: segs };
}

export function drawTentacle(tentacle: Tentacle) {
  fill("darkgreen");
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
  fill("lime");
  noStroke();
  for (let seg of tentacle.segments) {
    push();
    translate(seg.a);
    circle(0, 0, seg.aRadius * 0.7);
    pop();
    push();
    translate(seg.b);
    circle(0, 0, seg.aRadius * 0.7);
    pop();
    // push();
    // strokeWeight(5);
    // stroke("pink");
    // line(seg.a.x, seg.a.y, seg.b.x, seg.b.y);
    // pop();
  }
}

/** mutates tentacle in place */
export function updateTentacle(tentacle: Tentacle) {
  const segsReversed = [...tentacle.segments].reverse();
  let prev: TentacleSegment | undefined = undefined;
  const posBefore = tentacle.segments[0].a.copy();
  for (const seg of segsReversed) {
    const oldLen = seg.a.dist(seg.b);
    const targetPos = prev ? prev.a : mousePos();
    // seg.b.lerp(targetPos, 0.99);
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
