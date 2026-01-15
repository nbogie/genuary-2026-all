//just for autocomplete
//I don't fill in arg details so as not to fool myself
interface FakeStrudel {
    initStrudel: any;
    hush: any;
    pure: any;
}
declare var strudel: FakeStrudel;

declare var n: any;
declare var note: any;
declare var s: any;
declare var samples: any;
declare var stack: any;

//if this becomes a module rather than a script, we'd need:
// declare global {
//   var strudel: any;
//   //...
// }
// export {};
