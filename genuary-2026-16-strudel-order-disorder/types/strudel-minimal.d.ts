//just for autocomplete
//I don't fill in arg details so as not to fool myself
interface FakeStrudel {
  initStrudel: any;
  hush: any;
  pure: any;
}

declare var strudel: FakeStrudel;

type FluentFn = (...args: any[]) => Fluent;
type SignalFn = (...args: any[]) => Signal;

declare var n: FluentFn;
declare var note: FluentFn;
declare var s: FluentFn;
declare var stack: FluentFn;
declare var saw: any;
declare var samples: any;
declare var perlin: SignalFn;
declare var ply: FluentFn;
declare var mouseY: FlentFn;
declare var mouseX: FlentFn;
declare var speed: FlentFn;
declare var mul: FlentFn;

interface Signal {
  slow: SignalFn;
  fast: SignalFn;
  range: SignalFn;
}

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
  sometimesBy: FlentFn;
  range: FlentFn;
  ply: FlentFn;
  gain: FlentFn;
  transpose: FlentFn;
}

//if this becomes a module rather than a script, we'd need:
// declare global {
//   var strudel: any;
//   //...
// }
// export {};
