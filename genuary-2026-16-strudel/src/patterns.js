function createPatterns() {
    return [
        {
            title: ["drums, syn ostinato, pedal"].join("\n"),
            fn: () =>
                stack(
                    n("[0 0*2, 2] [1 - - <1*6 1>] [4 2] 3*6")
                        .sound("jazz")
                        // .lpf(gWorld.myInputs.mouseX.range(100, 4000))
                        .lpq(10)
                        //louder with shipY.  this should be a proximity to a zone, perhaps
                        .gain(gWorld.myInputs.shipY.range(0, 0.7))
                        //amount (not tempo) of delay (1 is lots)
                        .delay(1),
                    //Synth AND SLOW BASS NOTES
                    stack(
                        note(
                            "<~ <[d4 a3 d3] [d e] [a g]> f g <[c4 d4] a a> d e f g a <c4 b [c4 d4]> <g c> a g f e>*16"
                        ),
                        note("<d2 a2 c2 f2>*1.75")
                    )
                        .cutoff(gWorld.myInputs.shipX.range(0, 2000))
                        .gain(0.35)
                        .s("supersaw")
                        .delay(0.1),
                    //High synth extensions when near entity
                    note("<f4 g4 c6 e4 g6 [e5 e6]>*16")
                        .cutoff(gWorld.myInputs.shipX.range(0, 2000))
                        .gain(0.35)
                        .s("supersaw")
                        .gain(gWorld.myInputs.entityCloseness.range(0, 0.7))
                        .delay(0.01)
                )
                    .cpm(120 / 4)
                    .room(3)
                    .sz(0.4)
                    .play(),
        },

        {
            title: ["beat and entity only"].join("\n"),
            fn: () =>
                stack(
                    n("[0 0*2, 2] [1 - - <1*6 1>] [4 2] 3*6")
                        .sound("jazz")
                        .lpf(gWorld.myInputs.mouseX.range(100, 4000))
                        //duck the drums as the entity comes closer
                        .gain(gWorld.myInputs.entityCloseness.range(1, 0))
                        .lpq(10)
                        .delay(1),
                    //High synth extensions when near entity
                    note("<f4 g4 c6 e4 g6 [e5 e6]>*16")
                        .cutoff(gWorld.myInputs.shipX.range(0, 2000))
                        .gain(0.35)
                        .s("supersaw")
                        .gain(gWorld.myInputs.entityCloseness.range(0, 0.7))
                        .delay(0.3)
                )
                    .cpm(120 / 4)
                    .room(3)
                    .sz(0.4)
                    .play(),
        },
        {
            title: ["alien trickles (and bass?)"].join("\n"),
            fn: () =>
                stack(
                    n("[- -, -] [- - - <1*6 - - - >] [- -] 3*6")
                        .sound("jazz")
                        .lpf(gWorld.myInputs.entityCloseness.range(100, 4000))
                        //duck the drums as the entity comes closer
                        .lpq(10)
                        .delay(1),
                    note("<d1 a1 c1 f1>*1.75")
                        .cutoff(gWorld.myInputs.shipX.range(0, 2000))
                        .gain(0.8)
                        .s("supersaw")
                        .delay(0.1)
                )
                    .cpm(120 / 4)
                    .room(3)
                    .sz(0.4)
                    .play(),
        },

        {
            title: ["bass rezzes with fwd progress"].join("\n"),
            fn: () =>
                stack(
                    note("<d1 a1 c1 f1>*1.75")
                        .cutoff(gWorld.myInputs.shipX.range(0, 2000))
                        .gain(0.8)
                        .s("supersaw")
                        .delay(0.1)
                )
                    .cpm(120 / 4)
                    .room(3)
                    .sz(0.4)
                    .play(),
        },
    ];
}
