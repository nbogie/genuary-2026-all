import { MathUtils } from "three";

export function rDim(): number {
    return MathUtils.randFloat(1, 10);
}

export function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
