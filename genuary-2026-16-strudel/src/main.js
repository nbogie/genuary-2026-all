// p5.disableFriendlyErrors = true;

/**
 * @typedef {Object} World
 * @property {Ship} playerShip
 * @property {Entity} entity
 * @property {any} myInputs
 * @property {number} radius
 * @property {{starfield: p5.Graphics}} graphics
 *
 */

//Keeping this outside the sketch function so it's available globally...
//We won't be running multiple instances of this sketch despite the mode-name.
/** @type {World} */
let gWorld;

new p5(sketch);
/** @param {p5} p */
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
        drawStarfield(gWorld.graphics.starfield);

        p.frameRate(30);
    }

    function draw() {
        p.background(20);

        p.translate(
            -gWorld.playerShip.pos.x + p.width / 2,
            -gWorld.playerShip.pos.y + p.height / 2
        );
        p.image(gWorld.graphics.starfield, 0, 0);

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
            graphics: {
                starfield: p.createGraphics(2 * p.width, 2 * p.height),
            },
            radius: 4000,
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

    function mouseScreenPos() {
        return p.createVector(p.mouseX, p.mouseY);
    }
    function mouseWorldPos() {
        return screenPosToWorldPos(mouseScreenPos());
    }

    function mousePressed() {
        const pos = mouseWorldPos();
        gWorld.playerShip.targetPos = pos.copy();
    }

    /**
     *writes to the given graphics
     * @param {p5.Graphics} g
     */
    function drawStarfield(g) {
        for (let i = 0; i < 1000; i++) {
            const pos = p5.Vector.random2D().mult(p.random(0, gWorld.radius));
            g.stroke("white");
            g.strokeWeight(g.random([1, 1, 1, 2, 3]));
            g.point(pos.x, pos.y);
        }
    }
    /**
     *
     * @param {p5.Vector} screenPos
     */
    function screenPosToWorldPos(screenPos) {
        const centreOffset = p.createVector(-p.width / 2, -p.height / 2);
        //this should be a camera that lerps towards the player, not immediately the player.
        const shipPos = gWorld.playerShip.pos.copy();
        return p5.Vector.add(shipPos, screenPos).add(centreOffset);
    }
}
