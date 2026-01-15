/**
 * @typedef {Object} Entity
 * @property {p5.Vector} pos
 * @property {p5.Vector} vel
 * @property {p5.Vector} targetPos
 */

/**
 * @param {p5} p
 * @returns {Entity}
 */

function createEntity(p) {
    return {
        pos: p.createVector(p.random(p.width), p.random(p.height)),
        vel: p5.Vector.random2D().mult(1),
        targetPos: createRandomTargetPosForEntity(p),
    };
}

/**
 *
 * @param {p5} p
 * @returns {p5.Vector}
 */
function createRandomTargetPosForEntity(p) {
    return p
        .createVector(p.width / 2, p.height / 2)
        .add(p5.Vector.random2D().mult(p.random(100, p.height / 2)));
}
/**
 * @param {Entity} entity
 * @param {p5} p
 */
function drawEntity(entity, p) {
    p.push();
    p.translate(entity.pos);
    //TODO: this finds a strudel function, "rotate".  use ESM strudel, or p5 instance mode (or both)
    p.rotate(p.frameCount / 10);
    const sz = p.map(p.sin(p.millis() / 160), -1, 1, 0.6, 1, true) * 40;
    p.fill("skyblue");
    p.rectMode(p.CENTER);
    //TODO: have entity be a slow-rotating cog-wheel, no visual indication of time-signature
    p.rect(0, 0, sz * 0.2, sz);
    p.rotate(p.PI / 2);
    p.rect(0, 0, sz * 0.2, sz);
    p.pop();

    p.push();
    p.translate(entity.targetPos);
    p.fill("dodgerblue");
    p.circle(0, 0, 20);
    p.pop();
}

/**@param {Entity} entity
 * @param {p5} p
 */
function updateEntity(entity, p) {
    entity.pos.lerp(entity.targetPos, 0.02);
    if (entity.targetPos.dist(entity.pos) < 30 && p.random() < 0.01) {
        entity.targetPos = createRandomTargetPosForEntity(p);
    }
}
