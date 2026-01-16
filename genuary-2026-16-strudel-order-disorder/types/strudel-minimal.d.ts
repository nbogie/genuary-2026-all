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
  begin;
  chop: FluentFn;
  clip: FluentFn;
  cpm: FluentFn;
  cut: FluentFn;
  cutoff: FluentFn;
  delay: FluentFn;
  end: FluentFn;
  fast: FluentFn;
  fit: FluentFn;
  gain: FluentFn;
  loop: FluentFn;
  loopAt: FluentFn;
  loopBegin: FluentFn;
  loopEnd: FluentFn;
  lpf: FluentFn;
  lpq: FluentFn;
  note: FluentFn;
  play: () => void;
  ply: FluentFn;
  range: FluentFn;
  rarely: FluentFn;
  room: FluentFn;
  s: FluentFn;
  scrub: FluentFn;
  slice: FluentFn;
  slow: FluentFn;
  sometimesBy: FluentFn;
  sound: FluentFn;
  speed: FluentFn;
  splice: FluentFn;
  striate: FluentFn;
  sz: FluentFn;
  transpose: FluentFn;
}

//if this becomes a module rather than a script, we'd need:
// declare global {
//   var strudel: any;
//   //...
// }
// export {};
