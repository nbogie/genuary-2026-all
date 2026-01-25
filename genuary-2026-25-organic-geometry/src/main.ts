import "p5/global";
//@ts-ignore
import p5 from "p5";

p5.disableFriendlyErrors = true;

window.setup = function setup() {
  createCanvas(windowWidth, windowHeight);
  background(30);
};

window.draw = function draw() {
  square(mouseX, mouseY, 100);
};
