import { MeshStandardMaterial, Color, BoxGeometry } from "three";
import { Evaluator, Brush, ADDITION } from "three-bvh-csg";
import type { CSGConfig } from "./types.ts";
import { pickRandom, rDim } from "./utils.ts";
import type { Palette } from "./palette.ts";

//The grid-panels this creates looks crap, just delete?
//(It'd be better with square cells, but it also should never(?) be subtracted from.  it's a surface feature (greebling))
export function buildGridBrush(
    csgConfig: CSGConfig,
    evaluator: Evaluator,
    palette: Palette
) {
    const totalWidth = rDim();
    const totalHeight = rDim();
    const totalDepth = rDim();
    const myMaterial = new MeshStandardMaterial({
        color: new Color(pickRandom(palette.colors)),
    });

    //build 3x3 (n x n?) grid of meshes always facing out along x-y
    const numCells = 3;
    const gapAsFractionOfCellWidth = 1 / 8;
    const fullCellWidth = totalWidth / numCells;
    const fullCellHeight = totalHeight / numCells;
    const cellWidth = totalWidth / numCells / (1 + gapAsFractionOfCellWidth);
    const cellHeight = totalHeight / numCells / (1 + gapAsFractionOfCellWidth);

    let gridBrush = new Brush(
        new BoxGeometry(totalWidth, totalHeight, totalDepth),
        myMaterial
    );

    for (let gridX = 0; gridX < numCells; gridX++) {
        for (let gridY = 0; gridY < numCells; gridY++) {
            const cellBrush = new Brush(
                new BoxGeometry(cellWidth, cellHeight, totalDepth / 8),
                myMaterial
            );
            cellBrush.position.x = (gridX + 0.5) * fullCellWidth;
            cellBrush.position.y = (gridY + 0.5) * fullCellHeight;
            cellBrush.updateMatrixWorld();
            //then combine them all additively to one intermediate brush,
            gridBrush = evaluator.evaluate(gridBrush, cellBrush, ADDITION);
        }
    }
    const offset = csgConfig.genOffset();
    gridBrush.position.x = -totalWidth / 2 + offset.x;
    gridBrush.position.y = -totalHeight / 2 + offset.y;
    gridBrush.position.z = pickRandom([-2.5, 2.5]);
    gridBrush.updateMatrixWorld();
    return gridBrush;
}
