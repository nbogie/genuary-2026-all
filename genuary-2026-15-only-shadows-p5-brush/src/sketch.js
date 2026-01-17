//online at https://openprocessing.org/sketch/2849855

//notes:
//brush fill and bleed settings seem to ignore push and pop (with p5 1.11.11, at least).

let palette = ["#7b4800", "#fcd300", "#ff2702"]; //"#002185", "#003c32","#6b9404"
let config = { maxRayLength: 800 };
/**
 * @type {Player}
 */
let player;
/**
 * @type {LineSeg[]}
 */
let gWalls;

function setup() {
    createCanvas(1400, 700, WEBGL);

    pixelDensity(1);
    player = createPlayer();
    gWalls = createWalls();
    console.log({ gWalls });

    noLoop();
}

function draw() {
    background(100);

    // drawFillCWPolygonBlob();

    drawPlayer(player);
    // drawScribble()

    // drawAPicture()
    const rayResults = castRaysFromPlayer();
    // drawRayResults(rayResults);
    const onlyHits = rayResults.filter((rr) => rr.intersectionOrNull);
    const pts = onlyHits.map((rr) => rr.intersectionOrNull);
    pts.push(player.pos.copy());
    strokeWeight(10);
    stroke("lime");

    pts.forEach((pt) => {
        point(pt);
    });

    // drawRayResults(onlyHits);

    drawFillCWPoints(pts);
    push();
    stroke("magenta");
    strokeWeight(5);
    drawLineSegs(gWalls);
    pop();
}
/**
 *
 * @param {RayResult[]} rayResults
 */
function drawRayResults(rayResults) {
    for (let result of rayResults) {
        push();

        const intersectionOrNull = result.intersectionOrNull;
        if (intersectionOrNull) {
            strokeWeight(2);
            stroke("yellow");
            line(
                result.origin.x,
                result.origin.y,
                intersectionOrNull.x,
                intersectionOrNull.y,
            );
        } else {
            strokeWeight(2);
            stroke("gray");
            line(
                result.origin.x,
                result.origin.y,
                result.origin.x + result.ray.x,
                result.origin.y + result.ray.y,
            );
        }
        pop();
    }
}
/**
 * @typedef {Object} LineSeg
 * @property {p5.Vector} a
 * @property {p5.Vector} b
 */

/**
 * @typedef {Object} Player
 * @property {p5.Vector} pos
 * @property {p5.Vector} facing
 */
function createPlayer() {
    /** @type {Player} */
    const pl = {
        pos: createVector(-200, -200),
        facing: p5.Vector.fromAngle(PI / 4),
    };
    return pl;
}
/**
 *
 * @param {Player} pl
 */
function drawPlayer(pl) {
    push();
    translate(pl.pos);
    rectMode(CENTER);
    fill("tomato");
    // rotate(pl.facing.heading());
    rotate(2);
    square(0, 0, 60);

    pop();
}

/**
 * @typedef {Object} RayResult
 * @property {p5.Vector} ray
 * @property {p5.Vector} origin
 * @property {p5.Vector | null} intersectionOrNull
 *
 */

/**
 * @returns {RayResult[]}
 */
function castRaysFromPlayer() {
    const pl = player;
    const startAngle = pl.facing.heading() - PI / 4;
    const endAngle = pl.facing.heading() + PI / 4;
    const angleStep = TWO_PI / 256;

    /** @type {RayResult[]} results */
    const results = [];

    for (let angle = startAngle; angle <= endAngle; angle += angleStep) {
        const rayVec = p5.Vector.fromAngle(angle, config.maxRayLength);
        /**
         * @type {LineSeg}
         */
        const rayLineSeg = { a: pl.pos, b: pl.pos.copy().add(rayVec) };
        /** @type {(p5.Vector | null)[]} */
        const allIntersections = gWalls
            .map((wall) => intersect(wall, rayLineSeg) || null)
            .filter((res) => res);

        const nearestISect =
            allIntersections.length === 0
                ? null
                : minBy(allIntersections, (isect) => isect.dist(pl.pos));

        /**
         * @type {RayResult}
         */
        const result = {
            ray: rayVec,
            origin: pl.pos.copy(),
            intersectionOrNull: nearestISect,
        };
        results.push(result);
    }
    return results;
}

function mousePressed() {
    background("#fffceb");

    drawFillCWPolygonBlob();
}

function drawFillCWPolygonBlob() {
    push();

    brush.fill(random(palette), random(60, 100));
    brush.bleed(random(0.1, 0.4));
    brush.fillTexture(0.55, 0.8);
    brush.beginShape();
    const angleStep = TWO_PI / 12;
    const baseRadius = 200;
    for (let angle = 0; angle < TWO_PI; angle += angleStep) {
        const v = p5.Vector.fromAngle(angle, random(1, 2) * baseRadius);
        brush.vertex(v.x, v.y);
    }
    brush.endShape(CLOSE);

    pop();
}
/**
 *
 * @param {p5.Vector[]} pts
 */
function drawFillCWPoints(pts) {
    push();
    brush.fill(random(palette), random(60, 100));
    brush.bleed(random(0.1, 0.1));
    brush.fillTexture(0.55, 0.8);
    brush.beginShape();
    for (let pt of pts) {
        brush.vertex(pt.x, pt.y);
    }
    brush.endShape(CLOSE);
    pop();
}

function drawScribble() {
    const rw = () => random(-width, width);
    const rh = () => random(-height, height);
    push();
    brush.beginShape();
    for (let i = 0; i < 20; i++) {
        brush.vertex(rw(), rh());
        brush.vertex(rw(), rh());
        brush.vertex(rw(), rh());
        brush.vertex(rw(), rh());
        brush.vertex(rw(), rh());
    }
    brush.endShape();

    brush.fill(random(palette), random(60, 100));
    brush.bleed(random(0.1, 0.4));
    brush.fillTexture(0.55, 0.8);

    // We draw the rectangular grid here
    // brush.rect(rw(), rh(), 200, 100)

    pop();
}

function drawAPicture() {
    push();
    translate(-width / 2, -height / 2);

    // We create a grid here
    let num_cols = 12;
    let num_rows = 6;
    let border = 300;
    let col_size = (width - border) / num_cols;
    let row_size = (height - border) / num_rows;

    // We define the brushes for the hatches, and the brushes for the strokes
    let hatch_brushes = ["marker", "marker2"];
    let stroke_brushes = ["2H", "HB", "charcoal"];

    // Test Different Flowfields here: "zigzag", "seabed", "curved", "truncated"
    brush.field("truncated");
    // You can also disable field completely with brush.noField()

    // We create the grid here
    for (let i = 0; i < num_rows; i++) {
        for (let j = 0; j < num_cols; j++) {
            // We fill 10% of the cells
            if (random() < 0.1) {
                // Set Fill
                brush.fill(random(palette), random(60, 100));
                brush.bleed(random(0.1, 0.4));
                brush.fillTexture(0.55, 0.8);
            }

            // We stroke + hatch the remaining
            else {
                // Set Stroke
                brush.set(random(stroke_brushes), random(palette));

                // Set Hatch
                // You set color and brush with .setHatch(brush_name, color)
                brush.setHatch(random(hatch_brushes), random(palette));
                // You set hatch params with .hatch(distance_between_lines, angle, options: see reference)
                brush.hatch(random(10, 60), random(0, 180), {
                    rand: 0,
                    continuous: false,
                    gradient: false,
                });
            }

            // We draw the rectangular grid here
            brush.rect(
                border / 2 + col_size * j,
                border / 2 + row_size * i,
                col_size,
                row_size,
            );

            // Reset states for next cell
            brush.noStroke();
            brush.noFill();
            brush.noHatch();
        }
    }
    pop();
}

/**
 *Determine the intersection point of two line segments
 * Return FALSE if the lines don't intersect
 * from http://paulbourke.net/geometry/pointlineplane/javascript.txt
 * line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
 *  @param {LineSeg} seg1
 * @param {LineSeg} seg2
 * @returns {p5.Vector | false}
 */
function intersect(seg1, seg2) {
    let x1 = seg1.a.x;
    let y1 = seg1.a.y;
    let x2 = seg1.b.x;
    let y2 = seg1.b.y;

    let x3 = seg2.a.x;
    let y3 = seg2.a.y;
    let x4 = seg2.b.x;
    let y4 = seg2.b.y;

    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false;
    }

    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    // Lines are parallel
    if (denominator === 0) {
        return false;
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false;
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);

    return createVector(x, y);
}

/**@param{LineSeg[]}  lineSegs*/
function drawLineSegs(lineSegs) {
    lineSegs.forEach((lineSeg) => drawLineSeg(lineSeg));
}
/**@param{LineSeg}  lineSeg*/
function drawLineSeg(lineSeg) {
    line(lineSeg.a.x, lineSeg.a.y, lineSeg.b.x, lineSeg.b.y);
}

/**@returns{LineSeg[]} */
function createWalls() {
    /**@type{LineSeg[]} */
    const walls = [];
    walls.push(
        ...[
            {
                a: createVector(width / 2, height / 2),
                b: createVector(0, 0),
            },

            {
                a: createVector(-width / 2, -height / 2),
                b: createVector(width / 2, -height / 2),
            },
            {
                a: createVector(width / 2, -height / 2),
                b: createVector(width / 2, height / 2),
            },
            {
                a: createVector(width / 2, height / 2),
                b: createVector(-width / 2, height / 2),
            },

            {
                a: createVector(-width / 2, height / 2),
                b: createVector(-width / 2, -height / 2),
            },

            {
                a: createVector(width / 2, height / 2),
                b: createVector(0, 0),
            },
            {
                a: createVector(0, (1 * height) / 2),
                b: createVector(0.5 * width, 0),
            },
        ],
    );

    const moar = collect(8, createRandomWall);
    return [...walls, ...moar];
}

/**
 * Finds the element in an array that results in the minimum value
 * when passed through the iteratee function.
 * @template T
 * @param {T[]} array The array to iterate over.
 * @param {(t:T)=>number } iteratee The function to execute on each element to get the value to compare.
 * @returns {T} The element that produced the minimum value, or undefined if the array is empty.
 */
function minBy(array, iteratee) {
    if (!array || array.length === 0) {
        return undefined;
    }
    let minElement = array[0];
    let minValue = iteratee(array[0]);
    for (let i = 1; i < array.length; i++) {
        const currentElement = array[i];
        const currentIteratedValue = iteratee(currentElement);
        // If the current iterated value is less than the current minimum value
        if (currentIteratedValue < minValue) {
            minValue = currentIteratedValue;
            minElement = currentElement;
        }
    }
    return minElement;
}

/**
 * Builds and returns an array collected from the repeated calling of the given function.
 * @template T
 *
 * @param {number} numItems number of items to collect
 * @param {(ix:number) =>T} fn function to call repeatedly in order to construct each element of the array.  It will be passed a counter (zero-based) indicating the number of the current iteration.
 * @returns {T[]} array of constructed items
 */
function collect(numItems, fn) {
    const results = [];
    for (let i = 0; i < numItems; i++) {
        results.push(fn(i));
    }
    return results;
}
/**
 *
 * @param {number} ix
 * @returns LineSeg
 */
function createRandomWall(ix) {
    const randomVertex = () =>
        createVector(random(-0.6, 0.6) * width, random(-0.6, 0.6) * height);
    return {
        a: randomVertex(),
        b: randomVertex(),
    };
}
