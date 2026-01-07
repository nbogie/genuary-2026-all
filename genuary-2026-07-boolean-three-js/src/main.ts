import {
    SphereGeometry,
    BoxGeometry,
    Color,
    Mesh,
    MeshStandardMaterial,
    Scene,
} from "three";
import { setupCamera } from "./setupCamera";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";
import { setupHelpers } from "./setupHelpers";
import { setupLights } from "./setupLights.ts";
import { setupOrbitControls } from "./setupOrbitControls";
import { setupRenderer } from "./setupRenderer";

/**
 * Build a three.js scene and start it animating.
 * (This function can be named whatever you like.)
 */
export function setupAndAnimateMyThreeJSScene(): void {
    const scene = new Scene();

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const orbitControls = setupOrbitControls(camera, renderer.domElement);

    setupLights(scene);

    setupHelpers(scene);

    const csgBrush = createCSGMeshes();
    csgBrush.position.y = 10;
    scene.add(csgBrush);
    animate();

    /**
     * This will update some objects in the scene,
     * render one frame to the canvas,
     * and queue itself to be called again very soon.
     * You can name this function whatever you like.
     */
    function animate() {
        csgBrush.rotation.y += 0.01;
        csgBrush.rotation.x += 0.02;

        //Draw the current scene to the canvas - one frame of animation.
        renderer.render(scene, camera);

        // required if controls.enableDamping or controls.autoRotate are set to true
        orbitControls.update();

        //Queue for this function to be called again when the browser is ready for another animation frame.
        requestAnimationFrame(animate);
    }
}

setupAndAnimateMyThreeJSScene();

function createCSGMeshes(): Brush {
    const brush1 = new Brush(new SphereGeometry(5));
    const material = new MeshStandardMaterial({ color: new Color("yellow") });
    brush1.material = material;
    brush1.updateMatrixWorld();

    const evaluator = new Evaluator();
    let ongoingResult = brush1;
    for (let i = 0; i < 8; i++) {
        const material2 = new MeshStandardMaterial({
            color: new Color("magenta"),
        });
        const brush2 = new Brush(
            new BoxGeometry(rDim(), rDim(), rDim()),
            material2
        );
        brush2.position.y = 4;
        brush2.updateMatrixWorld();
        ongoingResult = evaluator.evaluate(ongoingResult, brush2, SUBTRACTION);
    }

    return ongoingResult;
}

function rDim(): number {
    return Math.random() * 10;
}
