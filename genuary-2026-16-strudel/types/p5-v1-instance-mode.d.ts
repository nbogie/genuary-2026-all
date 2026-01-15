// Limitations: vscode will auto-acquire these type definitions from @types/p5
// (i.e. the DefinitelyTyped repo) but those are not all up to date.

//The following are needed for p5 instance-mode and/or for referring to the
//types (e.g. in jsdoc comments)
import module from "p5";
export = module;
export as namespace p5;
