import {
    BoxGeometry,
    Color,
    MathUtils,
    MeshStandardMaterial,
    Scene,
} from "three";

import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";
import { setupCamera } from "./setupCamera";
import { setupHelpers } from "./setupHelpers";
import { setupLights } from "./setupLights.ts";
import { setupOrbitControls } from "./setupOrbitControls";
import { setupRenderer } from "./setupRenderer";
import { randFloat } from "three/src/math/MathUtils.js";

type Palette = ReturnType<typeof createPalette>;

/**
 * Build a three.js scene and start it animating.
 * (This function can be named whatever you like.)
 */
export function setupAndAnimateMyThreeJSScene(): void {
    const scene = new Scene();
    const credits = { palette: "KGolid from chromotome" };
    if (1 + 1 > 10) {
        console.log({ credits });
    }

    const config = { shouldShowHelper: false };

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const orbitControls = setupOrbitControls(camera, renderer.domElement);

    setupLights(scene);

    if (config.shouldShowHelper) {
        setupHelpers(scene);
    }

    let finishedBrushes = createAllBrushes();
    animate();

    setInterval(regenerateBrushes, 8000);

    window.addEventListener("keydown", (event) => {
        if (event.code === "KeyV") {
            const b = pickRandom(finishedBrushes);
            b.visible = !b.visible;
        }
        if (event.code === "KeyR" || event.code === "Space") {
            regenerateBrushes();
        }
    });

    function regenerateBrushes() {
        finishedBrushes.forEach((b) => scene.remove(b));
        finishedBrushes.length = 0;
        finishedBrushes = createAllBrushes();
    }
    function createAllBrushes(): Brush[] {
        const palette = createPalette();

        const brushes: Brush[] = [];
        for (let i = 0; i < 7; i++) {
            const csgBrush = createCSGMeshes(palette);
            csgBrush.position.x = (i - 3) * 15;
            csgBrush.position.y = 10;
            scene.add(csgBrush);
            brushes.push(csgBrush);
        }
        return brushes;
    }

    function createCSGMeshes(palette: Palette): Brush {
        const brush1 = new Brush(new BoxGeometry(12, 25, 5));
        const material = new MeshStandardMaterial({
            color: new Color(pickRandom(palette.colors)),
        });
        brush1.material = material;
        brush1.updateMatrixWorld();

        const evaluator = new Evaluator();
        let ongoingResult = brush1;
        for (let i = 0; i < 8; i++) {
            const material2 = new MeshStandardMaterial({
                color: new Color(pickRandom(palette.colors)),
            });
            const brush2 = new Brush(
                new BoxGeometry(rDim(), rDim(), rDim()),
                material2
            );
            brush2.position.y = randFloat(-10, 10);
            brush2.updateMatrixWorld();
            ongoingResult = evaluator.evaluate(
                ongoingResult,
                brush2,
                SUBTRACTION
            );
        }

        return ongoingResult;
    }

    /**
     * This will update some objects in the scene,
     * render one frame to the canvas,
     * and queue itself to be called again very soon.
     * You can name this function whatever you like.
     */
    function animate() {
        //rotation should be a function of elapsed time, to properly sync with orbitcam
        //regeneration interval would be more accurate if it was run from here in animate()
        finishedBrushes.forEach((b) => (b.rotation.y += Math.PI / (8 * 60)));

        // csgBrush.rotation.x += 0.02;

        //Draw the current scene to the canvas - one frame of animation.
        renderer.render(scene, camera);

        // required if controls.enableDamping or controls.autoRotate are set to true
        orbitControls.update();

        //Queue for this function to be called again when the browser is ready for another animation frame.
        requestAnimationFrame(animate);
    }
}

setupAndAnimateMyThreeJSScene();

function rDim(): number {
    return MathUtils.randFloat(1, 10);
}

function createPalette() {
    //credit: kgolid
    return pickRandom([
        {
            name: "tsu_akasaka",
            colors: [
                "#687f72",
                "#cc7d6c",
                "#dec36f",
                "#dec7af",
                "#ad8470",
                "#424637",
            ],
            stroke: "#251c12",
            background: "#cfc7b9",
            size: 6,
            type: "chromotome",
        },
        {
            name: "present-correct",
            colors: [
                "#fd3741",
                "#fe4f11",
                "#ff6800",
                "#ffa61a",
                "#ffc219",
                "#ffd114",
                "#fcd82e",
                "#f4d730",
                "#ced562",
                "#8ac38f",
                "#79b7a0",
                "#72b5b1",
                "#5b9bae",
                "#6ba1b7",
                "#49619d",
                "#604791",
                "#721e7f",
                "#9b2b77",
                "#ab2562",
                "#ca2847",
            ],
            size: 20,
            type: "chromotome",
        },
        {
            name: "tsu_arcade",
            colors: [
                "#4aad8b",
                "#e15147",
                "#f3b551",
                "#cec8b8",
                "#d1af84",
                "#544e47",
            ],
            stroke: "#251c12",
            background: "#cfc7b9",
            size: 6,
            type: "chromotome",
        },
        {
            name: "mably",
            colors: [
                "#13477b",
                "#2f1b10",
                "#d18529",
                "#d72a25",
                "#e42184",
                "#138898",
                "#9d2787",
                "#7f311b",
            ],
            stroke: "#2a1f1d",
            background: "#dfc792",
            size: 8,
            type: "chromotome",
        },
        {
            name: "giftcard_sub",
            colors: [
                "#FBF5E9",
                "#FF514E",
                "#FDBC2E",
                "#4561CC",
                "#2A303E",
                "#6CC283",
                "#238DA5",
                "#9BD7CB",
            ],
            stroke: "#000",
            background: "#FBF5E9",
            size: 8,
            type: "chromotome",
        },
        {
            name: "five-stars",
            colors: [
                "#f5e8c7",
                "#d9dcad",
                "#cf3933",
                "#f3f4f4",
                "#74330d",
                "#8bb896",
                "#eba824",
                "#f05c03",
            ],
            stroke: "#380c05",
            background: "#ecd598",
            size: 8,
            type: "chromotome",
        },
    ]);
}

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
