import { BoxGeometry, Color, MeshStandardMaterial, Scene } from "three";
import { ADDITION, Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";
import { randFloat, randInt } from "three/src/math/MathUtils.js";
import { buildGridBrush } from "./buildGridBrush.ts";
import { createPalette, type Palette } from "./palette.ts";
import { setupCamera } from "./setupCamera";
import { setupHelpers } from "./setupHelpers";
import { setupLights } from "./setupLights.ts";
import { setupOrbitControls } from "./setupOrbitControls";
import { setupRenderer } from "./setupRenderer";
import type { CSGConfig } from "./types.ts";
import { pickRandom, rDim } from "./utils.ts";

//TODO: check how to dispose fully of meshes and materials (and CSG, if special)
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
        shouldIncludeGrids: false,
    };

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const orbitControls = setupOrbitControls(camera, renderer.domElement);

    setupLights(scene);

    if (config.shouldShowHelper) {
        setupHelpers(scene);
    }

    let finishedBrushes = createAllStructures();
    animate();
    setInterval(() => config.shouldAutoRegenerate && regenerateBrushes(), 4000);

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
        if (event.code === "KeyD") {
            config.shouldIncludeGrids = !config.shouldIncludeGrids;
            regenerateBrushes();
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
        finishedBrushes = createAllStructures();
        finishedBrushes.forEach((b) => (b.rotation.y = oldAngle));
    }

    function createAllStructures(): Brush[] {
        const palette = createPalette();
        const brushes: Brush[] = [];
        const numStructures = 7;
        const spacingPerBrush = 15;

        const csgConfigSimplest: CSGConfig = {
            genOffset: () => ({
                x: 0,
                z: 0,
                y: randFloat(-10, 10),
            }),
            genOperation: () => pickRandom([SUBTRACTION]),
            genNumberOfElements: () => randInt(9, 11),
        };
        const csgConfigAsym: CSGConfig = {
            genOffset: () => ({
                x: randFloat(-2, 2),
                z: randFloat(-1, 1),
                y: randFloat(-10, 10),
            }),
            genOperation: () =>
                pickRandom([SUBTRACTION, SUBTRACTION, ADDITION]),
            genNumberOfElements: () => randInt(8, 12),
        };
        const csgConfig = pickRandom([
            csgConfigAsym,
            csgConfigAsym,
            csgConfigSimplest,
        ]);

        for (let i = 0; i < numStructures; i++) {
            const csgBrush = createOneStructureFromCSGBrushes(
                palette,
                csgConfig
            );
            csgBrush.position.x = (i - numStructures / 2) * spacingPerBrush;
            csgBrush.position.y = 10;
            scene.add(csgBrush);
            brushes.push(csgBrush);
        }
        return brushes;
    }

    function createOneStructureFromCSGBrushes(
        palette: Palette,
        csgConfig: CSGConfig
    ): Brush {
        const brushStarting = new Brush(new BoxGeometry(12, 25, 5));
        const material = new MeshStandardMaterial({
            color: new Color(pickRandom(palette.colors)),
        });
        brushStarting.material = material;
        brushStarting.updateMatrixWorld();

        const numElements = csgConfig.genNumberOfElements();
        const evaluator = new Evaluator();
        let ongoingResult = brushStarting;
        for (let i = 1; i < numElements; i++) {
            const myMaterial = new MeshStandardMaterial({
                color: new Color(pickRandom(palette.colors)),
            });
            const operation = csgConfig.genOperation();
            const isGrid = config.shouldIncludeGrids
                ? Math.random() < 0.1
                : false;

            if (!isGrid) {
                const totalWidth = rDim();
                const totalHeight = rDim();
                const totalDepth = rDim();

                const brush = new Brush(
                    new BoxGeometry(totalWidth, totalHeight, totalDepth),
                    myMaterial
                );
                const offset = csgConfig.genOffset();
                brush.position.y = offset.y;
                brush.position.z = offset.z;
                brush.position.x = offset.x;
                brush.updateMatrixWorld();
                ongoingResult = evaluator.evaluate(
                    ongoingResult,
                    brush,
                    operation
                );
            } else {
                const gridBrush = buildGridBrush(csgConfig, evaluator, palette);
                // then combine the intermediate brush to the ongoing result according to the already-chosen operation
                ongoingResult = evaluator.evaluate(
                    ongoingResult,
                    gridBrush,
                    ADDITION
                );
            }
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
