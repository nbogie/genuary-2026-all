import "p5/global";
//@ts-ignore
import p5 from "p5";
import { createGlobalState, type GlobalState } from "./globalState.ts";
import { drawPlayer, updatePlayer } from "./player.ts";
import { drawTerrainAround } from "./terrain.ts";

p5.disableFriendlyErrors = true;

let gState: GlobalState;

window.setup = function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  gState = createGlobalState();
};

window.draw = function draw() {
  push();
  // lights();

  addLights();

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
    //daytime
    gState.config.lighting.blueTopLightEnabled = true;
    gState.config.lighting.pinkAmbientLightEnabled = true;
    gState.config.lighting.whiteDirectionalLightEnabled = true;
  }
  if (key === "n") {
    gState.config.lighting.blueTopLightEnabled = true;
    gState.config.lighting.pinkAmbientLightEnabled = false;
    gState.config.lighting.whiteDirectionalLightEnabled = false;
  }
};

function toggleConfigBoolean(config: Record<string, boolean>, key: string) {
  if (key in config) {
    config[key] = !config[key];
  }
}

function addLights() {
  if (gState.config.lighting.blueTopLightEnabled) {
    directionalLight(color("skyblue"), createVector(0, 1, 0.3).normalize());
    directionalLight(color("skyblue"), createVector(-1, 0.2, -0.3).normalize());
  }
  if (gState.config.lighting.pinkAmbientLightEnabled) {
    ambientLight(100, 20, 20);
  }
  if (gState.config.lighting.whiteDirectionalLightEnabled) {
    directionalLight(color("white"), createVector(1, 0.4, 0.3).normalize());
  }
}
