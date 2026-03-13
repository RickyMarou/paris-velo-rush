# Paris Velo

A comical pseudo-3D arcade road racer set in Paris. You ride a tiny bike through Paris traffic, dodging scooters, delivery trucks, and confused tourists.

## Reference

- **Primary inspiration:** [Jake Gordon's javascript-racer](https://github.com/jakesgordon/javascript-racer) — OutRun-style pseudo-3D racer in JS/Canvas
  - [Tutorial series](https://codeincomplete.com/articles/javascript-racer-v1-straight/)
- **Pseudo-3D technique reference:** [extentofthejam.com/pseudo/](http://www.extentofthejam.com/pseudo/)
- **Art brief for the artist:** `docs/art-brief.md`

## Workflow

- Push straight to `main` — no branches, no PRs

## Game Plan

### Tech
- Browser game, vanilla JS + HTML5 Canvas
- Logical resolution: 800x500, scaled to fit screen via CSS
- No framework — keeping it simple

### Core Mechanics
- Pseudo-3D road rendering (segment-based projection)
- 3-layer parallax background (sky, far skyline, near buildings)
- Player bike with 5 steering frames (center, lean L1/L2, lean R1/R2)
- Rival vehicles as scaled sprites approaching from distance
- Roadside Parisian landmarks and props as billboard sprites
- Collision with rivals slows you down
- Speed control (accelerate / brake)

### Scenes
1. **Title screen** — logo, "Press Start"
2. **Racing** — the main game loop
3. **Results** — time, position, score

### Road Features
- Straight segments
- Curves (left/right)
- Hills (up/down)
- Alternating road color segments for speed illusion

### Assets
- All sprites are flat PNGs on transparent backgrounds
- Backgrounds are wide horizontal strips (1600px wide) that tile seamlessly
- See `docs/art-brief.md` for full asset list and specs

### Milestones
1. Road rendering — straight road with segment projection
2. Curves and hills
3. Player bike with steering
4. Parallax background
5. Roadside sprites
6. Rival vehicles and collision
7. Speed / scoring / timer
8. Title and results screens
9. Mobile touch controls
10. Polish and juice
