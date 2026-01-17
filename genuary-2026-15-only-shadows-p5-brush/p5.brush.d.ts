type StubFn = (...args: any[]) => void;
interface BrushStub {
    fill: StubFn;
    beginShape: StubFn;
    bleed: StubFn;
    endShape: StubFn;
    field: StubFn;
    fillTexture: StubFn;
    hatch: StubFn;
    noFill: StubFn;
    noHatch: StubFn;
    noStroke: StubFn;
    rect: StubFn;
    set: StubFn;
    setHatch: StubFn;
    vertex: StubFn;
}
var brush: BrushStub;
