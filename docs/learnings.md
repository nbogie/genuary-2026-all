# learnings and issues

## day 1

-   name: trees
-   just taking the ts template out for a drive.
-   published: https://openprocessing.org/sketch/2837979

## day 2

-   name: squash-and-stretch-ugly
-   published: https://openprocessing.org/sketch/2838424
-   learning: lodash doesn't seem to tree-shake. es-toolkit better replacement with 6 million weekly downloads. (e.g. for minBy)
-   issue: vite bundling: calls to gsap.to external dep getting bundled as gsap.gsap
-   reflection: not enough time. this prompt wants a lot of time - 12 principles!
-   reflection: next time find a small ts-friendly state-machine rather than code it
-   reflection - it's obvious that there was no driving intentionality towards the look and feel of the final sketch (only that I wanted an agent to anticipate its movement, and squash and stretch). Their very random target destination picking gives lacklustre results, for example.

# day 3 - fib

-   summary: I never find fib series inspiring. Attempted something with strudel but got stuck generating pitch from sequence via external callback (callback was called too often).

-   reflection: There's not time for tech-spikes that might block you for days, if you want to successfully do each day time effectively.

# day 4 - lowres

-   summary: Started really late. I like the idea of the game, sailing from water patch to water patch.
-   todo: needs more mood - like rising moon, blood moon, eerie ghosts, sunset, storm, and maybe biomes to encourage exploration (desert, open ocean, snow + ice zone).
-   issue: I wasn't sure how to further lowres the environment: voxelising the player ship, perhaps?

# day 5 - write genuary without a font

-   summary. didn't do. uninspired by prompt.

# day 6 - lights on/off

summary: got distracted by r1b2's rock-shading walk-through. belatedly figured I could use it as the day's submission, but as a result the lights on/off part was rubbish. I like the look of the hatching, though! Thanks to Duaran for sharing the secrets!
reflection: i need to spend a little time looking at relative colours in p5 (like we can do in css) - i generate bad in-the-dark versions of colours which look too saturated.
todo: it'd be nice to do some contact shadows under the rocks using the same style of hatching.

# day 7 - boolean constructive solid geometry - structures

summary: end result is colourful, if not artistic. I spent most of the time wrassling typescript + p5.csg before giving up and shifting to three.js. Then had a lot of hassles externalising the various libraries and orbitControls to avoid bundling them, so that only the app code could be pushed to openprocessing.
reflection: i'm still learning about vite, rollup, and browser module loading (whether i want to or not).
reflection: if it's a hassle externalising libs, maybe just don't share the code on OP that day!
reflection: if it looks like the p5 v2 + typescript setup is going to be a hassle, pivot quickly.
