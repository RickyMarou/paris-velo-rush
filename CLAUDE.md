# Paris Velo

A comical pseudo-3D arcade road racer set in Paris. You ride a tiny bike through the streets of Paris, reaching the finish line as fast as possible.

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
- Logical resolution: 1600x1000, scaled to fit screen via CSS
- No framework — keeping it simple
- No ES modules (must work from `file://`). Scripts loaded via `<script>` tags. Single `PVR` global namespace.

### Core Mechanics
- Pseudo-3D road rendering (segment-based projection)
- 2-layer parallax background (sky, near rooftops)
- Player bike with 5 steering frames (center, lean L1/L2, lean R1/R2)
- Roadside Parisian landmarks and props as billboard sprites
- Speed control (accelerate / brake)
- Off-road friction slows you down
- Timer counts up — goal is best time to finish line

### Scenes
1. **Title screen** — logo, "Press Enter"
2. **Racing** — the main game loop
3. **Results** — final time (not yet implemented)

### Road Features
- Straight segments
- Curves (left/right)
- Hills (up/down)
- Alternating road color segments for speed illusion

### Assets
- All sprites are 4x resolution flat PNGs on transparent backgrounds
- Backgrounds are wide horizontal strips (1600px wide) that tile seamlessly
- See `docs/art-brief.md` for full asset list and specs

### What's Next
- Fix floating roadside sprites
- Add NPC obstacles (scooters, trucks, pedestrians) — dodge them, not race them
- Implement finish line and results screen
- Polish and juice
