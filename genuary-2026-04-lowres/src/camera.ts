import p5 from "p5";

export function setupCamera() {
  const near = 0.1;
  const far = 3000;
  const camRadiusHoriz = 180;
  const camAngle = PI * 0.75;
  const camPos2D = p5.Vector.fromAngle(camAngle, camRadiusHoriz);
  camera(camPos2D.x, -camRadiusHoriz * 0.6, camPos2D.y);
  perspective(2 * atan(height / 2 / 800), width / height, near, far);
}
