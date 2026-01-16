import p5 from "p5";
import { drawTarget } from "./target.ts";

interface Ship {
  pos: p5.Vector;
  vel: p5.Vector;
  targetPos: p5.Vector;
}

export function createPlayerShip(p: p5): Ship {
  return {
    pos: p.createVector(p.width / 2, p.height * 0.9),
    vel: p.createVector(0, -2),
    targetPos: p
      .createVector(p.width / 2, p.height / 2)
      .add(p5.Vector.random2D().mult(p.random(100, p.height / 2))),
  };
}

/**@param {Ship} ship */
export function drawPlayerShip(ship: Ship, p: p5) {
  p.push();
  p.translate(ship.pos);
  p.fill("white");
  p.rectMode(p.CENTER);
  p.rotate(ship.vel.heading());
  // p.fill("lime");
  p.rect(-10, -5, 30, 6);
  p.rect(-10, 5, 30, 6);
  //front
  p.rect(0, 0, 10, 30);
  //back
  p.rect(-30, 0, 10, 20);
  p.pop();

  //draw player target
  drawTarget(ship.targetPos, "tomato", p);
}

export function updatePlayerShip(ship: Ship, _p: p5) {
  // ship.pos.add(ship.vel);

  //for now, prioritise exploring the area during dev
  ship.pos.lerp(ship.targetPos, 0.02);

  //just a hack so we know which way we're moving
  ship.vel = p5.Vector.sub(ship.targetPos, ship.pos).normalize();
}
