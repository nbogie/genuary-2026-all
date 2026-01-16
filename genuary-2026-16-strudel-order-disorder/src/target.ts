import p5 from "p5";
/**
 *
 * @param {p5.Vector} pos
 * @param {string} colour
 * @param {p5} p
 */
export function drawTarget(pos: p5.Vector, colour: string, p: p5) {
  p.push();
  p.translate(pos);
  p.stroke(colour);
  const sn = p.sin(p.millis() / 200);
  p.strokeWeight(p.map(sn, -1, 1, 2, 5));
  p.noFill();
  p.circle(0, 0, p.map(sn, -1, 1, 10, 20));
  p.pop();
}
