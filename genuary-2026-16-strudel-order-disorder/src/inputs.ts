import p5 from "p5";
import type { Entity } from "./entity.ts";
import type { Ship } from "./ship.ts";

export interface MyInputs {
  shipX: any;
  shipY: any;
  mouseX: any;
  entityOrderCloseness: any;
  entityChaosCloseness: any;
}
export function setupMyInputs(
  playerShip: Ship,
  entity: Entity,
  entityChaos: Entity,
  p: p5
): MyInputs {
  //strudel already provides "mousex", but that is for the window not the canvas. we have more control here.

  if (!playerShip) {
    throw new Error("setup playerShip before inputs, please");
  }
  const shipX = strudel.pure("unused").withValue((val) => {
    return p.map(playerShip.pos.x, 0, p.width, 0, 1, true);
  });

  const shipY = strudel.pure("unused").withValue((val) => {
    //note, inverted
    return p.map(playerShip.pos.y, 0, p.height, 1, 0, true);
  });
  const entityOrderCloseness = strudel.pure("unused").withValue((val) => {
    const d = playerShip.pos.dist(entity.pos);
    return p.map(d, 0, 200, 1, 0, true);
  });

  const entityChaosCloseness = strudel.pure("unused").withValue((val) => {
    const d = playerShip.pos.dist(entityChaos.pos);
    return p.map(d, 0, 200, 1, 0, true);
  });

  const mouseXInput = strudel.pure("unused").withValue((val) => {
    return p.map(p.mouseX, 0, p.width, 0, 1, true);
  });

  return {
    shipX,
    shipY,
    mouseX: mouseXInput,
    entityOrderCloseness,
    entityChaosCloseness,
  };
}
