/* TODO:
 * Use instance-mode p5, keeping strudel's global injections so that its music DSL stays concise. Too many global fns collide:
 *  rotate, now, clashes - pretty fundamental
 *  scale does suspiciously nothing now!
 * Add scrolling map - it MUST take time to reach certain zones/objects, so the user can appreciate gradual changes over time, not just everything together within the first 5 seconds of playing.
 * Make positional audio input VERY obvious, or ppl will just think oh it's music (which anyway changes)
 * Player-depth in a level increases disorder
 * Have an entity that floats around and appears to be the source of sound for a noticable element in the track
 *   as we get nearer, that sound appears and increases in volume, maybe an LFP cutoff increases
 *   TODO: have some other element fade OUT / duck when we're near entity, so it's not just "more"
 * Chop a beat for disorder. figure out how to chop a little vs a lot.
 */
// p5.disableFriendlyErrors = true;

let myInputs;

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

//@ts-ignore
new p5(sketch);

function sketch(p) {
    p.setup = setup;
    p.draw = draw;
    p.mousePressed = mousePressed;
    p.keyPressed = keyPressed;
    p.windowResized = windowResized;

    function setup() {
        p.createCanvas(p.windowWidth, p.windowHeight);
        playerShip = createPlayerShip(p);
        entity = createEntity(p);
        myInputs = setupMyInputs(playerShip, entity, p);
        myStrudel.initStrudel({
            //@ts-ignore
            prebake: () => samples("github:tidalcycles/dirt-samples"),
        });
        p.frameRate(30);
    }

    function draw() {
        p.background(20);
        updatePlayerShip(playerShip, p);
        drawPlayerShip(playerShip, p);

        updateEntity(entity, p);
        drawEntity(entity, p);
    }

    function windowResized() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

    function keyPressed() {
        if (p.key === " ") {
            //simplest example
            //@ts-ignore
            s("bd hh sd hh [bd bd] hh sd hh").play();
        }

        if (p.key === ".") {
            //@ts-ignore
            myStrudel.hush();
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
        playerShip.targetPos = p.createVector(p.mouseX, p.mouseY);
    }
}
