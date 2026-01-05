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
import { setCameraPerspective, setupCamera } from "./camera.ts";

p5.disableFriendlyErrors = true;

let gState: GlobalState;

window.setup = function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  gState = createGlobalState();
  setupCamera();
  setDaytimeLightingConfig(gState.config);
  setInterval(() => toggleNightDayLightingConfig(gState.config), 10_000);
};

window.draw = function draw() {
  push();
  addLights(gState.config);
  orbitControl(1.5, 1.5, 0.2);
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

window.windowResized = function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setCameraPerspective();
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
  if (key === "p") {
    togglePlayPause();
  }
  if (key === "m") {
    toggleConfigBoolean(gState.terrainConfig, "shouldDrawMilePosts");
  }
};

function toggleConfigBoolean(config: Record<string, any>, key: string) {
  if (key in config && typeof config[key] === "boolean") {
    config[key] = !config[key];
  }
}
function togglePlayPause() {
  if (isLooping()) {
    noLoop();
  } else {
    loop();
  }
}
