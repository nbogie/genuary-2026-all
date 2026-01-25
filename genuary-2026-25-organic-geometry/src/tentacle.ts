import p5 from "p5";

export interface Tentacle {
  target: p5.Vector;
  destTarget: p5.Vector;
  segments: TentacleSegment[];
  pixelLength: number;
  index: number;
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
  hueDeviation: number;
  numSegments: number;
  index: number;
}): Tentacle {
  const { index, startPos, endPos, startRadius, endRadius, baseHue, hueDeviation, numSegments } =
    spec;

  const segs: TentacleSegment[] = [];
  let prevPos = startPos.copy();
  let towardsEnd = endPos.copy().sub(startPos);
  let len = towardsEnd.mag() / numSegments;
  push();
  colorMode(HSB);
  for (let i = 0; i < numSegments; i++) {
    const a = prevPos.copy();
    const b = prevPos.copy().add(towardsEnd.copy().setMag(len));

    const aRadius = lerp(startRadius, endRadius, i / numSegments);
    len = aRadius * 0.2;

    const colour = color(randomGaussian(baseHue, hueDeviation), random(60, 65), random(55, 65));
    const seg: TentacleSegment = { a, b, isAnchored: i === 0, aRadius, colour };
    segs.push(seg);
    prevPos = b.copy();
  }
  pop();
  const target = createTentacleTarget(segs);
  return {
    index,
    segments: segs,
    target,
    destTarget: target.copy(),
    pixelLength: segs[0]!.a.dist(segs.at(-1)!.b),
  };
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
  const tipTarget: p5.Vector = tentacle.target; //mousePos();
  for (const seg of segsReversed) {
    const oldLen = seg.a.dist(seg.b);
    const targetPos = prev ? prev.a : tipTarget;
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
  updateTentacleTarget(tentacle);
}

function createTentacleTarget(segments: TentacleSegment[]): p5.Vector {
  const one = segments.at(0)!;
  const two = segments.at(-1)!;
  const midpoint = p5.Vector.lerp(one.a, two.b, 0.5);
  const len = two.a.dist(one.b);
  return midpoint.add(p5.Vector.random2D().mult(random(0.1, len / 2)));
}
export function updateTentacleTargetTowardsNoisily(tentacle: Tentacle, basicPos: p5.Vector) {
  const timeScale = 0.005;
  const maxNoiseRange = 100;
  const x =
    maxNoiseRange *
    map(noise(1000 + tentacle.index * 777, millis() * timeScale), 0.15, 0.85, -1, 1, true);
  const y =
    maxNoiseRange *
    map(noise(3000 + tentacle.index * 577, millis() * timeScale), 0.15, 0.85, -1, 1, true);
  const pos = basicPos.add(createVector(x, y));
  return updateTentacleTargetTowards(tentacle, pos);
}
export function updateTentacleTargetTowards(tentacle: Tentacle, pos: p5.Vector) {
  //constrain dest to be within range R of tentacle base pos
  const toDest = p5.Vector.sub(pos, tentacle.segments[0]!.a);
  toDest.limit(tentacle.pixelLength * 0.9);
  tentacle.destTarget.lerp(toDest.add(tentacle.segments[0]!.a), 0.5);
}

function updateTentacleTarget(tentacle: Tentacle) {
  if (random() < 0.1) {
    const destStepSize = random(50, 170) * 2;
    const dest = p5.Vector.random2D().mult(destStepSize).add(tentacle.target);
    updateTentacleTargetTowards(tentacle, dest);
  }
  tentacle.target.lerp(tentacle.destTarget, 0.1);
}

export function attractTentaclesTowards(tentacles: Tentacle[], pos: p5.Vector) {
  tentacles.forEach((t) => updateTentacleTargetTowardsNoisily(t, pos));
}
