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
  setInterval(toggleNightDayLightingConfig, 5000);
};

window.draw = function draw() {
  push();
  // lights();

  addLights(gState.config);

  orbitControl();
  background(30);
  // debugMode();

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
  perspective(2 * atan(height / 2 / 800), width / height, near, far);
}

function toggleNightDayLightingConfig() {
  if (gState.config.lighting.pinkAmbientLightEnabled) {
    setNighttimeLightingConfig();
  } else {
    setDaytimeLightingConfig();
  }
}
