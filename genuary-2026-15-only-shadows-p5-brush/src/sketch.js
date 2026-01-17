//online at https://openprocessing.org/sketch/2849855
//source at https://github.com/nbogie/genuary-2026-all/tree/main/genuary-2026-15-only-shadows-p5-brush
//Neill's genuary-2026-15. Prompt is "Create an invisible object where only the shadows can be seen."
//It's really just a tech demo but i find it interesting and evocative, already.
//
//Credits:
//  Alejandro Campos for p5.brush library: https://p5-brush.cargo.site/
//  Amit Patel and Daniel Shiffman for resources on ray-casting for 2d visibility.
//  (iirc, that's how I originally learned ray-casting):
//    https://www.redblobgames.com/articles/visibility/
//    https://www.youtube.com/watch?v=TOEi6T2mtHo
//  Paul Bourke line-segment intersection math https://paulbourke.net/geometry/pointlineplane/

//Requirements p5.brush (1.1.4) and p5 v1.x (1.11.11)
//https://cdn.jsdelivr.net/npm/p5.brush

//TODO: monochrome, or much more desaturated, at least.  reserve color for impact.
//TODO: use a proc-gen'd tree from day 1?
//TODO: multi-stage - off boat, up hill past tree, find entrance to cave, into cave, bat-encounter, past slow-rotating grinder-cog,
//       dragonmouth sneaks up behind us, we turn to see huge pointy teeth.
//TODO: layered passes of light - so we can still see our path but can illuminate other foreground details we can walk past
//        e.g. we want to get off a ship onto a road but walk past ("through") a lighthouse/harbour tower without being completely in the dark.  beam 1 should continue on the road,  beam 2 gets obscured by layer 2 stuff.
//TODO: consider the number of intersections, sometimes taking all second intersection points along with any first-only intersections, to make a lessened-strength beam.
//TODO: ?add offset some intersections along their wall's normal, for less perfect flat surfaces?
//TODO: paint the abstract "player" in p5.brush, too?
//TODO: draw an impressionist scared face for the player.  just a cheekbone and brow?  (could be illuminated witht the same mechanism, just a higher-detail raycast)
//TODO: consider the dark itself being gloom-painted
//TODO: final scene could be blair witch stand-against-the-wall, with the dropped lamp partially illuminating and cutting out?

//notes:
//* p5.brush not currently working with p5 v2, i think.
//* brush fill and bleed settings seem to ignore push and pop? (with p5 1.11.11, at least).

let palette = {
    lightInFog: "#fcd300",
    background: "#1e1e1e",
    colours: ["#7b4800", "#fcd300", "#ff2702"],
};
/**
 * @typedef {Object} Config
 * @property {number} maxRayLength
 * @property {number} moveSpeed
 * @property {boolean} showDebugWalls,
 * @property {boolean} showDebugBats,
 * @property {boolean} showDebugBrushOutline,
 * @property {boolean} showDebugContactPoints,
 * @property {boolean} showDebugMovTarget,
 * @property {boolean} batsAreAThing
 * @property {number} batBaseSize
 * @property {"spin" | "mouse"} lookMode
 */
/**
 * @type {Config}
 */
let config = {
    maxRayLength: 800,
    moveSpeed: 0.1,
    showDebugBats: false,
    showDebugWalls: false,
    showDebugBrushOutline: false,
    showDebugContactPoints: false,
    showDebugMovTarget: false,
    batBaseSize: 40,
    batsAreAThing: false,
    lookMode: "mouse",
};

/**
 * @type {Bat[]}
 */
let bats;

/**
 * @type {Player}
 */
let player;
/**
 * @type {LineSeg[]}
 */
let gWalls;
let moveTarget;

let strobeWarningAcceptances = 0;
let myFont;

function preload() {
    myFont = loadFont("Barriecito-Regular.ttf");
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    textFont(myFont);
    pixelDensity(1);
    player = createPlayer();
    fixBodyStyling();
    regenerate();
    // frameRate(5);
    setInterval(maybeAddRandomCreatures, 500);
}

function regenerate() {
    gWalls = createWalls();
    bats = [];
}

function draw() {
    background(palette.background);

    if (strobeWarningAcceptances < 2) {
        showStrobeWarning();
        return;
    }
    // drawFillCWPolygonBlob();

    drawPlayer(player);

    if (moveTarget && config.showDebugMovTarget) {
        drawMoveTarget();
    }
    // drawScribble()

    // drawAPicture()
    const rayResults = castRaysFromPlayer();
    // drawRayResults(rayResults);
    const onlyHits = rayResults.filter((rr) => rr.intersectionOrNull);
    const contactPoints = onlyHits.map((rr) => rr.intersectionOrNull);
    contactPoints.push(player.pos.copy());

    // drawRayResults(onlyHits);
    config.showDebugContactPoints && drawDebugContactPoints(contactPoints);

    drawFillCWPointsForLightBeam(contactPoints);
    config.showDebugWalls && drawDebugWalls();

    config.showDebugBats && bats.forEach(drawBatDebug);
    bats.forEach(drawBatWithBrush);
    updatePlayer();
    bats.forEach(updateBat);
    bats = bats.filter((b) => !b.isDead);
}

function maybeAddRandomCreatures() {
    if (random() < 0.2) {
        repeat(4, () => {
            const v = p5.Vector.random2D().mult(30);
            if (config.batsAreAThing)
                bats.push(createBat(0, mouseWorldPos(), 100, v));
        });
    }
}

function drawDebugContactPoints(contactPoints) {
    push();
    strokeWeight(10);
    stroke("lime");

    contactPoints.forEach((pt) => {
        point(pt);
    });
    pop();
}
function drawDebugWalls() {
    push();
    stroke("magenta");
    strokeWeight(5);
    drawLineSegs(gWalls);
    pop();
}
function mouseWorldPos() {
    return createVector(mouseX - width / 2, mouseY - height / 2);
}
function updatePlayer() {
    if (config.lookMode === "spin") {
        player.facing.rotate(TWO_PI / 360);
        player.pos.lerp(mouseWorldPos(), 0.01);
    } else {
        const playerToMouse = p5.Vector.sub(mouseWorldPos(), player.pos);
        player.facing.slerp(playerToMouse, 0.1);
        if (moveTarget) {
            const towardsTarget = p5.Vector.sub(moveTarget, player.pos);
            if (towardsTarget.mag() < 30) {
                moveTarget = undefined;
            } else {
                towardsTarget.setMag(config.moveSpeed * deltaTime);
                player.pos.add(towardsTarget);
            }
        }
    }
}
/**
 *
 * @param {Bat} b
 */
function updateBat(b) {
    b.pos.add(b.vel);
    if (b.pos.dist(player.pos) > 600 || millis() - b.bornMillis > 1000) {
        b.isDead = true;
    }
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
    rotate(player.facing.heading());
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

function allLineSegsForFrame() {
    // const batLineSegs = bats.flatMap(lineSegsForBat);
    // return [...gWalls, ...batLineSegs];
    return gWalls;
}

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
        const allIntersections = allLineSegsForFrame()
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
    if (strobeWarningAcceptances < 2) {
        strobeWarningAcceptances++;
        return;
    }
    moveTarget = mouseWorldPos();
}

function doubleClicked() {
    if (strobeWarningAcceptances < 2) {
        strobeWarningAcceptances++;
        return;
    }

    regenerate();
}

/**
 *
 * @param {p5.Vector[]} pts
 */
function drawFillCWPointsForLightBeam(pts) {
    push();
    config.showDebugBrushOutline || brush.noStroke();
    brush.fill(palette.lightInFog, random(60, 100));
    brush.bleed(random(0.1, 0.2));
    brush.fillTexture(0.55, 0.8);
    brush.beginShape();
    for (let pt of pts) {
        brush.vertex(pt.x, pt.y);
    }
    brush.endShape(CLOSE);
    pop();
}

/**
 * @param {Bat} bat
 */
function drawBatWithBrush(bat) {
    const [ls1, ls2] = lineSegsForBat(bat);
    const pts = [ls1.a, ls1.b, ls2.b];
    push();
    brush.noStroke();
    // brush.stroke();
    brush.fill(palette.background, random(60, 100));
    brush.bleed(random(0.1, 0.1));
    brush.fillTexture(0.55, 0.8);
    brush.beginShape();
    for (let pt of pts) {
        brush.vertex(pt.x, pt.y);
    }
    brush.endShape(CLOSE);
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
    const boundaryWalls = [];
    boundaryWalls.push(
        ...[
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
        ],
    );
    const hw = width / 2;
    const hh = height / 2;

    //a few walls guaranteed to come out of the main walls, so we never get a full empty room
    /**
     * @type {LineSeg[]}
     */
    const possibleLongWalls = [
        {
            a: createVector(hw, hh),
            b: createVector(0, 0),
        },
        {
            a: createVector(0, (1 * height) / 2),
            b: createVector(0.5 * width, 0),
        },
        {
            a: createVector(-0.25 * hw, 0.25 * hh),
            b: createVector(-1 * hw, 0.8 * hh),
        },
        {
            a: createVector(0.7 * hw, -1 * hh),
            b: createVector(0.7 * hw, -0.2 * hh),
        },
    ];
    const selectedLongWalls = shuffle(possibleLongWalls).slice(0, 2);

    const moar = collect(10, createRandomWall);
    return [...boundaryWalls, ...selectedLongWalls, ...moar];
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
    const a = randomVertex();
    const maxLen = 0.7 * min(width, height);
    const minLen = 0.3 * maxLen;
    const toB = p5.Vector.fromAngle(random(TWO_PI), random(minLen, maxLen));
    const b = p5.Vector.add(a, toB);

    return {
        a,
        b,
    };
}

function keyPressed() {
    if (strobeWarningAcceptances < 2) {
        if (key === " ") {
            strobeWarningAcceptances++;
        }
        return;
    }

    if (key === "r") {
        regenerate();
    }
    if (key === "c") {
        config.showDebugContactPoints = !config.showDebugContactPoints;
    }
    if (key === "w") {
        config.showDebugWalls = !config.showDebugWalls;
    }
    if (key === "B") {
        config.showDebugBats = !config.showDebugBats;
    }
    if (key === "b") {
        config.batsAreAThing = !config.batsAreAThing;
    }
    if (key === "p") {
        if (isLooping()) {
            noLoop();
        } else {
            loop();
        }
    }
}

/**
 * @typedef {Object} Bat
 * @property {p5.Vector} pos
 * @property {p5.Vector} vel
 * @property {number} phase
 * @property {number} size
 * @property {boolean} isDead
 * @property {number} bornMillis
 *
 */
/**
 *
 * @param {number} _ix
 * @param {p5.Vector} roughPos
 * @param {number} spawnRadius
 * @param {p5.Vector} roughVel
 * @returns {Bat}
 */
function createBat(_ix, roughPos, spawnRadius, roughVel) {
    return {
        pos: roughPos
            .copy()
            .add(p5.Vector.random2D().mult(random(0, spawnRadius))),
        vel: roughVel.copy().rotate(randomGaussian(0, PI / 8)),
        phase: random(TWO_PI),
        size: randomGaussian(1, 0.1),
        isDead: false,
        bornMillis: millis(),
    };
}

/**
 *
 * @param {Bat} bat
 */
function drawBatDebug(bat) {
    push();
    noFill();
    stroke("magenta");
    circle(bat.pos.x, bat.pos.y, bat.size * config.batBaseSize);
    pop();
}

/**
 *
 * @param {Bat} bat
 */
function drawPolyForBat(bat) {
    push();
    noFill();
    stroke("magenta");
    circle(bat.pos.x, bat.pos.y, bat.size * config.batBaseSize);
    pop();
}
/**
 *
 * @param {Bat} bat
 * @returns {LineSeg[]}
 */

function lineSegsForBat(bat) {
    const ctr = bat.pos;
    const angle = (sin(bat.phase + millis() / 100) * PI) / 6;
    const wingLen = bat.size * config.batBaseSize;
    const [ctrAngle1, ctrAngle2] = [0.1, -0.1].map(
        (frac) => PI / 2 + PI * frac,
    );
    const ptLeft = p5.Vector.fromAngle(ctrAngle1 + angle, wingLen).add(ctr);
    const ptRight = p5.Vector.fromAngle(ctrAngle2 - angle, wingLen).add(ctr);
    return [
        { a: ptLeft, b: ctr },
        { a: ctr, b: ptRight },
    ];
}

function drawMoveTarget() {
    if (!moveTarget) {
        return;
    }
    push();
    translate(moveTarget);
    noFill();
    stroke("white");
    strokeWeight(2);
    circle(0, 0, 40);

    pop();
}

/**
 * Call the given function repeatedly, the given number of times.
 * @param {number} numRepeats number of times to call the given function
 * @param {(ix:number) => void} fn function to call repeatedly.  Will be passed the zero-based count of the current iteration
 * @see {@link collect} - if you want to collect the returned values from the function instead.
 *
 */
function repeat(numRepeats, fn) {
    for (let i = 0; i < numRepeats; i++) {
        fn(i);
    }
}

function showStrobeWarning() {
    push();
    fill(255);
    textSize(50);
    textAlign(CENTER, CENTER);
    const clicksRemaining = 2 - strobeWarningAcceptances;
    text(
        [
            "WARNING: ",
            "Strobing lights",
            "",
            "click to continue",
            clicksRemaining,
        ].join("\n"),
        0,
        0,
    );

    pop();
}

function fixBodyStyling() {
    //not sure why openprocessing is showing scrollbars.
    document.body.style.overflow = "hidden";
}
