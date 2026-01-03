import p5 from "p5";

export function randomScreenPos(): p5.Vector {
  return createVector(random(0.1, 0.9) * width, random(0.1, 0.9) * height);
}
export function collect<T>(numElements: number, fn: (ix: number) => T) {
  const arr = [];
  for (let i = 0; i < numElements; i++) {
    arr.push(fn(i));
  }
  return arr;
}

export function snapTo(val: number, increment: number) {
  return increment * round(val / increment);
}

export function findCanvasEdgeIntersection(pos: p5.Vector, vec: p5.Vector): p5.Vector {
  const times: number[] = [];

  if (vec.x !== 0) {
    times.push((width - pos.x) / vec.x);
    times.push((0 - pos.x) / vec.x);
  }
  if (vec.y !== 0) {
    times.push((height - pos.y) / vec.y);
    times.push((0 - pos.y) / vec.y);
  }

  const nonNegativeTimes = times.filter((t) => t >= 0);
  const smallestTime = min(nonNegativeTimes);
  const intersection = p5.Vector.add(pos, vec.copy().mult(smallestTime));
  return intersection;
}

/**
 *
 * @returns function returning undefined for unwanted vector properties, numbers rounded (to given precision) as strings ,or any other values untouched
 * @example JSON.stringify(
       { positions: [p5.Vector.random2D(), p5.Vector.random2D()], other: {name: "fred", speed: 2.112412412312} },
       simplifyAnyVectorsForJSON(2)
     )
 */
export function simplifyAnyVectorsForJSON(precision: number) {
  return function (key: string, value: any): any {
    if (key === "isPInst" || key === "dimensions") {
      return undefined;
    }
    return typeof value === "number" ? Number(value.toFixed(precision)) : value;
  };
}
