/**TODO:
 * Make positional audio input VERY obvious, or ppl will just think oh it's music (which anyway changes)
 * Player-depth in a level increases disorder
 * Have an entity that floats around and appears to be the source of sound for a noticable element in the track
 *   as we get nearer, that sound appears and increases in volume, maybe an LFP cutoff increases
 * Chop a beat for disorder. figure out how to chop a little vs a lot.
 */
p5.disableFriendlyErrors = true;

let myInputs;

/** @type {any} */
//@ts-ignore
let myStrudel = window.strudel;

function setup() {
    createCanvas(windowWidth, windowHeight);
    playerShip = createPlayerShip();
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

function setupMyInputs() {
    //strudel already provides "mousex", but that is for the window not the canvas. we have more control here.

    if (!playerShip) {
        throw new Error("setup playerShip before inputs, please");
    }

    const shipX = myStrudel.pure("unused").withValue((val) => {
        return map(playerShip.pos.x, 0, width, 0, 1, true);
    });

    const shipY = myStrudel.pure("unused").withValue((val) => {
        //note, inverted
        return map(playerShip.pos.y, 0, height, 1, 0, true);
    });

    //@ts-ignore
    const mouseXInput = myStrudel.pure("unused").withValue((val) => {
        return map(mouseX, 0, width, 0, 1, true);
    });

    myInputs = {
        shipX,
        shipY,
        mouseX: mouseXInput,
    };
}

function mousePressed() {
    playerShip.targetPos = createVector(mouseX, mouseY);
}
