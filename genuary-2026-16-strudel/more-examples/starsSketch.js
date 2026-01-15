/**
 * @typedef {Object} Star
 * @property {p5.Vector} pos
 * @property {p5.Vector} vel
 * @property {number} size
 * @property {string} colour
 */

/**
 * @type {Star[]}
 */
let stars;

function setup() {
    createCanvas(windowWidth, windowHeight);
    stars = createStars();
    background(20);
}

function draw() {
    background(20);
    drawStars();
    updateStars();
}

function drawStars() {
    for (let star of stars) {
        drawStar(star);
    }
}
function updateStars() {
    stars.forEach(updateStar);
}
/**
 *
 * @param {Star} s
 */
function updateStar(s) {
    s.pos.add(s.vel);
    if (s.pos.dist(getCentrePos()) > width / 2) {
        s.pos = randomScreenPos();
    }
}

/**
 * @returns {p5.Vector}
 */
function getCentrePos() {
    return createVector(width / 2, height / 2);
}

/**
 * @param {Star} star
 */
function drawStar(star) {
    noStroke();
    fill(star.colour);
    circle(star.pos.x, star.pos.y, star.size);
}

/**
 *
 * @returns {Star[]}
 */
function createStars() {
    const array = [];

    for (let i = 0; i < 100; i++) {
        /** @type {Star} */
        const star = {
            pos: randomScreenPos(),
            size: random([1, 1, 1, 2, 3, 8]),
            colour: random(["white", "skyblue", "pink"]),
            vel: p5.Vector.random2D().mult(random(1, 5)),
        };
        array.push(star);
    }
    return array;
}

/**@returns {p5.Vector} */
function randomScreenPos() {
    const offset = p5.Vector.random2D().mult(random(0, width / 2));

    return offset.add(getCentrePos());
}
