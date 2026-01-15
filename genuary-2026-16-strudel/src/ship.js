/**
 * @typedef {Object} Ship
 * @property {p5.Vector} pos
 * @property {p5.Vector} vel
 * @property {p5.Vector} targetPos
 */

/**
 * @type Ship
 */
let playerShip;

/**
 * @returns {Ship}
 */

function createPlayerShip() {
    return {
        pos: createVector(width / 2, height * 0.9),
        vel: createVector(0, -2),
        targetPos: createVector(width / 2, height / 2).add(
            p5.Vector.random2D().mult(random(100, height / 2))
        ),
    };
}

/**@param {Ship} ship */
function drawPlayerShip(ship) {
    push();
    translate(ship.pos);
    fill("lime");
    rect(0, 0, 10, 30);
    pop();
    push();
    translate(ship.targetPos);
    fill("red");
    circle(0, 0, 20);
    pop();
}

/**@param {Ship} ship */
function updatePlayerShip(ship) {
    // ship.pos.add(ship.vel);

    ship.pos.lerp(ship.targetPos, 0.02);
}
