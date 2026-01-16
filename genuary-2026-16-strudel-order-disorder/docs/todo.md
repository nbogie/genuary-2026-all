## TODO:

### - staging:

- first we travel alone, ship sounds, silence of space, pedals,
- then in silence we meet order (single tone burble or perfectly rhythmic),
- then we need space where we can move away from and back to order to observe changes (angelic order polyrhythmic satellite tones)
- THEN we meet disorder. alien trickles from afar, screen-breakup,
- pitchbend up and down as get very close
- Stage 2 disorder: somehow introduce a beat which we can disrupt with chaos
- chaos entity: increased discord the longer we are near it, as well as proximity (keep track of how much time we're in its proximity, reset / balance with order-entity or distance from chaos)

### musical effects to attempt to achieve

- breakthrough to drop: only a high thin string extension held note maintains as everything else falls out (with echo)
- wooly murbles and rumbles
- brassy supersaw cutoff opening and enriching as we travel
-
- pitches bending both up and down ("madness") on approach. like the dolby advert in cinema.
- shepherd tone? (perceived infinite falling/rising)
- solo'd tight clippy ostinato before back in
- increasingly shuffled, glitching breakbeat (or space-domain equivalent)
- high speed satellite burble - "data-transfer" and alt "radiation / geiger counter".
- alien trickles / clicking.
- pedals and higher extensions (gently maj7, add9 for order, but anything goes for chaos)
- murbly voices? disguise the nasa astronaut chit-chat audio? (try w/out audio files)

- avoid the possibility of being in a mood around one entity, and the other entity approaches and DOESN'T give its usual audio interactions (because they're not featured in the current pattern).
  every pattern that plays when both entities are potentially present must cater for both entities in their possible combinations.
  every pattern that plays when one entity is potentially present must cater for that entity near and far.

- give different map/space areas different colours / fetaures
- it MUST take time to reach certain zones/objects, so the user can appreciate gradual changes over time, not just everything together within the first 5 seconds of playing.
- Make creatures that come and go fairly quickly, with associated musical side-effects
- Make positional audio input VERY obvious, or ppl will just think oh it's music (which anyway changes)
- Player-depth in a level increases disorder
- Have an entity that floats around and appears to be the source of sound for a noticable element in the track as we get nearer, that sound appears and increases in volume, maybe an LFP cutoff increases
- TODO: have some other element fade OUT / duck when we're near entity, so it's not just "more"
- Chop a beat for disorder. figure out how to chop a little vs a lot.

### todo: visuals

- replace all placeholders (entities, player, starfield)
- colours/features in the nebula to help the player distinguish zones.
- add alien writing / glyphs / constellations that come and go
- somewhat periodically highlight+link constellations from the stars in the starfield
- make the visual distortion exponentially worse as one gets really close to chaos.
  - what else can start to become disordered? (audio, screen..., palette? blend mode? controls?)

## Done:

- add glitch shader when chaos
- move to ts and p5.v2
- Add scrolling map
- add a chaos entity
- move to type-checked js
- start a little types stub for strudel - just method names for auto-complete.
- move to instance mode to avoid clash with strudel globals
- add a beat sample: cc0 - 20250727 Fl Studio HQ Funk Kit playing Fpc Ambient Groove 05 at 100bpm (or 104.5?)

## Design notes:

- I had to use instance-mode p5, to avoid clashes with strudel's global injections. The p5 code makes the sacrifice (rather than strudel) because it's more important to keep strudel with global functions for its concise music DSL.
