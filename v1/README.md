# Cosmic Connections — Dhruva Astronomy Club 🌌

An astronomy & astrophysics-themed [NYT Connections](https://www.nytimes.com/games/connections) word game, designed and crafted to match the deep space aesthetic and high-polish feel of **Stardle**.

---

## ✨ Features

- **🔭 Genuine Astronomy & Astrophysics Categories**:
  - Curated puzzles covering celestial mechanics, planetary science, observational astronomy, stellar evolution, and clever astrophysics wordplay.
  - 4 Difficulty tiers:
    - 🟨 **Level 1 (Straightforward)**
    - 🟩 **Level 2 (Moderate)**
    - 🟦 **Level 3 (Challenging)**
    - 🟪 **Level 4 (Tricky / Wordplay / Clever red herrings)**
- **✦ Cosmic Aesthetics & Animations**:
  - Twinkling multi-depth starfield with shooting star streaks rendered on HTML5 canvas.
  - Luminous cyan tile selection highlights with haptic scale feedback.
  - Smooth category reveal banner consolidation and error shake animation.
  - Exploding celestial orb mistake counter (`● ● ● ●`).
- **🎵 Musical Hints & Trivia**:
  - Built-in musical hint system linked to Spotify and YouTube Music for each puzzle category (just like Stardle).
  - Expandable astrophysics fact sheet ("🔭 Astro Insight") on every solved category banner.
- **📊 Stats, Persistence & In-Game Reset**:
  - Saves games in `localStorage` so refreshing never loses your progress.
  - Quick **Restart / Reset Button (↺)** in the header and Game Over modal to restart puzzles from scratch at will.
  - Tracks games played, win rate percentage, current streak, max streak, and guess distribution graph.
  - Shareable NYT-style emoji score grid (`🟨🟨🟨🟨...`) ready to copy to clipboard for WhatsApp, Discord, or Twitter.
- **📅 Puzzle Catalog & Archive**:
  - Daily puzzle selection based on Indian Standard Time (IST).
  - Built-in archive modal allowing players to play any past or upcoming puzzle anytime.
- **📖 AI Handover & Documentation**:
  - See [PROJECT_HANDOVER.md](PROJECT_HANDOVER.md) for full architecture notes, color palettes, and session history.

---

## 🗂️ Project Structure

```
Connections/
├── index.html        # Game layout, modals, starfield canvas, and accessibility markup
├── styles.css        # Space-themed CSS tokens, glassmorphism, responsive grid & animations
├── app.js            # Core gameplay engine, starfield canvas, guess checking, stats & local storage
├── puzzles.js        # Curated catalog of astronomy puzzles, facts, difficulty levels & song hints
├── assets/
│   ├── dhruva_logo.jpg
│   ├── stardle_bg.jpg
│   └── icon.svg
└── README.md
```

---

## 🚀 Running Locally

You can open `index.html` directly in any web browser, or run a local static server:

```bash
# Python 3
python3 -m http.server 8089

# Or using npx serve
npx serve .
```

Then visit `http://localhost:8089`.

---

## ✍️ Adding New Puzzles

To add new puzzles, open [puzzles.js](file:///Users/ishanmahajan/Dhruva/website/Connections/puzzles.js) and add an entry to the `ASTRO_PUZZLES` array:

```javascript
{
  id: 6,
  title: "Cosmic Connections #6",
  date: "2026-10-25",
  categories: [
    {
      name: "CATEGORY TITLE",
      level: 0, // 0: Yellow, 1: Green, 2: Blue, 3: Purple
      words: ["WORD1", "WORD2", "WORD3", "WORD4"],
      description: "Astrophysical insight or educational trivia explaining the connection.",
      songHint: { title: "Song Name", artist: "Artist Name", query: "Search Query" }
    },
    ...
  ]
}
```
