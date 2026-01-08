//@ts-check

//reading:
//configuring vite: https://vite.dev/config/
//build options: https://vite.dev/config/build-options
//building for production: https://vite.dev/guide/build
import { defineConfig } from "vite";
export default defineConfig((_opts) => {
    /** @type {import('vite').UserConfig} */
    const config = {
        base: "./",

        resolve: {
            alias: {
                orbitControls:
                    "https://unpkg.com/three@0.182.0/examples/jsm/controls/OrbitControls.js",
            },
        },
    };
    return config;
});
