## TODO:

-   give different map/space areas different colours / fetaures
-   it MUST take time to reach certain zones/objects, so the user can appreciate gradual changes over time, not just everything together within the first 5 seconds of playing.
-   Make creatures that come and go fairly quickly, with associated musical side-effects
-   Make positional audio input VERY obvious, or ppl will just think oh it's music (which anyway changes)
-   Player-depth in a level increases disorder
-   Have an entity that floats around and appears to be the source of sound for a noticable element in the track as we get nearer, that sound appears and increases in volume, maybe an LFP cutoff increases
-   TODO: have some other element fade OUT / duck when we're near entity, so it's not just "more"
-   Chop a beat for disorder. figure out how to chop a little vs a lot.

## Done:

-   Add scrolling map
-   move to type-checked js
-   start a little types stub for strudel - just method names for auto-complete.
-   move to instance mode to avoid clash with strudel globals
-   add a beat sample: cc0 - 20250727 Fl Studio HQ Funk Kit playing Fpc Ambient Groove 05 at 100bpm (or 104.5?)

## Design notes:

-   I had to use instance-mode p5, to avoid clashes with strudel's global injections. The p5 code makes the sacrifice (rather than strudel) because it's more important to keep strudel with global functions for its concise music DSL.
