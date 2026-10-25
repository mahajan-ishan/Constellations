/**
 * Dhruva Astronomy Club — Constellations Puzzles
 * Source: wordle_connections_by_colour.xlsx
 *
 * Difficulty levels:
 *   0 = Yellow  (Straightforward)
 *   1 = Green   (Moderate)
 *   2 = Blue    (Challenging)
 *   3 = Purple  (Tricky / Wordplay)
 */

const ASTRO_PUZZLES = [

  /* ── PUZZLE 1 ─────────────────────────────────────────── */
  {
    id: 1,
    title: 'Constellations #1',
    date: 'Puzzle 1',
    categories: [
      {
        level: 0,
        name: 'TYPES OF ANTENNAE',
        words: ['HORN', 'LOOP', 'PATCH', 'DISH'],
        description: 'Common antenna designs used in radio and microwave engineering. The dish (parabolic) antenna is widely used in radio astronomy.'
      },
      {
        level: 1,
        name: 'ACTORS IN FAMOUS SPACE MOVIES',
        words: ['RYAN', 'MATT', 'MATTHEW', 'TOM'],
        description: 'Ryan Gosling (Project Hail Mary), Matt Damon (The Martian), Matthew McConaughey (Interstellar), and Tom Hanks (Apollo 13) all starred in iconic space films.'
      },
      {
        level: 2,
        name: 'GALAXY NAMES',
        words: ['CIGAR', 'PINWHEEL', 'SOMBRERO', 'TADPOLE'],
        description: 'Galaxies often get colourful nicknames: Sombrero (M104), Pinwheel (M101), Cigar (M82), and Tadpole (UGC 10214).'
      },
      {
        level: 3,
        name: 'NASA MISSIONS NAMED AFTER GREEK MYTHOLOGY',
        words: ['APOLLO', 'ARTEMIS', 'GEMINI', 'ODYSSEY'],
        description: 'Apollo (sun god), Artemis (moon goddess), Gemini (twins), and Odyssey (epic voyage) are all NASA missions rooted in Greek mythology.'
      }
    ]
  },

  /* ── PUZZLE 2 ─────────────────────────────────────────── */
  {
    id: 2,
    title: 'Constellations #2',
    date: 'Puzzle 2',
    categories: [
      {
        level: 0,
        name: 'WELL KNOWN CONSTELLATIONS',
        words: ['LEO', 'ORION', 'URSA MAJOR', 'DRACO'],
        description: 'Leo the lion, Orion the hunter, Ursa Major the great bear, and Draco the dragon are among the most recognisable constellations in the night sky.'
      },
      {
        level: 1,
        name: 'PARTS OF A TELESCOPE',
        words: ['FOCUSER', 'TRIPOD', 'EYEPIECE', 'OPTICAL TUBE'],
        description: 'A standard optical telescope consists of an optical tube (main body), focuser (sharpens image), eyepiece (magnifies), and tripod (stabilises).'
      },
      {
        level: 2,
        name: 'GODS AFTER WHOM THE FIRST FOUR PLANETS WERE NAMED',
        words: ['MESSENGER', 'LOVE', 'GROUND', 'WAR'],
        description: 'Mercury = Messenger god, Venus = goddess of Love, Earth/Terra = Ground, Mars = god of War. The inner planets carry Roman divine associations.'
      },
      {
        level: 3,
        name: '___ PRINCIPLE',
        words: ['UNCERTAINTY', 'EXCLUSION', 'SUPERPOSITION', 'LEAST ACTION'],
        description: "Heisenberg's Uncertainty, Pauli's Exclusion, the Superposition Principle, and the Principle of Least Action are cornerstones of modern physics."
      }
    ]
  },

  /* ── PUZZLE 3 ─────────────────────────────────────────── */
  {
    id: 3,
    title: 'Constellations #3',
    date: 'Puzzle 3',
    categories: [
      {
        level: 0,
        name: 'EM WAVE TYPES',
        words: ['ULTRAVIOLET', 'INFRARED', 'RADIO', 'GAMMA'],
        description: 'The electromagnetic spectrum includes radio, infrared, visible, ultraviolet, X-ray, and gamma-ray waves — each revealing a different face of the universe.'
      },
      {
        level: 1,
        name: 'TYPES OF QUARKS',
        words: ['STRANGE', 'BOTTOM', 'CHARM', 'TOP'],
        description: 'Quarks come in six flavours: up, down, charm, strange, top, and bottom. They combine to form hadrons such as protons and neutrons.'
      },
      {
        level: 2,
        name: 'WORDS IN THE PLANETARY MNEMONIC',
        words: ['MY', 'EDUCATED', 'SERVED', 'MOTHER'],
        description: '"My Very Educated Mother Just Served Us Nachos" — a mnemonic for Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.'
      },
      {
        level: 3,
        name: 'FAMOUS ASTRONOMERS WITH ONE LETTER CHANGED',
        words: ['BUBBLE', 'RUBIX', 'BRAHM', 'HAILEY'],
        description: 'Hubble→Bubble, Rubin→Rubix, Brahe→Brahm, Halley→Hailey. Each word is a disguised famous astronomer with exactly one letter changed!'
      }
    ]
  },

  /* ── PUZZLE 4 ─────────────────────────────────────────── */
  {
    id: 4,
    title: 'Constellations #4',
    date: 'Puzzle 4',
    categories: [
      {
        level: 0,
        name: 'QUANTIZED QUANTITIES',
        words: ['CHARGE', 'SPIN', 'PHOTON ENERGY', 'ORBITAL ANGULAR MOMENTUM'],
        description: 'Quantum mechanics tells us that electric charge, spin, photon energy (E=hf), and orbital angular momentum only exist in discrete, quantized values.'
      },
      {
        level: 1,
        name: 'HARRY POTTER CHARACTERS NAMED AFTER STARS',
        words: ['SIRIUS', 'REGULUS', 'BELLATRIX', 'ALPHARD'],
        description: 'J.K. Rowling named Black family members after real stars: Sirius (brightest star), Regulus (in Leo), Bellatrix (in Orion), and Alphard (in Hydra).'
      },
      {
        level: 2,
        name: 'NAMES OF NEBULAE',
        words: ['HORSEHEAD', 'HELIX', 'CRAB', 'TARANTULA'],
        description: 'The Horsehead Nebula (Orion), Helix (the Eye of God), Crab (M1, remnant of a 1054 supernova), and Tarantula (in the Large Magellanic Cloud).'
      },
      {
        level: 3,
        name: "MOON NAMES WITH FIRST LETTER REPLACED BY PLANET'S",
        words: ['JUROPA', 'MEIMOS', 'NRITON', 'PHARON'],
        description: 'Europa→Juropa (Jupiter), Deimos→Meimos (Mars), Triton→Nriton (Neptune), Charon→Pharon (Pluto). Each moon starts with its planet\'s initial!'
      }
    ]
  },

  /* ── PUZZLE 5 ─────────────────────────────────────────── */
  {
    id: 5,
    title: 'Constellations #5',
    date: 'Puzzle 5',
    categories: [
      {
        level: 0,
        name: 'LIGHT ALTERING OBJECTS',
        words: ['PRISM', 'LENS', 'SLIT', 'POLARISER'],
        description: 'A prism disperses light into a spectrum, a lens refracts and focuses it, a slit enables diffraction, and a polariser filters it by orientation.'
      },
      {
        level: 1,
        name: 'ISRO SATELLITE LAUNCH VEHICLES',
        words: ['AUGMENTED', 'POLAR', 'GEOSYNCHRONOUS', 'REUSABLE'],
        description: "ISRO's rocket family: ASLV (Augmented), PSLV (Polar), GSLV (Geosynchronous), and RLV-TD (Reusable Launch Vehicle-Technology Demonstrator)."
      },
      {
        level: 2,
        name: 'CHEMICAL COMPONENTS OF A SOLID PROPELLANT',
        words: ['OXIDISER', 'FUEL', 'BINDER', 'CATALYST'],
        description: 'Solid rocket propellants contain an oxidiser (ammonium perchlorate), fuel (aluminium powder), a binder (HTPB), and a catalyst (iron oxide) to control burn rate.'
      },
      {
        level: 3,
        name: 'THE BIG ____',
        words: ['FREEZE', 'BANG', 'CRUNCH', 'RIP'],
        description: 'End-of-universe scenarios: the Big Bang (origin), Big Crunch (gravitational collapse), Big Freeze (heat death), and Big Rip (dark energy tears everything apart).'
      }
    ]
  },

  /* ── PUZZLE 6 ─────────────────────────────────────────── */
  {
    id: 6,
    title: 'Constellations #6',
    date: 'Puzzle 6',
    categories: [
      {
        level: 0,
        name: 'DHRUVA VERTICALS',
        words: ['RESEARCH', 'OPTICAL', 'RADIO', 'DDA'],
        description: 'Dhruva Astronomy Club operates across four verticals: Research, Optical Astronomy, Radio Astronomy, and DDA (Dhruva Dark-sky Advocacy).'
      },
      {
        level: 1,
        name: 'HYPOTHETICAL DARK ENTITIES IN THE UNIVERSE',
        words: ['ENERGY', 'MATTER', 'STARS', 'GALAXIES'],
        description: 'Dark Energy, Dark Matter, Dark Stars, and Dark Galaxies are all elusive "dark" entities — hypothetical or observed phenomena that challenge our understanding of the cosmos.'
      },
      {
        level: 2,
        name: 'LIFE STAGES OF A STAR',
        words: ['NEBULA', 'PROTOSTAR', 'SUPERNOVA', 'BLACK HOLE'],
        description: "A massive star's life: born in a nebula, contracts into a protostar, spends its life on the main sequence, explodes as a supernova, leaving a neutron star or black hole."
      },
      {
        level: 3,
        name: 'MISPRONOUNCED PHYSICS WORDS (SPELLED AS SAID)',
        words: ['AWGER', 'YOOLER', 'FOUR YEAR', 'POISON'],
        description: '"Awger"=Auger, "Yooler"=Euler, "Four year"=Fourier, "Poison"=Poisson. These famous names are routinely butchered in physics classrooms!'
      }
    ]
  }

];

/* ── Helper: get puzzle by ID ───────────────────────────── */
function getPuzzleById(id) {
  return ASTRO_PUZZLES.find(p => p.id === id) || ASTRO_PUZZLES[0];
}

/* ── Weekly IST unlock system ───────────────────────────── */
// Puzzle #1 went live on Sunday, October 18, 2026 at 00:00 IST.
// Puzzle #2 and each subsequent puzzle unlock every 7 days at Sunday 00:00 IST.
const LAUNCH_SUNDAY_IST = new Date('2026-10-18T00:00:00+05:30');

function getISTWeeksSinceLaunch() {
  const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
  const nowUTC = Date.now();
  const launchUTC = LAUNCH_SUNDAY_IST.getTime();
  const msSinceLaunch = nowUTC - launchUTC;
  if (msSinceLaunch < 0) return -1; // Before launch
  return Math.floor(msSinceLaunch / (7 * 24 * 60 * 60 * 1000));
}

// How many puzzles have unlocked so far (1-indexed count)
function getUnlockedPuzzleCount() {
  const weeks = getISTWeeksSinceLaunch();
  if (weeks < 0) return 0; // Not launched yet
  return Math.min(weeks + 1, ASTRO_PUZZLES.length);
}

// Returns true if a puzzle id is unlocked
function isPuzzleUnlocked(id) {
  const unlocked = getUnlockedPuzzleCount();
  return id >= 1 && id <= unlocked;
}

// Returns the current week's puzzle (the most recently unlocked one)
function getPuzzleForDate() {
  const unlocked = getUnlockedPuzzleCount();
  if (unlocked <= 0) return ASTRO_PUZZLES[0]; // Before launch: show puzzle 1 as preview
  return ASTRO_PUZZLES[unlocked - 1];
}
