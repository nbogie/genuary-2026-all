//online at https://openprocessing.org/sketch/2849855

//notes:
//brush fill and bleed settings seem to ignore push and pop (with p5 1.11.11, at least).

let palette = ["#7b4800", "#fcd300", "#ff2702"]; //"#002185", "#003c32","#6b9404"

function setup() {
    createCanvas(1400, 700, WEBGL);
    pixelDensity(1);
    angleMode(DEGREES);
    // drawScribble()
    drawFillAsteroid();
    // drawAPicture()
}

function mousePressed() {
    background("#fffceb");

    drawFillAsteroid();
}

function drawFillAsteroid() {
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
