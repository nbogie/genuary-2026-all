/* TODO:
 * Add scrolling map - it MUST take time to reach certain zones/objects, so the user can appreciate gradual changes over time, not just everything together within the first 5 seconds of playing.
 * Make creatures that come and go fairly quickly, with associated musical side-effects
 * Make positional audio input VERY obvious, or ppl will just think oh it's music (which anyway changes)
 * Player-depth in a level increases disorder
 * Have an entity that floats around and appears to be the source of sound for a noticable element in the track
 *   as we get nearer, that sound appears and increases in volume, maybe an LFP cutoff increases
 *   TODO: have some other element fade OUT / duck when we're near entity, so it's not just "more"
 * Chop a beat for disorder. figure out how to chop a little vs a lot.
 *
 * Notes;
 * I have to use instance-mode p5, to avoid clashes with strudel's global injections
 * Our p5 code makes the sacrifice because it's more important to keep strudel with
 * global functions for its concise music DSL.
 * 20250727 Fl Studio HQ Funk Kit playing Fpc Ambient Groove 05 at 100bpm (or 104.5?)
 */

// p5.disableFriendlyErrors = true;

/**
 * @typedef {Object} World
 * @property {Ship} playerShip
 * @property {Entity} entity
 * @property {any} myInputs
 *
 */

//Keeping this outside the sketch function so it's available globally...
//We won't be running multiple instances of this sketch despite the mode-name.
/** @type {World} */
let gWorld;

new p5(sketch);

function sketch(p) {
    p.setup = setup;
    p.draw = draw;
    p.mousePressed = mousePressed;
    p.keyPressed = keyPressed;
    p.windowResized = windowResized;

    function setup() {
        p.createCanvas(p.windowWidth, p.windowHeight);
        gWorld = createWorld();
        strudel.initStrudel({
            prebake: () => samples("github:tidalcycles/dirt-samples"),
        });
        p.frameRate(30);
    }

    function draw() {
        p.background(20);
        updatePlayerShip(gWorld.playerShip, p);
        drawPlayerShip(gWorld.playerShip, p);

        updateEntity(gWorld.entity, p);
        drawEntity(gWorld.entity, p);
    }
    /**
     *
     * @returns {World}
     */
    function createWorld() {
        const playerShip = createPlayerShip(p);
        const entity = createEntity(p);
        return {
            playerShip,
            entity,
            myInputs: setupMyInputs(playerShip, entity, p),
        };
    }
    function windowResized() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

    function keyPressed() {
        if (p.key === " ") {
            //simplest example
            s("bd hh sd hh [bd bd] hh sd hh").play();
        }

        if (p.key === ".") {
            strudel.hush();
        }

        if (p.key >= "0" && p.key <= "9") {
            const num = parseInt(p.key) - 1;

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
        gWorld.playerShip.targetPos = p.createVector(p.mouseX, p.mouseY);
    }
}
