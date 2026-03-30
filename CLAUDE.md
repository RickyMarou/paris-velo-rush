# Paris Velo

A comical pseudo-3D arcade road racer set in Paris. You ride a tiny e-bike through the streets of Paris, reaching the finish line as fast as possible.

## Reference

- **Primary inspiration:** [Jake Gordon's javascript-racer](https://github.com/jakesgordon/javascript-racer) — OutRun-style pseudo-3D racer in JS/Canvas
  - [Tutorial series](https://codeincomplete.com/articles/javascript-racer-v1-straight/)
- **Pseudo-3D technique reference:** [extentofthejam.com/pseudo/](http://www.extentofthejam.com/pseudo/)
- **Art brief for the artist:** `docs/art-brief.md`

## Workflow

- Push straight to `main` — no branches, no PRs

## Game Design

The game is NOT a race against other riders. It's a time-trial: reach the finish line as fast as possible. The timer counts up from 0:00. NPCs (pedestrians, scooters, trucks) are obstacles to dodge — they will be added later.

### Tech
- Browser game, vanilla JS + HTML5 Canvas
- Logical resolution: 1600x1000, scaled to fit screen via CSS (`image-rendering: pixelated`)
- No framework — keeping it simple
- No ES modules (must work from `file://`). Scripts loaded via `<script>` tags. Single `PVR` global namespace.

### Core Mechanics
- Pseudo-3D road rendering (segment-based projection)
- 2-layer parallax background (sky, near rooftops)
- Player bike with 5 steering frames × 2 pedal frames (10 frames total)
- Roadside Parisian landmarks and props as billboard sprites
- E-bike acceleration with 4 zones (each zone has its own accel factor and pedal cadence)
- Turning speed cap at 22 km/h, max speed 35 km/h
- Off-road friction slows you down
- Centrifugal force pushes you outward on curves
- Timer counts up — goal is best time to finish line

### Scenes (state machine in `game.js`)
1. **`title`** — logo, "Press Enter", control hints
2. **`countdown`** — 3-2-1-GO pulse animation, then transitions to racing
3. **`racing`** — the main game loop
4. **`results`** — final time (stub, not yet implemented)

### Road Features
- Straight segments, curves (left/right), hills (up/down)
- Alternating road color segments for speed illusion
- Road stamps (directional arrow + cyclist pictogram on a single canvas) painted on road surface
- Narrow road with white edges and concrete shoulders (no lane markings)

### Assets
- All sprites are 4x resolution flat PNGs on transparent backgrounds
- Backgrounds are wide horizontal strips (1600px wide) that tile seamlessly
- See `docs/art-brief.md` for full asset list and specs

### What's Next
- Fix floating roadside sprites
- Add NPC obstacles (scooters, trucks, pedestrians) — dodge them, not race them
- Implement finish line and results screen
- Polish and juice

---

## Architecture

### File Structure
```
index.html              ← single canvas, loads all scripts in order
css/style.css           ← responsive canvas scaling, touch-action: none
js/
  constants.js          ← all tuning params (speeds, colors, road dims, accel zones)
  util.js               ← math helpers, pseudo-3D projection (Util.project), fog
  road.js               ← track generation: segments, curves, hills, sprite placement
  placeholder.js        ← canvas-drawn fallback sprites (used when PNGs fail to load)
  loader.js             ← asset manifest and parallel image loader
  input.js              ← keyboard + touch input abstraction
  render.js             ← all canvas drawing (road, sprites, parallax, player, road stamps)
  hud.js                ← speedometer, timer, countdown overlay
  game.js               ← main loop (rAF), state machine, physics update
assets/
  sprites/              ← 30+ roadside PNGs (landmarks, props, NPCs)
  sprites/player/       ← 10 player bike frames (5 steer × 2 pedal)
  backgrounds/          ← bg_sky.png, bg_near.png (parallax layers)
docs/art-brief.md       ← full asset specs for the artist
```

### Script Load Order (matters — each extends `PVR`)
1. `constants.js` → config values
2. `util.js` → math/projection helpers
3. `road.js` → track builder
4. `placeholder.js` → fallback sprite generator
5. `loader.js` → asset loading
6. `input.js` → input handling
7. `render.js` → drawing functions
8. `hud.js` → HUD drawing
9. `game.js` → entry point, `DOMContentLoaded` → init

### Asset System

**Manifest** (`loader.js`): `PVR.Loader.SPRITES` maps string keys (e.g. `'player_straight'`, `'eiffel_tower'`) to file paths under `assets/`.

**Loading** (`PVR.Loader.loadAll`): Loads all images in parallel. On failure for any image, falls back to the canvas-drawn placeholder from `placeholder.js`. Loaded images stored in `PVR.Assets` (key → `Image` or `Canvas`).

**Placeholders** (`placeholder.js`): `PVR.Placeholder.generate()` creates every sprite as a canvas-drawn fallback — player bike frames, all roadside objects, landmarks, NPCs, backgrounds. This means the game is fully playable with zero image files.

**Player sprites**: 5 steering positions (`straight`, `left1`, `left2`, `right1`, `right2`) each with a `_b` pedaling variant. Render.js alternates between base and `_b` frames using `pedalTimer` driven by the current acceleration zone's `pedalRate`.

### Road & Segment System

**Segments** (`road.js`): The track is an array of segments. Each segment has:
- `p1`, `p2`: world-space endpoints (y = elevation, z = distance along track)
- `curve`: horizontal curve amount (0 = straight, negative = left, positive = right)
- `sprites[]`: roadside objects attached to this segment (`{source, offset}`)
- `color`: alternating `LIGHT`/`DARK` for the speed-stripe illusion

**Track layout** (`PVR.Road.buildTrack`): Built procedurally with helpers `addStraight`, `addCurve`, `addHill`, `addSCurves`. Roadside sprites placed every ~5 segments, major landmarks every ~80 segments.

**Projection** (`Util.project`): Converts world coordinates to screen space using `cameraDepth / cameraZ` scale factor — the core pseudo-3D trick from the reference material.

### Rendering Pipeline (`render.js`, called from `game.js`)

1. Clear canvas, draw sky gradient
2. Draw parallax backgrounds (sky moves slow, near buildings move faster)
3. Loop through `DRAW_DISTANCE` (300) segments ahead of player:
   - Project segment endpoints to screen
   - Draw road polygon (trapezoid) with concrete shoulders and white edge rumbles
   - Draw road stamps (arrow + cyclist pictogram) on road surface
   - Apply exponential fog by distance
4. Draw road stamps back-to-front via `drawRoadStamps()` (every `ROAD_STAMP_INTERVAL` segments)
5. Reverse-iterate segments to draw roadside sprites back-to-front (painter's algorithm)
6. Draw player bike (center-bottom, sprite selected by steer direction + pedal frame)
7. Draw HUD (speed bar, km/h, timer, countdown if active)

### Physics (`game.js: updateRacing`)

- **Steering**: input → `playerX` offset, clamped to ±2.5 (road bounds)
- **Centrifugal force**: curves push player outward proportional to speed × curve amount
- **Acceleration zones** (defined in `constants.js`): 4 zones from 0–35 km/h, each with a `factor` (accel multiplier) and `pedalRate` (animation cadence). Simulates e-bike assist curve — strong assist in mid-range, tapering at top speed.
- **Turning speed cap**: steering at >22 km/h triggers extra deceleration
- **Off-road**: `|playerX| > 1.0` → heavy friction if above threshold speed
- **Position**: `position += dt × speed`, wraps at track length

### Input (`input.js`)
- **Keyboard**: arrow keys (steer, accel, brake) + Enter (confirm)
- **Touch**: canvas split into thirds — left=steer left, center=accelerate, right=steer right
