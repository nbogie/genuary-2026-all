import p5 from "p5";

export function setupCamera() {
  const camRadiusHoriz = 200;
  const camAngle = PI * 0.75;
  const camPos2D = p5.Vector.fromAngle(camAngle, camRadiusHoriz);
  camera(camPos2D.x, -130, camPos2D.y);
  setCameraPerspective();
}

export function setCameraPerspective() {
  const near = 0.1;
  const far = 3000;
  perspective(2 * atan(height / 2 / 800), width / height, near, far);
}
