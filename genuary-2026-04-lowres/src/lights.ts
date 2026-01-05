import type { Config } from "./config.ts";

export function addLights(config: Config) {
  if (config.lighting.blueTopLightEnabled) {
    directionalLight(color("#3ca6b1ff"), createVector(0, 1, 0.3).normalize());
    // directionalLight(color("#193937ff"), createVector(-1, 0.2, -0.3).normalize());
  }
  if (config.lighting.pinkAmbientLightEnabled) {
    ambientLight(90, 25, 25);
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

export function setNighttimeLightingConfig(config: Config) {
  config.lighting.blueTopLightEnabled = true;
  config.lighting.eerieAmbientLightEnabled = true;
  config.lighting.pinkAmbientLightEnabled = false;
  config.lighting.whiteDirectionalLightEnabled = false;
}

export function setDaytimeLightingConfig(config: Config) {
  config.lighting.blueTopLightEnabled = true;
  config.lighting.eerieAmbientLightEnabled = false;
  config.lighting.pinkAmbientLightEnabled = true;
  config.lighting.whiteDirectionalLightEnabled = true;
}

export function toggleNightDayLightingConfig(config: Config) {
  if (config.lighting.pinkAmbientLightEnabled) {
    setNighttimeLightingConfig(config);
  } else {
    setDaytimeLightingConfig(config);
  }
}
