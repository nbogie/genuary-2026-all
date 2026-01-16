import p5 from "p5";

/**
 * @typedef {Object} Ship
 * @property {p5.Vector} pos
 * @property {p5.Vector} vel
 * @property {p5.Vector} targetPos
 */

import { drawTarget } from "./target.ts";

/**
 * @param {p5} p
 * @returns {Ship}
 */
function createPlayerShip(p) {
  return {
    pos: p.createVector(p.width / 2, p.height * 0.9),
    vel: p.createVector(0, -2),
    targetPos: p
      .createVector(p.width / 2, p.height / 2)
      .add(p5.Vector.random2D().mult(p.random(100, p.height / 2))),
  };
}

/**@param {Ship} ship */
function drawPlayerShip(ship, p) {
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

function updatePlayerShip(ship: Ship, p: p5) {
  // ship.pos.add(ship.vel);

  //for now, prioritise exploring the area during dev
  ship.pos.lerp(ship.targetPos, 0.02);

  //just a hack so we know which way we're moving
  ship.vel = p5.Vector.sub(ship.targetPos, ship.pos).normalize();
}
