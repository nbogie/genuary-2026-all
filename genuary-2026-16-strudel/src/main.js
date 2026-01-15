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
