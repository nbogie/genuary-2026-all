import type { Config } from "./config.ts";

export function addLights(config: Config) {
  if (config.lighting.blueTopLightEnabled) {
    directionalLight(color("#3ca6b1ff"), createVector(0, 1, 0.3).normalize());
    // directionalLight(color("#193937ff"), createVector(-1, 0.2, -0.3).normalize());
  }
  if (config.lighting.pinkAmbientLightEnabled) {
    ambientLight(100, 20, 20);
  }
  if (config.lighting.whiteDirectionalLightEnabled) {
    directionalLight(color("white"), createVector(1, 0.4, 0.3).normalize());
  }
  if (config.lighting.eerieAmbientLightEnabled) {
    // ambientLight("#2d1a36ff");
    // ambientLight("#1a3621ff");
    ambientLight("#050513");
  }
}
