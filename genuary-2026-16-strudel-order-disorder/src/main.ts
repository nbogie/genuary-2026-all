import p5 from "p5";
import {
  createEntityChaos,
  createEntityOrder,
  drawChaosEntity,
  drawOrderEntity,
  type Entity,
  updateEntity,
} from "./entity.ts";
import { type MyInputs, setupMyInputs } from "./inputs.ts";
import { createPatterns } from "./patterns.ts";
import { createPlayerShip, drawPlayerShip, type Ship, updatePlayerShip } from "./ship.ts";
import { tvNoiseFragShaderSrc } from "./tvNoiseFragShaderSrc.ts";
// p5.disableFriendlyErrors = true;

export function getWorld(): World {
  return gWorld;
}

export interface World {
  playerShip: Ship;
  entityOrder: Entity;
  entityChaos: Entity;
  myInputs: MyInputs;
  radius: number;
  graphics: {
    starfield: p5.Graphics;
  };
}
//Keeping this outside the sketch function so it's available globally...
//We won't be running multiple instances of this sketch despite the mode-name.
let gWorld: World;

//keeping the strudel patterns separate for now.
let myPatterns: ReturnType<typeof createPatterns>;

let tvNoiseShader: p5.Shader;

new p5(sketch);
function sketch(p: p5) {
  p.setup = setup;
  p.draw = draw;

  function setup() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    gWorld = createWorld();
    strudel.initStrudel({
      prebake: () => {
        samples("github:tidalcycles/dirt-samples"), samples("github:yaxu/clean-breaks");
      },
    });

    myPatterns = createPatterns();

    drawStarfield(gWorld.graphics.starfield, p);

    tvNoiseShader = p.createFilterShader(tvNoiseFragShaderSrc());
    p.frameRate(30);
  }

  function draw() {
    p.background(20);

    p.translate(-gWorld.playerShip.pos.x + p.width / 2, -gWorld.playerShip.pos.y + p.height / 2);
    p.image(gWorld.graphics.starfield, 0, 0);

    updatePlayerShip(gWorld.playerShip, p);
    drawPlayerShip(gWorld.playerShip, p);

    updateEntity(gWorld.entityOrder, p);
    drawOrderEntity(gWorld.entityOrder, p);

    updateEntity(gWorld.entityChaos, p);
    drawChaosEntity(gWorld.entityChaos, p);

    tvNoiseShader.setUniform("time", p.millis());
    tvNoiseShader.setUniform(
      "distortionAmount",
      p.map(gWorld.playerShip.pos.dist(gWorld.entityChaos.pos), 0, 300, 0.02, 0, true)
    );

    p.filter(tvNoiseShader);
  }

  function createWorld(): World {
    const playerShip = createPlayerShip(p);
    const entityOrder = createEntityOrder(p);
    const entityChaos = createEntityChaos(p);
    return {
      playerShip,
      entityOrder,
      entityChaos,
      myInputs: setupMyInputs(playerShip, entityOrder, entityChaos, p),
      graphics: {
        starfield: p.createGraphics(2 * p.width, 2 * p.height),
      },
      radius: 4000,
    };
  }

  p.windowResized = function windowResized() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.deviceShaken = function deviceShaken() {
    if (p.touches.length === 1) {
      strudel.hush();
    }
  };

  p.keyPressed = function keyPressed() {
    if (p.key === " ") {
      //simplest example
      s("bd hh sd hh [bd bd] hh sd hh").play();
    }

    if (p.key === "." || p.key === "h") {
      strudel.hush();
    }

    if (p.key >= "0" && p.key <= "9") {
      const num = parseInt(p.key) - 1;

      const pattn = myPatterns[num];
      if (!pattn) {
        console.log("no pattern in slot: " + num + " so ignoring keypress.");
        return;
      }

      console.log("evaluating strudel code #" + num + ": " + pattn.title);
      pattn.fn();
    }
  };

  function mouseScreenPos() {
    return p.createVector(p.mouseX, p.mouseY);
  }
  function mouseWorldPos() {
    return screenPosToWorldPos(mouseScreenPos());
  }

  p.mousePressed = function mousePressed() {
    const pos = mouseWorldPos();
    gWorld.playerShip.targetPos = pos.copy();
  };

  p.doubleClicked = function doubleClicked() {
    if (p.random() < 0.1) {
      strudel.hush();
      return;
    }
    const [num, pattn] = p.random(myPatterns.map((pt, ix) => [ix, pt] as const));
    console.log("evaluating strudel code #" + num + ": " + pattn.title);
    pattn.fn();
  };
  /**
   *writes to the given graphics
   */
  function drawStarfield(g: p5.Graphics, p: p5) {
    for (let i = 0; i < 1000; i++) {
      const pos = p5.Vector.random2D().mult(p.random(0, gWorld.radius));
      g.stroke("white");
      g.strokeWeight(p.random([1, 1, 1, 2, 3]));
      g.point(pos.x, pos.y);
    }
  }
  function screenPosToWorldPos(screenPos: p5.Vector): p5.Vector {
    const centreOffset = p.createVector(-p.width / 2, -p.height / 2);
    //this should be a camera that lerps towards the player, not immediately the player.
    const shipPos = gWorld.playerShip.pos.copy();
    return p5.Vector.add(shipPos, screenPos).add(centreOffset);
  }
}
