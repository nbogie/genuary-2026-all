import { getWorld, type World } from "./main.ts";

export function createPatterns() {
  const world: World = getWorld();

  return [
    {
      title: ["drums, syn ostinato, pedal"].join("\n"),
      fn: () =>
        stack(
          n("[0 0*2, 2] [1 - - <1*6 1>] [4 2] 3*6")
            .sound("jazz")
            // .lpf(world.myInputs.mouseX.range(100, 4000))
            .lpq(10)
            //louder with shipY.  this should be a proximity to a zone, perhaps
            .gain(world.myInputs.shipY.range(0, 0.7))
            //amount (not tempo) of delay (1 is lots)
            .delay(1),
          //Synth AND SLOW BASS NOTES
          stack(
            note(
              "<~ <[d4 a3 d3] [d e] [a g]> f g <[c4 d4] a a> d e f g a <c4 b [c4 d4]> <g c> a g f e>*16"
            ),
            note("<d2 a2 c2 f2>*1.75")
          )
            .cutoff(world.myInputs.shipX.range(0, 2000))
            .gain(0.35)
            .s("supersaw")
            .delay(0.1),
          //High synth extensions when near entity
          note("<f4 g4 c6 e4 g6 [e5 e6]>*16")
            .cutoff(world.myInputs.shipX.range(0, 2000))
            .gain(0.35)
            .s("supersaw")
            .gain(world.myInputs.entityOrderCloseness.range(0, 0.7))
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
            .lpf(world.myInputs.mouseX.range(100, 4000))
            //duck the drums as the entity comes closer
            .gain(world.myInputs.entityOrderCloseness.range(1, 0))
            .lpq(10)
            .delay(1),
          //High synth extensions when near entity
          note("<f4 g4 c6 e4 g6 [e5 e6]>*16")
            .cutoff(world.myInputs.shipX.range(0, 2000))
            .gain(0.35)
            .s("supersaw")
            .gain(world.myInputs.entityOrderCloseness.range(0, 0.7))
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
            .lpf(world.myInputs.entityOrderCloseness.range(100, 4000))

            //duck the drums as the entity comes closer
            .lpq(10)
            .delay(1),
          note("<d1 a1 c1 f1>*1.75")
            .cutoff(world.myInputs.shipX.range(0, 2000))
            // .cutoff(perlin.slow(2).range(300, 1000))
            // .lpq(perlin.slow(2).range(1, 10))
            .gain(0.4)
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
            .cutoff(world.myInputs.shipX.range(0, 2000))
            .gain(0.8)
            .s("supersaw")
            .delay(0.1),
          note("<e5>*1")
            .slow(3)
            // .cutoff(world.myInputs.shipX.range(0, 2000))
            .cutoff(perlin.slow(1).range(50, 2000))
            .gain(0.3)
            .s("supersaw")
            .delay(0.1)
          //disorder
          // note("<f5 b4 eb5>*1.75")
          //     .cutoff(world.myInputs.shipX.range(0, 2000))
          //     .gain(0.2)
          //     .s("supersaw")
          //     .delay(0.1)
        )
          .cpm(120 / 4)
          .room(3)
          .sz(0.4)
          .play(),
    },

    {
      title: ["fast burble"].join("\n"),
      fn: () =>
        note("<e5>*1")
          //fast repeats of the note with proximity
          //TODO: pitch-bend this up (and bisect it up and down)
          // with continued exposure to chaos

          .fast(world.myInputs.entityChaosCloseness.range(3, 100))
          .cutoff(perlin.fast(10).range(3, 2000))
          .gain(saw.fast(2).range(0.1, 0.4))
          .gain(world.myInputs.entityChaosCloseness.range(0, 0.4))
          .s("supersaw")
          .delay(0.5)
          .cpm(120 / 4)
          .room(3)
          .sz(0.4)
          .play(),
    },
    {
      title: ["clipped osti"].join("\n"),
      fn: () =>
        note(
          "<~ <[d4 a3 d3] [d e] [a g]> f g <[c4 d4] a a> d e f g a <c4 b [c4 d4]> <g c> a g f e>*16"
          // ).clip(saw.slow(2))
        )
          .clip(0.1)
          .cutoff(world.myInputs.shipX.range(0, 2000))
          .gain(0.45)
          .s("supersaw")
          .delay(0.1)
          .cpm(120 / 4)
          .room(3)
          .sz(0.4)
          .play(),
    },
    {
      title: ["amen chopped"].join("\n"),
      fn: () =>
        s("amen/4")
          .fit()
          .chop(16)
          .cut(1)
          .sometimesBy(0.5, ply("6"))
          .sometimesBy(0.25, mul(speed("-1")))
          .play(),
    },
    {
      //needs
      //https://strudel.cc/#c2FtcGxlcygnZ2l0aHViOnlheHUvY2xlYW4tYnJlYWtzJykKCnN0YWNrKAogIAogIHMoImFtZW4vNCIpLmZpdCgpCi5zbGljZSg4LCAiPDAgMSAyIDMgNCoyIDUgNiBbNiA3XT4qMiIpCi5jdXQoMSkuc29tZXRpbWVzQnkobW91c2VZLnJhbmdlKDAsIDAuOTkpLCBwbHkoIjEyIikpLmdhaW4obW91c2VYLnJhbmdlKDEsIDApKSwKICAKICBub3RlKCJhMyA8W2E0IGM0XSBlND4gYTQgPGEzIGc0IFtjNCBkNCBlNCBmNF0gYjQ%2BIikudHJhbnNwb3NlKDApCiAgLnNvdW5kKCJzdXBlcnNhdyIpLmNsaXAoMC4xNSkKICAuZmFzdCgyKQogIC5yYXJlbHkocGx5KDIpKS5nYWluKG1vdXNlWC5yYW5nZSgwLCAxKSkKICApCg%3D%3D
      title: "amen more b0rked, with clipped synth",
      reqSamples: "github:yaxu/clean-breaks",
      fn: () =>
        stack(
          s("amen/4")
            .fit()
            .slice(8, "<0 1 2 3 4*2 5 6 [6 7]>*2")
            .cut(1)
            .sometimesBy(mouseY.range(0, 0.99), ply("12"))
            .gain(mouseX.range(1, 0)),

          note("a3 <[a4 c4] e4> a4 <a3 g4 [c4 d4 e4 f4] b4>")
            .transpose(0)
            .sound("supersaw")
            .clip(0.15)
            .fast(2)
            .rarely(ply(2))
            .gain(mouseX.range(0, 1))
        ),
    },
  ];
}
