import type { CSGOperation } from "three-bvh-csg";

export type CSGConfig = {
    genOperation: () => CSGOperation;
    genOffset: () => {
        x: number;
        y: number;
        z: number;
    };
    genNumberOfElements: () => number;
};
