/**TODO:
 * switch to ESM, or at least use instance-mode p5. Too many global fns collide:
 *  rotate, now, clashes - pretty fundamental
 *  scale does suspiciously nothing
 * Add scrolling map - it MUST take time to reach certain zones/objects, so the user can appreciate gradual changes over time, not just everything together within the first 5 seconds of playing.
 * Make positional audio input VERY obvious, or ppl will just think oh it's music (which anyway changes)
 * Player-depth in a level increases disorder
 * Have an entity that floats around and appears to be the source of sound for a noticable element in the track
 *   as we get nearer, that sound appears and increases in volume, maybe an LFP cutoff increases
 *   TODO: have some other element fade OUT / duck when we're near entity, so it's not just "more"
 * Chop a beat for disorder. figure out how to chop a little vs a lot.
 */
p5.disableFriendlyErrors = true;

let myInputs;

/** @type {any} */
//@ts-ignore
let myStrudel = window.strudel;

/**
 * @type Ship
 */
let playerShip;

/**
 * @type Entity
 */
let entity;

function setup() {
    createCanvas(windowWidth, windowHeight);
    playerShip = createPlayerShip();
    entity = createEntity();
    setupMyInputs();
    myStrudel.initStrudel({
        //@ts-ignore
        prebake: () => samples("github:tidalcycles/dirt-samples"),
    });
    frameRate(30);
}

function draw() {
    background(20);
    updatePlayerShip(playerShip);
    drawPlayerShip(playerShip);

    updateEntity(entity);
    drawEntity(entity);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
    if (key === " ") {
        //simplest example
        //@ts-ignore
        s("bd hh sd hh [bd bd] hh sd hh").play();
    }

    if (key === ".") {
        //@ts-ignore
        myStrudel.hush();
    }

    if (key >= "0" && key <= "9") {
        const num = parseInt(key) - 1;

        const pattn = myPatterns[num];
        if (!pattn) {
            console.log(
                "no pattern in slot: " + num + " so ignoring keypress."
            );
            return;
        }

        console.log("evaluating strudel code #" + num + ": " + pattn.title);
        pattn.fn();
    }
}

function mousePressed() {
    playerShip.targetPos = createVector(mouseX, mouseY);
}
