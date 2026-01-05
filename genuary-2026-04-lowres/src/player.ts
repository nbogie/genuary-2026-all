import p5 from "p5";
import { getPalette, type Palette } from "./utils/palette.ts";
export interface Player {
  pos: p5.Vector;
  vel: p5.Vector;
}

export function createPlayer(): Player {
  const { x, y } = p5.Vector.random2D().mult(0.9);
  const vel = createVector(x, 0, y);
  return { pos: createVector(0, 0, 0), vel };
}

export function updatePlayer(p: Player) {
  p.pos.add(p.vel);

  let steering = 0;
  if (keyIsDown(LEFT_ARROW)) {
    steering = -1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    steering = 1;
  }
  let heightInput = 0;
  if (keyIsDown(UP_ARROW)) {
    heightInput = -1;
  }
  if (keyIsDown(DOWN_ARROW)) {
    heightInput = 1;
  }

  const vel2D = xzVectorFrom3D(p.vel);
  vel2D.rotate((steering * PI) / 100);
  p.vel.x = vel2D.x;
  p.vel.z = vel2D.y;

  p.vel.y += heightInput * 0.07;
  p.vel.y *= 0.98;
}

export function drawPlayer(player: Player) {
  const palette: Palette = getPalette();
  const vec2D = xzVectorFrom3D(player.vel);
  push();
  noStroke();
  translate(player.pos);
  rotateY(-vec2D.heading());
  push();
  rotateZ(PI / 2);

  fill(palette.boat.wood);
  box(5, 20, 3, 1);
  // rotateY(PI / 2);
  pop();
  translate(0, -10, 0);

  rotateY(PI / 2);

  fill(palette.boat.sails);
  plane(10, 10);
  translate(0, 2, 5);
  plane(7, 7);
  pop();
}
function xzVectorFrom3D(vel: p5.Vector) {
  return createVector(vel.x, vel.z);
}
