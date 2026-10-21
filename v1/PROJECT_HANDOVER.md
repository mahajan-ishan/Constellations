# Cosmic Connections — Progress & Handover Document 🌌

> **Project:** Cosmic Connections — Astrophysics-Themed NYT Connections Game  
> **Client / Organization:** Dhruva Astronomy Club ([teamdhruva.com](https://teamdhruva.com))  
> **Directory Root:** `/Users/ishanmahajan/Dhruva/website/Connections/v1`  
> **Last Updated:** October 21, 2026  
> **Active Server:** `http://localhost:8089` (Task: `task-21` / `python3 -m http.server 8089`)

---

## 1. Project Overview & Architecture

Cosmic Connections is a high-polish, space-themed adaptation of the classic NYT Connections game created for **Dhruva Astronomy Club**. Players find four groups of four related astronomical items (16 tiles total) without making 4 mistakes.

### Tech Stack:
- **HTML5 & Vanilla CSS**: Custom responsive layout, glassmorphic UI, space aesthetics, CSS Grid & Flexbox. No Tailwind.
- **Vanilla JavaScript**: Pure JS client-side logic with zero external runtime dependencies.
- **HTML5 Canvas**: Dynamic starry sky background with twinkling multi-depth stars and shooting stars.
- **Data Source**: Astronomy and physics puzzles in `puzzles.js` derived from `../wordle_connections_by_colour.xlsx`.

---

## 2. File Structure

```
Connections/
├── wordle_connections_by_colour.xlsx  # Original puzzle source sheet
└── v1/
    ├── index.html                     # Main markup, canvas, modals, icons
    ├── styles.css                     # Design tokens, Nebula Glow gradients, animations
    ├── app.js                         # Game state engine, event listeners, localStorage
    ├── puzzles.js                     # 6 astronomical puzzles with hints and trivia
    ├── assets/
    │   ├── dhruva_observatory_bg.jpg  # Background night sky photo (positioned at center 72%)
    │   ├── dhruva_observatory_full.jpg # Full uncropped vertical night sky photo for View Picture modal
    │   ├── stardle_bg.jpg             # Alternate background
    │   └── icon.svg                   # Favicon
    ├── README.md                      # General project introduction
    └── PROJECT_HANDOVER.md            # This handover document
```

---

## 3. Key Features & Current Implementation Status

### A. Color Palette & Visual Aesthetics (`styles.css`)
- **Category Difficulties — Space Palette with Minimalist Gradients**:
  - 🟨 **Level 0 (Stellar Gold — `#F5C451`)**: Warm, starlike, luminous. Gradient: `#fce488` (top light) -> `#f5c451` -> `#df9e18` (warm depth).
  - 🟩 **Level 1 (Aurora Teal — `#45D6A0`)**: Ethereal, electric. Gradient: `#6eeab7` (top light) -> `#45d6a0` -> `#24b67f` (deep teal).
  - 🟦 **Level 2 (Cosmic Cyan — `#48BFFF`)**: High-energy ionized gas. Gradient: `#7cd6ff` (top light) -> `#48bfff` -> `#1ba0e8` (deep cyan).
  - 🟪 **Level 3 (Nebula Violet — `#A879FF`)**: Ultraviolet nebula. Gradient: `#c8a5ff` (top light) -> `#a879ff` -> `#854cef` (deep violet).
- **Defined 2px Solid Black Borders**:
  - Applied clean, slightly thickened `border: 2px solid #000000` across all solved banners, category pills, and insight cards for crisp separation and contrast against the starry backdrop.
  - Paired with smooth drop shadows (`0 4px 18px rgba(0,0,0,0.35)`) and subtle top gloss highlight (`::before`).

### B. Dynamic Tile Clearing Animation (`app.js` & `styles.css`)
- When a group is solved, tiles animate out with a staggered delay (`popOut` keyframe: `scale(1) -> scale(1.1) -> scale(0)` + opacity drop).
- Solved categories consolidate into glowing banners at the top with collapsible **🔭 ASTRO INSIGHT** trivia cards.

### C. Game Reset & Replay Flow (`index.html` & `app.js`)
- **Header Reset Button (↺)**: Located at top right next to Archive button (`#reset-puzzle-btn`). Allows players to restart the current puzzle anytime with confirmation.
- **Game Over Modal Replay (Restart ⟲)**: Added `#replay-puzzle-btn` so players who win or lose can immediately play that puzzle again without refreshing.
- **Global Helper**: `window.resetConnections(all = false)` is exposed in the browser console for quick debugging or resetting all saved puzzles and stats.

### D. Multi-Puzzle Catalog & Archive Modal (`puzzles.js` & `app.js`)
- Includes 6 astronomical puzzles:
  1. *Types of Antennae / Space Movie Actors / Galaxy Names / Missions Named After Greek Mythology*
  2. *Rocket Engines / Constellations Along Ecliptic / Spectral Classes / Parts of a Black Hole*
  3. *Telescope Mounts / Mars Rovers / Exoplanet Detection Methods / Famous Astronomers*
  4. *Spacecraft That Left Solar System / Famous Nebulae / Physics Constants / Planetary Moons*
  5. *Cosmology Concepts / Launch Vehicles / Asteroid Belt Objects / Physics Nobel Laureates*
  6. *Dhruva Verticals / Dark Entities / Stellar Evolution Stages / Astronomy Acronyms*
- Players can switch between puzzles anytime via the **📅 Archive** button in the top header.
- Puzzles cycle by date automatically.

### E. On-Demand Interactive Hints (`app.js` & `styles.css`)
- Replaced verbose answers/descriptions with **category names only**:
  - All 4 colors (Yellow, Green, Blue, Purple) are listed with their indicator dot.
  - Players click **Reveal Hint** to see *only* the category theme (e.g. `TYPES OF ANTENNAE`), giving a subtle nudge without spoiling any words or answers.
  - Keeps the remaining hints hidden so players aren't spoiled.
  - Clean, minimal, zero extra clutter.

### F. Persistence & Statistics
- Game state per puzzle is saved in `localStorage`: `dhruva_connections_save_<id>`
- Overall stats (played, win %, streaks, guess distribution) saved in `localStorage`: `dhruva_connections_stats`

### G. View Full Vertical Photo Feature (`index.html`, `styles.css`, `app.js`)
- Floating glassmorphic pill button positioned in the bottom-right corner (`🖼 View Picture`).
- When clicked, opens a dedicated full-screen scrollable photo viewer modal (`#photo-viewer-modal`) displaying the **original, uncropped vertical photograph** (`assets/dhruva_observatory_full.jpg`).
- Players can smoothly scroll vertically through the entire image from the starry night sky at the top down to the horizon.
- The background photo during gameplay remains completely unchanged (`assets/dhruva_observatory_bg.jpg` at `center 72%`).
- Includes a sticky header with a `↕ Scroll to explore full vertical photo` hint, and a clean `✕` close button (also closes on backdrop click or Escape).

---

## 4. Local Development & Testing

- **Server Command**:
  ```bash
  cd /Users/ishanmahajan/Dhruva/website/Connections/v1
  python3 -m http.server 8089
  ```
- **URL**: `http://localhost:8089/`
- **Cache Busting**: Version queries (`?v=restored1`) are appended to `styles.css` in `index.html`.

---

## 5. Potential Next Steps / Backlog for Future Sessions

1. **Additional Puzzles**: Import any remaining puzzles from `wordle_connections_by_colour.xlsx`.
2. **Audio Effects**: Optional subtle cosmic sound effects (tile selection blip, chime on category solve, bass drop on error).
3. **Timer / Speedrun Mode**: Optional stopwatch mode for competitive Dhruva club sessions.
4. **Custom Share Cards**: Generate downloadable image cards showing player score grids with Dhruva branding.
