p5.disableFriendlyErrors = true;

let myInputs;

function setup() {
    createCanvas(windowWidth, windowHeight);
    setupMyInputs();
    //@ts-ignore
    strudel.initStrudel({
        //@ts-ignore
        prebake: () => samples("github:tidalcycles/dirt-samples"),
    });
    frameRate(30);
}

function draw() {
    background(20);
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
        strudel.hush();
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

    //@ts-ignore
    const mouseXInput = strudel.pure("unused").withValue((val) => {
        return map(mouseX, 0, width, 0, 1, true);
    });

    myInputs = {
        mouseX: mouseXInput,
    };
}
