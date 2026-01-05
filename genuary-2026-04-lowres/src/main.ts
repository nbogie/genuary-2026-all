import "p5/global";
//@ts-ignore
import p5 from "p5";
import { createGlobalState, type GlobalState } from "./globalState.ts";
import { addLights } from "./lights.ts";
import { drawPlayer, updatePlayer } from "./player.ts";
import { drawTerrainAround } from "./terrain.ts";

p5.disableFriendlyErrors = true;

let gState: GlobalState;

window.setup = function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  gState = createGlobalState();
  setupCamera();
  if (random() < 0.5) {
    toggleNightDayLightingConfig();
  }
  setInterval(toggleNightDayLightingConfig, 10_000);
};

window.draw = function draw() {
  push();
  addLights(gState.config);
  orbitControl();
  background(20);
  push();

  translate(p5.Vector.mult(gState.player.pos, -1));
  drawTerrainAround(gState.player, gState.terrainConfig);
  drawPlayer(gState.player);
  updatePlayer(gState.player);
  pop();
  pop();
};

window.keyPressed = function keyPressed() {
  if (key === "b") {
    toggleConfigBoolean(gState.config.lighting, "blueTopLightEnabled");
  }
  if (key === "w") {
    toggleConfigBoolean(gState.config.lighting, "pinkAmbientLightEnabled");
  }
  if (key === "d") {
    setDaytimeLightingConfig();
  }
  if (key === "n") {
    setNighttimeLightingConfig();
  }
};

function setNighttimeLightingConfig() {
  gState.config.lighting.blueTopLightEnabled = true;
  gState.config.lighting.eerieAmbientLightEnabled = true;
  gState.config.lighting.pinkAmbientLightEnabled = false;
  gState.config.lighting.whiteDirectionalLightEnabled = false;
}

function setDaytimeLightingConfig() {
  gState.config.lighting.blueTopLightEnabled = true;
  gState.config.lighting.eerieAmbientLightEnabled = false;
  gState.config.lighting.pinkAmbientLightEnabled = true;
  gState.config.lighting.whiteDirectionalLightEnabled = true;
}

function toggleConfigBoolean(config: Record<string, boolean>, key: string) {
  if (key in config) {
    config[key] = !config[key];
  }
}

function setupCamera() {
  const near = 0.1;
  const far = 3000;
  const camRadiusHoriz = 120;
  const camAngle = PI * 0.75;
  const camPos2D = p5.Vector.fromAngle(camAngle, camRadiusHoriz);
  camera(camPos2D.x, -camRadiusHoriz / 2, camPos2D.y);
  perspective(2 * atan(height / 2 / 800), width / height, near, far);
}

function toggleNightDayLightingConfig() {
  if (gState.config.lighting.pinkAmbientLightEnabled) {
    setNighttimeLightingConfig();
  } else {
    setDaytimeLightingConfig();
  }
}
