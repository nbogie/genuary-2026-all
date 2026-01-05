import "p5/global";
//@ts-ignore
import p5 from "p5";
import { createGlobalState, type GlobalState } from "./globalState.ts";
import {
  addLights,
  setDaytimeLightingConfig,
  setNighttimeLightingConfig,
  toggleNightDayLightingConfig,
} from "./lights.ts";
import { drawPlayer, updatePlayer } from "./player.ts";
import { drawTerrainAround } from "./terrain.ts";
import { setupCamera } from "./camera.ts";

p5.disableFriendlyErrors = true;

let gState: GlobalState;

window.setup = function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  gState = createGlobalState();
  setupCamera();
  setDaytimeLightingConfig(gState.config);
  setInterval(toggleNightDayLightingConfig, 10_000);
};

window.draw = function draw() {
  push();
  addLights(gState.config);
  orbitControl();
  background(20);
  push();

  //centre all around ship position
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
    setDaytimeLightingConfig(gState.config);
  }
  if (key === "n") {
    setNighttimeLightingConfig(gState.config);
  }
};

function toggleConfigBoolean(config: Record<string, boolean>, key: string) {
  if (key in config) {
    config[key] = !config[key];
  }
}
