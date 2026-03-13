# Art Brief — Paris Velo

**Game style:** Retro arcade road racer (like OutRun). Everything is a flat 2D image. The engine handles scaling and placement.

**Delivery format:**
- PNG files, **transparent background** (checkered in Photoshop/Procreate = transparent)
- RGB color, 8-bit
- No drop shadows, no glow effects baked in

**Canvas size:** The game runs at **800x500 pixels**. All sizes below are relative to that.

---

## 1. Player Bike

The player's bike, seen from behind. Always at the bottom center of the screen.

| Frame | Filename | Description |
|---|---|---|
| Center | `player_center.png` | Riding straight, seen from behind |
| Lean left 1 | `player_left_1.png` | Slight lean left |
| Lean left 2 | `player_left_2.png` | Hard lean left |
| Lean right 1 | `player_right_1.png` | Slight lean right |
| Lean right 2 | `player_right_2.png` | Hard lean right |

- **Size:** around **80x100 px**
- **What to draw:** the rider on a tiny bike, from behind — helmet, back, wheels
- **What's transparent:** everything around the rider and bike silhouette
- Draw all 5 frames at the exact same canvas size so they swap cleanly without jumping

---

## 2. Rival Vehicles (seen from behind)

The player catches up to these on the road. We only ever see their backs.

| Filename | Description |
|---|---|
| `rival_bike.png` | Another tiny bike rider |
| `rival_scooter.png` | Vespa-type scooter |
| `rival_truck.png` | Small delivery van (wider, harder to pass) |
| `rival_pedestrian.png` | Confused tourist walking on the road |

- **Size:** around **60x80 px** (truck wider, ~100x80)
- **What to draw:** just the back of the vehicle or person
- **What's transparent:** everything around the vehicle silhouette
- These get scaled by the engine: drawn small = far away, full size = close to player

---

## 3. Roadside Objects

Flat cutouts that appear on either side of the road. Seen from the front, as if you're looking straight at them — like cardboard standees.

| Filename | Description | Approx. size |
|---|---|---|
| `tree_1.png` | Parisian chestnut tree | 60x120 |
| `tree_2.png` | Another tree variation | 60x120 |
| `lamppost.png` | Classic Paris street lamp | 30x100 |
| `cafe_table.png` | Small bistro table with chairs | 60x50 |
| `eiffel_tower.png` | Eiffel Tower (tall landmark) | 120x200 |
| `arc_triomphe.png` | Arc de Triomphe | 140x120 |
| `baguette_stand.png` | Street vendor with baguettes | 60x70 |
| `newspaper_kiosk.png` | Green Parisian kiosk | 50x60 |
| `bollard.png` | Small road bollard | 20x30 |
| `pigeon.png` | Fat pigeon standing around | 25x20 |
| `velib_station.png` | Bike sharing dock | 80x50 |
| `trash_bin.png` | Parisian green bin | 25x40 |

- **What to draw:** the object, front-facing, flat, as if looking straight at it
- **What's transparent:** everything around the object
- Do NOT draw these at an angle — straight on, like a cardboard cutout

---

## 4. Background Layers (parallax)

These scroll horizontally behind the road. They must **tile seamlessly**: if you place two copies side by side, there should be no visible seam at the join.

| Filename | Description | Size |
|---|---|---|
| `bg_sky.png` | Sky with clouds | 1600x200 |
| `bg_far.png` | Distant Paris skyline (Sacre-Coeur, rooftops, chimneys) | 1600x160 |
| `bg_near.png` | Closer buildings, balconies, windows | 1600x120 |

- `bg_sky.png` is **fully opaque** (no transparency)
- `bg_far.png` and `bg_near.png` are **transparent at the top** so the layer behind shows through, and solid toward the bottom
- **Tiling test:** duplicate the image, place the copy flush to the right — the skyline, rooftops, and clouds should flow continuously with no seam

---

## 5. UI Elements

| Filename | Description |
|---|---|
| `speed_gauge.png` | Speedometer frame and dial |
| `position_icon.png` | Small icon for race position display |
| `timer_bg.png` | Background frame for the countdown timer |
| `title_logo.png` | Game title logo ("Paris Velo") |

- Size: whatever fits the design — we position these in code
- Transparent backgrounds

---

## General Rules

1. **Everything on transparent background** except `bg_sky.png`
2. **Front-facing, flat** — no perspective, no 3/4 views, no top-down
3. **Consistent lighting** — light coming from upper-left, same everywhere
4. **Consistent style** — same line weight, same color palette across all assets
5. **No anti-aliasing against a colored background** — always draw on transparent so edges stay clean when composited
6. **File naming** — use the exact filenames listed above so we can plug them straight into the engine
