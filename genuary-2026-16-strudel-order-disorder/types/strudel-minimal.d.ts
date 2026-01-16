//@ts-check

//just for autocomplete
//I don't fill in arg details so as not to fool myself
interface FakeStrudel {
  initStrudel: any;
  hush: any;
  pure: any;
}

declare var strudel: FakeStrudel;

type FluentFn = (...args: any[]) => Fluent;

declare var samples: any;

declare var n: FluentFn;
declare var note: FluentFn;
declare var s: FluentFn;
declare var stack: FluentFn;
declare var ply: FluentFn;
declare var speed: FluentFn;
declare var mul: FluentFn;

declare var brandBy: FluentFn;
declare var irand: FluentFn;

declare var brand: Fluent;
declare var cosine: Fluent;
declare var mouseX: Fluent;
declare var mouseY: Fluent;
declare var perlin: Fluent;
declare var rand: Fluent;
declare var saw: Fluent;
declare var sine: Fluent;
declare var square: Fluent;
declare var tri: Fluent;

interface Fluent {
  chop: FluentFn;
  clip: FluentFn;
  cpm: FluentFn;
  cut: FluentFn;
  cutoff: FluentFn;
  delay: FluentFn;
  fast: FluentFn;
  fit: FluentFn;
  gain: FluentFn;
  lpf: FluentFn;
  lpq: FluentFn;
  note: FluentFn;
  play: () => void;
  rarely: FluentFn;
  room: FluentFn;
  s: FluentFn;
  slice: FluentFn;
  slow: FluentFn;
  sound: FluentFn;
  sz: FluentFn;
  sometimesBy: FluentFn;
  range: FluentFn;
  ply: FluentFn;
  gain: FluentFn;
  transpose: FluentFn;
}

//if this becomes a module rather than a script, we'd need:
// declare global {
//   var strudel: any;
//   //...
// }
// export {};
