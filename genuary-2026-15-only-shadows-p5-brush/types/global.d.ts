//source: Gareth Williams: https://github.com/Gaweph/p5-typescript-starter/blob/master/global.d.ts
//Add intellisense for global mode...
import * as p5Global from "p5/global";

//This is needed even in global mode,
// in order to reference p5.Vector, etc,
// and to talk about p5 namespaced types in jsdoc
import module = require("p5");
export = module;
export as namespace p5;
