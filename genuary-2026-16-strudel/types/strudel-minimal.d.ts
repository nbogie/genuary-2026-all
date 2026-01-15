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

interface Signal {
    slow: SignalFn;
    fast: SignalFn;
    range: SignalFn;
}

interface Fluent {
    clip: FluentFn;
    cpm: FluentFn;
    cutoff: FluentFn;
    delay: FluentFn;
    fast: FluentFn;
    gain: FluentFn;
    lpf: FluentFn;
    lpq: FluentFn;
    slow: FluentFn;
    note: FluentFn;
    play: () => void;
    room: FluentFn;
    s: FluentFn;
    sound: FluentFn;
    sz: FluentFn;
}

//if this becomes a module rather than a script, we'd need:
// declare global {
//   var strudel: any;
//   //...
// }
// export {};
