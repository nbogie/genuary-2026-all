//@ts-nocheck
const myPatterns = [
    {
        title: [
            "using custom inputs",
            "mouse x is drum lpf freq",
            "wanderer x is lpf freq for synth",
            "wanderer y is gain for drums",
        ].join("\n"),
        fn: () =>
            stack(
                n("[0 0*2, 2] [1 - - <1*6 1>] [4 2] 3*6")
                    .sound("jazz")
                    // .lpf(myInputs.mouseX.range(100, 4000))
                    .lpq(10)
                    .gain(myInputs.shipY.range(0, 0.7))
                    .delay(1),
                stack(
                    note(
                        "<~ <[d4 a3 d3] [d e] [a g]> f g <[c4 d4] a a> d e f g a <c4 b [c4 d4]> <g c> a g f e>*16"
                    ),
                    note("<d2 a2 c2 f2>*1.75")
                )
                    .cutoff(myInputs.shipX.range(0, 4000))
                    .gain(0.35)
                    .s("supersaw")
                    .delay(0.1)
            )
                .cpm(120 / 4)
                .room(3)
                .sz(0.4)
                .play(),
    },

    {
        title: ["chopping a beat"].join("\n"),
        fn: () =>
            stack(
                n("[0 0*2, 2] [1 - - <1*6 1>] [4 2] 3*6")
                    .sound("jazz")
                    .lpf(myInputs.mouseX.range(100, 4000))
                    .lpq(10)
                    .delay(1)
            )
                .cpm(120 / 4)
                .room(3)
                .sz(0.4)
                .play(),
    },
];
