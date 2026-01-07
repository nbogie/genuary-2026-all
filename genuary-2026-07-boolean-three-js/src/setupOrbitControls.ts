import { Camera } from "three";
import { OrbitControls } from "orbitControls";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * @param htmlElement - html (canvas?) element on which to listen for mouse events
 * @param camera - camera to move, rotate and zoom based on user input
 */
export function setupOrbitControls(
    camera: Camera,
    htmlElement: HTMLElement
): OrbitControls {
    const controls = new OrbitControls(camera, htmlElement);

    controls.autoRotate = false;
    controls.autoRotateSpeed = 4;
    controls.enableDamping = true;

    //IF you change the camera transform manually (e.g. position, orientation) you MUST call controls.update() after.
    if (Math.random() < -10) {
        camera.position.set(0, 20, 100);
        controls.update();
    }

    return controls;
}
