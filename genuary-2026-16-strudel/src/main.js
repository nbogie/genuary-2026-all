function setup() {
    createCanvas(800, 600);
}

function draw() {
    const cellSize = 120;
    const diameter = random(30, 120);
    const x = snapTo(random(width), cellSize);
    const y = snapTo(random(height), cellSize);
    noStroke();
    fill(snapTo(random(255), 50));
    circle(x, y, diameter);
}

/**
 * @param {number} value
 * @param {number} increment
 */
function snapTo(value, increment) {
    return increment * round(value / increment);
}
