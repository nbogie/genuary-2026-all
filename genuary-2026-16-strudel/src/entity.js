/**
 * @typedef {Object} Entity
 * @property {p5.Vector} pos
 * @property {p5.Vector} vel
 * @property {p5.Vector} targetPos
 */

/**
 * @returns {Entity}
 */

function createEntity() {
    return {
        pos: createVector(random(width), random(height)),
        vel: p5.Vector.random2D().mult(1),
        targetPos: createRandomTargetPosForEntity(),
    };
}

function createRandomTargetPosForEntity() {
    return createVector(width / 2, height / 2).add(
        p5.Vector.random2D().mult(random(100, height / 2))
    );
}
/**@param {Entity} entity */
function drawEntity(entity) {
    push();
    translate(entity.pos);
    //TODO: this finds a strudel function, "rotate".  use ESM strudel, or p5 instance mode (or both)
    // rotate(frameCount / 1000);
    const sz = map(sin(millis() / 160), -1, 1, 0.6, 1, true) * 40;
    fill("skyblue");
    rectMode(CENTER);
    //TODO: have entity be a slow-rotating cog-wheel, no visual indication of time-signature
    rect(0, 0, sz * 0.2, sz);
    pop();

    push();
    translate(entity.targetPos);
    fill("dodgerblue");
    circle(0, 0, 20);
    pop();
}

/**@param {Entity} entity */
function updateEntity(entity) {
    entity.pos.lerp(entity.targetPos, 0.02);
    if (entity.targetPos.dist(entity.pos) < 30 && random() < 0.01) {
        entity.targetPos = createRandomTargetPosForEntity();
    }
}
