import "p5/global";
//@ts-ignore
import p5 from "p5";

p5.disableFriendlyErrors = true;
let mainModel: p5.Geometry;
let itemModels: p5.Geometry[];
window.setup = async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  mainModel = await loadModel("mr-potatohead.obj");
  itemModels = await Promise.all(modelParts.map((item) => loadModel(item.path)));
  frameRate(1);
};

window.draw = function draw() {
  background(30);
  orbitControl();
  debugMode();
  lights();
  ambientLight("#aaaaaa");
  noStroke();
  scale(100);
  // model(mainModel);
  itemModels.forEach((mdl) => {
    push();
    const v = 0.1;
    translate(randomGaussian(0, v), randomGaussian(0, v), randomGaussian(0, v));
    if (random() < 0.2) {
      rotateZ(random(TWO_PI));
    }
    model(mdl);
    pop();
  });
};

const modelParts = [
  { path: "item-brow1.obj", position: { x: 0, y: 0, z: 0 } },
  { path: "item-brow2.obj", position: { x: 0, y: 0, z: 0 } },
  { path: "item-eyes-both.obj", position: { x: 0, y: 0, z: 0 } },
  { path: "item-hat.obj", position: { x: 0, y: 0, z: 0 } },
  { path: "item-mouth.obj", position: { x: 0, y: 0, z: 0 } },
  { path: "item-nose.obj", position: { x: 0, y: 0, z: 0 } },
  { path: "item-potato.obj", position: { x: 0, y: 0, z: 0 } },
];
