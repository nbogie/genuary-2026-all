//A p5.js global-mode sketch

/** An array of colours (hex code strings) */
const palette = ["#5e412f", "#fcebb6", "#78c0a8", "#f07818", "#f0a830"];

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(20);
    fill(255);
}

function draw() {
    background(20);
    circle(width / 2, height / 2, 50);
    const myPos = randomPositionAroundMouse(100);
    circle(myPos.x, myPos.y, 20);
    text("global-mode (normal) sketch", 50, height - 50);
}

function mousePressed() {
    fill(random(palette));
}
/** Create and return a position (Vector) within a radius around the mouse
 * @param {number} range - max allowed distance from mouse
 * @returns {p5.Vector} */
function randomPositionAroundMouse(range) {
    //This function (and its jsdoc) is mostly here to check type-checking
    // of p5.Vector is available both as a type and as a runtime value.
    const offset = p5.Vector.random2D().mult(random(0, range));
    return offset.add(mouseX, mouseY);
}
