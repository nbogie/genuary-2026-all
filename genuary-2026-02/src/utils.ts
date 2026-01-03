import type p5 from "p5";

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
