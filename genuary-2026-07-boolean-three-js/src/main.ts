import {
    BoxGeometry,
    Color,
    MathUtils,
    MeshStandardMaterial,
    Scene,
} from "three";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";
import { randFloat } from "three/src/math/MathUtils.js";
import { setupCamera } from "./setupCamera";
import { setupHelpers } from "./setupHelpers";
import { setupLights } from "./setupLights.ts";
import { setupOrbitControls } from "./setupOrbitControls";
import { setupRenderer } from "./setupRenderer";

type Palette = ReturnType<typeof createPalette>;

export function setupAndAnimateMyThreeJSScene(): void {
    const scene = new Scene();
    const meta = {
        typeScriptSource:
            "https://github.com/nbogie/genuary-2026-all/tree/main/genuary-2026-07-boolean-three-js",
        credits: "Palettes from KGolid from chromotome",
        references:
            "three-bvh-csg example: https://threejs.org/examples/webgl_geometry_csg.html",
    };
    if (Math.random() > 10) {
        console.log({ meta });
    }

    const config = {
        shouldShowHelper: false,
        shouldRotateIndividuals: true,
        shouldAutoRegenerate: true,
        shouldAutoRotate: true,
    };

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
    if (config.shouldAutoRegenerate) {
        setInterval(
            () => config.shouldAutoRegenerate && regenerateBrushes(),
            4000
        );
    }
    orbitControls.autoRotate = config.shouldAutoRotate;

    window.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            regenerateBrushes();
        }

        if (event.code === "KeyC") {
            orbitControls.autoRotate = !orbitControls.autoRotate;
        }

        if (event.code === "KeyG") {
            config.shouldAutoRegenerate = !config.shouldAutoRegenerate;
        }

        if (event.code === "KeyI") {
            config.shouldRotateIndividuals = !config.shouldRotateIndividuals;
        }

        if (event.code === "KeyS") {
            saveScreenshot();
        }
    });

    function saveScreenshot() {
        const filename = "genuary-2026-07-booleans.png";
        const link = document.createElement("a");
        link.download = filename;
        link.href = renderer.domElement.toDataURL("image/png");
        link.click();
    }

    function regenerateBrushes() {
        const oldAngle = finishedBrushes[0].rotation.y;
        finishedBrushes.forEach((b) => scene.remove(b));
        finishedBrushes.length = 0;
        finishedBrushes = createAllBrushes();
        finishedBrushes.forEach((b) => (b.rotation.y = oldAngle));
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
        if (config.shouldRotateIndividuals) {
            finishedBrushes.forEach(
                (b) => (b.rotation.y += Math.PI / (8 * 60))
            );
        }

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
