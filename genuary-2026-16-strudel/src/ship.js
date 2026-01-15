/**
 * @typedef {Object} Ship
 * @property {p5.Vector} pos
 * @property {p5.Vector} vel
 * @property {p5.Vector} targetPos
 */

/**
 * @param {p5} p
 * @returns {Ship}
 */
function createPlayerShip(p) {
    return {
        pos: p.createVector(p.width / 2, p.height * 0.9),
        vel: p.createVector(0, -2),
        targetPos: p
            .createVector(p.width / 2, p.height / 2)
            .add(p5.Vector.random2D().mult(p.random(100, p.height / 2))),
    };
}

/**@param {Ship} ship */
function drawPlayerShip(ship, p) {
    p.push();
    p.translate(ship.pos);
    p.fill("lime");
    p.rect(0, 0, 10, 30);
    p.pop();
    p.push();
    p.translate(ship.targetPos);
    p.fill("red");
    p.circle(0, 0, 20);
    p.pop();
}

/**
 * @param {Ship} ship
 * @param {p5} p */
function updatePlayerShip(ship, p) {
    // ship.pos.add(ship.vel);

    ship.pos.lerp(ship.targetPos, 0.02);
}
