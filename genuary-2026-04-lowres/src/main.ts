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
  lights();
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
