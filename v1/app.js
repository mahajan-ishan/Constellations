/**
 * app.js — Cosmic Connections
 * Dhruva Astronomy Club
 * High-polish astrophysics-themed NYT Connections game
 */

(function () {
  'use strict';

  /* ==============================================================
     1. STARFIELD CANVAS ANIMATION (Matching Stardle)
     ============================================================== */
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, stars = [], shootingStars = [];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function randBetween(a, b) {
      return a + Math.random() * (b - a);
    }

    function createStars(count) {
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: randBetween(0.3, 1.8),
          alpha: randBetween(0.2, 1.0),
          alphaDir: Math.random() < 0.5 ? 1 : -1,
          speed: randBetween(0.003, 0.016),
        });
      }
    }

    function maybeAddShootingStar() {
      if (Math.random() < 0.005 && shootingStars.length < 3) {
        shootingStars.push({
          x: randBetween(W * 0.1, W * 0.9),
          y: randBetween(0, H * 0.4),
          len: randBetween(60, 140),
          speed: randBetween(6, 13),
          angle: randBetween(Math.PI / 6, Math.PI / 3),
          alpha: 1,
          decay: randBetween(0.012, 0.025),
        });
      }
    }

    function drawStars() {
      ctx.clearRect(0, 0, W, H);

      // Twinkling stars
      for (const s of stars) {
        s.alpha += s.alphaDir * s.speed;
        if (s.alpha >= 1 || s.alpha <= 0.15) s.alphaDir *= -1;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 238, 255, ${s.alpha})`;
        ctx.fill();
      }

      // Shooting stars
      maybeAddShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ctx.save();
        ctx.globalAlpha = ss.alpha;
        const grd = ctx.createLinearGradient(
          ss.x, ss.y,
          ss.x - Math.cos(ss.angle) * ss.len,
          ss.y - Math.sin(ss.angle) * ss.len
        );
        grd.addColorStop(0, 'rgba(255, 255, 230, 0.95)');
        grd.addColorStop(1, 'rgba(255, 255, 230, 0)');
        ctx.strokeStyle = grd;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.len, ss.y - Math.sin(ss.angle) * ss.len);
        ctx.stroke();
        ctx.restore();

        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.alpha -= ss.decay;
        if (ss.alpha <= 0) shootingStars.splice(i, 1);
      }

      requestAnimationFrame(drawStars);
    }

    window.addEventListener('resize', () => {
      resize();
      createStars(Math.min(220, Math.floor(window.innerWidth * 0.25)));
    });
    resize();
    createStars(Math.min(220, Math.floor(window.innerWidth * 0.25)));
    drawStars();
  }

  /* ==============================================================
     2. GAME STATE & CONSTANTS
     ============================================================== */
  const LEVEL_EMOJIS = ['🟨', '🟩', '🟦', '🟪'];
  const LEVEL_NAMES = ['Straightforward', 'Moderate', 'Challenging', 'Tricky / Wordplay'];

  let currentPuzzle = null;
  let remainingTiles = [];      // Array of uppercase word strings
  let selectedWords = [];       // Array of selected word strings (max 4)
  let solvedCategories = [];    // Array of solved category objects
  let mistakesRemaining = 4;
  let guessHistory = [];        // Array of arrays: each guess is an array of 4 words
  let emojiHistory = [];        // Array of 4-emoji strings for share
  let gameStatus = 'playing';   // 'playing', 'won', 'lost'

  // DOM Elements
  const gridContainer = document.getElementById('grid-container');
  const solvedList = document.getElementById('solved-categories-list');
  const mistakesDots = document.getElementById('mistakes-dots');
  const submitBtn = document.getElementById('submit-btn');
  const shuffleBtn = document.getElementById('shuffle-btn');
  const deselectBtn = document.getElementById('deselect-btn');
  const puzzleTitleDisplay = document.getElementById('puzzle-title-display');
  const toastContainer = document.getElementById('toast-container');

  /* Helper to normalize category fields whether from legacy format or current format */
  function getCategoryWords(cat) {
    return cat.words || cat.items || [];
  }
  function getCategoryName(cat) {
    return cat.name || cat.category || '';
  }
  function getCategoryLevel(cat) {
    return cat.level !== undefined ? cat.level : (cat.difficulty !== undefined ? cat.difficulty : 0);
  }
  function getCategoryDesc(cat) {
    return cat.description || cat.fact || '';
  }
  function normalizeCategory(cat) {
    return {
      level: getCategoryLevel(cat),
      name: getCategoryName(cat),
      words: getCategoryWords(cat),
      description: getCategoryDesc(cat)
    };
  }

  /* ==============================================================
     3. INITIALIZATION & STORAGE
     ============================================================== */
  function initGame(puzzleId = null) {
    if (puzzleId) {
      // Guard: don't allow playing locked puzzles
      if (!isPuzzleUnlocked(puzzleId)) {
        showToast('🔒 This puzzle unlocks on Sunday 00:00 IST!');
        return;
      }
      currentPuzzle = getPuzzleById(puzzleId);
    } else {
      currentPuzzle = getPuzzleForDate();
    }

    puzzleTitleDisplay.textContent = currentPuzzle.title;

    // Load saved game or fresh start
    const saved = loadSavedGame(currentPuzzle.id);
    if (saved) {
      solvedCategories = (saved.solvedCategories || []).map(normalizeCategory);

      // Automatically purge any tiles that belong to already solved categories
      const solvedWords = new Set();
      solvedCategories.forEach(cat => {
        cat.words.forEach(w => solvedWords.add(w.toUpperCase()));
      });

      remainingTiles = (saved.remainingTiles || [])
        .filter(w => !solvedWords.has(w.toUpperCase()));

      selectedWords = [];
      mistakesRemaining = saved.mistakesRemaining !== undefined ? saved.mistakesRemaining : 4;
      guessHistory = saved.guessHistory || [];
      emojiHistory = saved.emojiHistory || [];
      gameStatus = saved.gameStatus || 'playing';

      // Re-save sanitized state so localStorage is cleaned up
      saveCurrentGame();
    } else {
      // Gather all 16 words and shuffle
      const allWords = [];
      currentPuzzle.categories.forEach(cat => {
        cat.words.forEach(w => allWords.push(w));
      });
      remainingTiles = shuffleArray([...allWords]);
      selectedWords = [];
      solvedCategories = [];
      mistakesRemaining = 4;
      guessHistory = [];
      emojiHistory = [];
      gameStatus = 'playing';
    }

    renderSolvedCategories();
    renderGrid();
    renderMistakes();
    updateButtons();
    populateHintsModal();

    if (gameStatus === 'won') {
      setTimeout(() => showGameOverModal(true), 600);
    } else if (gameStatus === 'lost') {
      setTimeout(() => showGameOverModal(false), 600);
    }
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* ==============================================================
     4. RENDERING FUNCTIONS
     ============================================================== */
  function renderGrid() {
    gridContainer.innerHTML = '';
    remainingTiles.forEach(word => {
      const tile = document.createElement('button');
      tile.className = 'tile';
      tile.textContent = word;
      tile.setAttribute('data-word', word);
      tile.setAttribute('aria-label', word);
      tile.setAttribute('role', 'gridcell');

      if (word.length > 9) {
        tile.setAttribute('data-long', 'true');
      }

      if (selectedWords.includes(word)) {
        tile.classList.add('selected');
        tile.setAttribute('aria-selected', 'true');
      } else {
        tile.setAttribute('aria-selected', 'false');
      }

      tile.addEventListener('click', () => handleTileClick(word, tile));
      gridContainer.appendChild(tile);
    });
  }

  function renderSolvedCategories() {
    solvedList.innerHTML = '';
    solvedCategories.forEach(cat => {
      const banner = document.createElement('div');
      banner.className = `solved-banner level-${cat.level}`;
      banner.innerHTML = `
        <div class="banner-category-name">${cat.name}</div>
        <div class="banner-category-words">${cat.words.join(', ')}</div>
        <button class="banner-fact-toggle" aria-label="Toggle astrophysics fact">🔭 ASTRO INSIGHT ▾</button>
        <div class="banner-fact-text">${cat.description}</div>
      `;

      const toggleBtn = banner.querySelector('.banner-fact-toggle');
      const factText = banner.querySelector('.banner-fact-text');
      toggleBtn.addEventListener('click', () => {
        const isOpen = factText.classList.toggle('open');
        toggleBtn.textContent = isOpen ? '🔭 ASTRO INSIGHT ▴' : '🔭 ASTRO INSIGHT ▾';
      });

      solvedList.appendChild(banner);
    });
  }

  function renderMistakes() {
    mistakesDots.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot';
      if (i >= mistakesRemaining) {
        dot.classList.add('lost');
      }
      mistakesDots.appendChild(dot);
    }
  }

  function updateButtons() {
    submitBtn.disabled = (selectedWords.length !== 4) || (gameStatus !== 'playing');
    deselectBtn.disabled = (selectedWords.length === 0) || (gameStatus !== 'playing');
    shuffleBtn.disabled = (remainingTiles.length === 0) || (gameStatus !== 'playing');
  }

  /* ==============================================================
     5. GAMEPLAY LOGIC
     ============================================================== */
  function handleTileClick(word, tileEl) {
    if (gameStatus !== 'playing') return;

    const idx = selectedWords.indexOf(word);
    if (idx > -1) {
      // Deselect
      selectedWords.splice(idx, 1);
      tileEl.classList.remove('selected');
      tileEl.setAttribute('aria-selected', 'false');
    } else {
      // Select (if under limit 4)
      if (selectedWords.length >= 4) return;
      selectedWords.push(word);
      tileEl.classList.add('selected');
      tileEl.setAttribute('aria-selected', 'true');
    }

    updateButtons();
  }

  // Deselect All
  deselectBtn.addEventListener('click', () => {
    selectedWords = [];
    document.querySelectorAll('.tile.selected').forEach(t => {
      t.classList.remove('selected');
      t.setAttribute('aria-selected', 'false');
    });
    updateButtons();
  });

  // Shuffle
  shuffleBtn.addEventListener('click', () => {
    remainingTiles = shuffleArray([...remainingTiles]);
    renderGrid();
  });

  // Submit Guess
  submitBtn.addEventListener('click', handleGuessSubmission);

  function handleGuessSubmission() {
    if (selectedWords.length !== 4 || gameStatus !== 'playing') return;

    // Check if already guessed
    const sortedCurrent = [...selectedWords].sort().join('|');
    const alreadyGuessed = guessHistory.some(g => [...g].sort().join('|') === sortedCurrent);
    if (alreadyGuessed) {
      showToast('Already guessed!');
      shakeSelectedTiles();
      return;
    }

    // Record guess in history
    guessHistory.push([...selectedWords]);

    // Check if it matches any remaining category
    const remainingCategories = currentPuzzle.categories.filter(
      c => !solvedCategories.some(sc => sc.name === c.name)
    );

    let matchedCategory = null;
    for (const cat of remainingCategories) {
      const matchCount = selectedWords.filter(w => cat.words.includes(w)).length;
      if (matchCount === 4) {
        matchedCategory = cat;
        break;
      }
    }

    // Record emoji row
    recordEmojiGuess(selectedWords);

    if (matchedCategory) {
      // SUCCESS!
      handleCorrectCategory(matchedCategory);
    } else {
      // INCORRECT
      handleIncorrectGuess(remainingCategories);
      saveCurrentGame();
    }
  }

  function recordEmojiGuess(words) {
    const emojis = words.map(w => {
      const cat = currentPuzzle.categories.find(c => c.words.includes(w));
      return cat ? LEVEL_EMOJIS[cat.level] : '⬜';
    });
    emojiHistory.push(emojis.join(''));
  }

  function handleCorrectCategory(category) {
    solvedCategories.push(category);

    // Immediately filter remainingTiles so state and storage are always consistent
    const catWordsSet = new Set(category.words.map(w => w.toUpperCase()));
    remainingTiles = remainingTiles.filter(w => !catWordsSet.has(w.toUpperCase()));
    selectedWords = [];
    saveCurrentGame();

    // Disable controls while animation plays
    submitBtn.disabled = true;
    deselectBtn.disabled = true;
    shuffleBtn.disabled = true;

    // Animate removing tiles with staggered delay
    const selectedEls = Array.from(document.querySelectorAll('.tile.selected'));
    selectedEls.forEach((el, i) => {
      el.disabled = true;
      setTimeout(() => el.classList.add('clearing'), i * 60);
    });

    const totalAnimTime = 60 * (selectedEls.length - 1) + 350;

    setTimeout(() => {
      renderSolvedCategories();
      renderGrid();
      updateButtons();
      saveCurrentGame();

      // Check win condition
      if (solvedCategories.length === 4) {
        gameStatus = 'won';
        saveCurrentGame();
        recordGameStats(true);
        setTimeout(() => showGameOverModal(true), 700);
      }
    }, totalAnimTime);
  }

  function handleIncorrectGuess(remainingCategories) {
    shakeSelectedTiles();

    // Check "One away..." condition (3 matches in any category)
    let isOneAway = false;
    for (const cat of remainingCategories) {
      const matchCount = selectedWords.filter(w => cat.words.includes(w)).length;
      if (matchCount === 3) {
        isOneAway = true;
        break;
      }
    }

    if (isOneAway) {
      showToast('One away...');
    }

    mistakesRemaining--;
    renderMistakes();

    if (mistakesRemaining <= 0) {
      // LOSS / GAME OVER
      gameStatus = 'lost';
      saveCurrentGame();
      recordGameStats(false);
      showToast('Cosmic collapse! Revealing categories...');
      setTimeout(revealRemainingCategories, 1000);
    }
  }

  function shakeSelectedTiles() {
    const selectedEls = document.querySelectorAll('.tile.selected');
    selectedEls.forEach(el => {
      el.classList.add('shake');
      setTimeout(() => el.classList.remove('shake'), 450);
    });
  }

  function revealRemainingCategories() {
    const unsolved = currentPuzzle.categories.filter(
      c => !solvedCategories.some(sc => sc.name === c.name)
    );

    let delay = 0;
    unsolved.forEach(cat => {
      setTimeout(() => {
        solvedCategories.push(cat);
        remainingTiles = remainingTiles.filter(w => !cat.words.includes(w));
        renderSolvedCategories();
        renderGrid();
      }, delay);
      delay += 550;
    });

    setTimeout(() => {
      showGameOverModal(false);
    }, delay + 600);
  }

  /* ==============================================================
     6. TOAST SYSTEM
     ============================================================== */
  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2400);
  }

  /* ==============================================================
     7. MODALS & POPUPS
     ============================================================== */
  function setupModals() {
    // Open buttons
    document.getElementById('how-to-play-btn').addEventListener('click', () => openModal('how-to-play-modal'));
    document.getElementById('hint-btn').addEventListener('click', () => openModal('hint-modal'));
    document.getElementById('stats-btn').addEventListener('click', () => {
      renderStatsModal();
      openModal('stats-modal');
    });
    document.getElementById('archive-btn').addEventListener('click', () => {
      renderArchiveModal();
      openModal('archive-modal');
    });

    // Close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close');
        closeModal(modalId);
      });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(bd => {
      bd.addEventListener('click', (e) => {
        if (e.target === bd) closeModal(bd.id);
      });
    });

    // Close on ESC key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.open').forEach(bd => closeModal(bd.id));
      }
    });

    // Share result button
    document.getElementById('share-btn').addEventListener('click', shareResult);

    // Next puzzle button
    document.getElementById('next-puzzle-btn').addEventListener('click', () => {
      closeModal('game-over-modal');
      const nextIdx = (currentPuzzle.id % ASTRO_PUZZLES.length) + 1;
      initGame(nextIdx);
    });

    // Reset puzzle buttons (header and game over modal)
    const resetBtn = document.getElementById('reset-puzzle-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => resetCurrentPuzzle(true));
    }
    const replayBtn = document.getElementById('replay-puzzle-btn');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        closeModal('game-over-modal');
        resetCurrentPuzzle(false);
      });
    }
  }

  function resetCurrentPuzzle(askConfirm = true) {
    if (askConfirm && !confirm('Restart this puzzle from scratch? All selections and solved categories for this puzzle will be reset.')) {
      return;
    }
    try {
      localStorage.removeItem(`dhruva_connections_save_${currentPuzzle.id}`);
    } catch (e) {
      console.warn('Could not clear saved state:', e);
    }
    closeModal('game-over-modal');
    initGame(currentPuzzle.id);
    showToast('Puzzle restarted!');
  }

  // Quick debug/helper accessible in console if needed
  window.resetConnections = function(all = false) {
    if (all) {
      Object.keys(localStorage)
        .filter(k => k.startsWith('dhruva_connections_'))
        .forEach(k => localStorage.removeItem(k));
      showToast('All puzzles & stats reset!');
    } else {
      localStorage.removeItem(`dhruva_connections_save_${currentPuzzle.id}`);
      showToast('Current puzzle reset!');
    }
    initGame(currentPuzzle.id);
  };

  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function populateHintsModal() {
    const list = document.getElementById('hints-list');
    list.innerHTML = '';

    const LEVEL_COLORS = [
      { name: 'YELLOW', emoji: '🟨', class: 'hint-level-0', bg: 'var(--color-yellow-bg)', text: 'var(--color-yellow-text)' },
      { name: 'GREEN', emoji: '🟩', class: 'hint-level-1', bg: 'var(--color-green-bg)', text: 'var(--color-green-text)' },
      { name: 'BLUE', emoji: '🟦', class: 'hint-level-2', bg: 'var(--color-blue-bg)', text: 'var(--color-blue-text)' },
      { name: 'PURPLE', emoji: '🟪', class: 'hint-level-3', bg: 'var(--color-purple-bg)', text: 'var(--color-purple-text)' }
    ];

    currentPuzzle.categories.forEach(cat => {
      const info = LEVEL_COLORS[cat.level] || LEVEL_COLORS[0];
      const card = document.createElement('div');
      card.className = `hint-card ${info.class}`;

      card.innerHTML = `
        <div class="hint-card-header">
          <span class="hint-category-badge" style="display: flex; align-items: center; gap: 8px;">
            <span class="hint-color-dot" style="background: ${info.bg}; border: 1px solid #000000;"></span>
            ${info.name}
          </span>
          <button class="hint-reveal-btn" data-revealed="false">
            <span>Reveal Hint</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
        <div class="hint-body" style="display: none;">
          <p class="hint-category-name">${cat.name}</p>
        </div>
      `;

      const btn = card.querySelector('.hint-reveal-btn');
      const body = card.querySelector('.hint-body');

      btn.addEventListener('click', () => {
        const isRevealed = btn.getAttribute('data-revealed') === 'true';
        if (isRevealed) {
          body.style.display = 'none';
          btn.setAttribute('data-revealed', 'false');
          btn.classList.remove('active');
          btn.querySelector('span').textContent = 'Reveal Hint';
          btn.querySelector('svg').style.transform = 'rotate(0deg)';
        } else {
          body.style.display = 'block';
          btn.setAttribute('data-revealed', 'true');
          btn.classList.add('active');
          btn.querySelector('span').textContent = 'Hide Hint';
          btn.querySelector('svg').style.transform = 'rotate(180deg)';
        }
      });

      list.appendChild(card);
    });
  }

  function showGameOverModal(isWin) {
    const title = document.getElementById('game-over-title');
    const msg = document.getElementById('game-over-message');
    const preview = document.getElementById('emoji-result-preview');
    const catContainer = document.getElementById('game-over-categories');

    title.textContent = isWin ? 'COSMIC MASTERY!' : 'DEEP SPACE LOST!';
    msg.textContent = isWin
      ? 'Outstanding astrophysicist! You solved all four celestial groups.'
      : 'Gravity pulled you into a black hole! Here are the true connections:';

    preview.innerHTML = emojiHistory.join('<br>');

    // Populate categories breakdown
    catContainer.innerHTML = '';
    currentPuzzle.categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = `insight-card level-${cat.level}`;
      card.innerHTML = `
        <div class="insight-name">${LEVEL_EMOJIS[cat.level]} ${cat.name}</div>
        <div class="insight-words">${cat.words.join(', ')}</div>
        <div class="insight-desc">${cat.description}</div>
      `;
      catContainer.appendChild(card);
    });

    openModal('game-over-modal');
  }

  function shareResult() {
    const text = `Dhruva Constellations\n${currentPuzzle.title}\n\n${emojiHistory.join('\n')}\n\nPlay at: https://teamdhruva.com`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied result to clipboard!');
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('Copied result to clipboard!');
    } catch (e) {
      showToast('Failed to copy');
    }
    document.body.removeChild(ta);
  }

  /* ==============================================================
     8. STATS & ARCHIVE IMPLEMENTATION
     ============================================================== */
  const STATS_KEY = 'dhruva_connections_stats';

  function getStats() {
    try {
      return JSON.parse(localStorage.getItem(STATS_KEY)) || {
        played: 0,
        won: 0,
        currentStreak: 0,
        maxStreak: 0,
        distribution: { 4: 0, 5: 0, 6: 0, 7: 0 } // guesses needed to win
      };
    } catch (e) {
      return { played: 0, won: 0, currentStreak: 0, maxStreak: 0, distribution: { 4: 0, 5: 0, 6: 0, 7: 0 } };
    }
  }

  function recordGameStats(isWin) {
    const stats = getStats();
    stats.played++;
    if (isWin) {
      stats.won++;
      stats.currentStreak++;
      if (stats.currentStreak > stats.maxStreak) {
        stats.maxStreak = stats.currentStreak;
      }
      const guesses = guessHistory.length;
      if (stats.distribution[guesses] !== undefined) {
        stats.distribution[guesses]++;
      }
    } else {
      stats.currentStreak = 0;
    }
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }

  function renderStatsModal() {
    const stats = getStats();
    document.getElementById('stat-played').textContent = stats.played;
    const winPct = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
    document.getElementById('stat-win-pct').textContent = `${winPct}%`;
    document.getElementById('stat-streak').textContent = stats.currentStreak;
    document.getElementById('stat-max-streak').textContent = stats.maxStreak;

    const distContainer = document.getElementById('guess-distribution');
    distContainer.innerHTML = '';
    const maxVal = Math.max(1, ...Object.values(stats.distribution));

    [4, 5, 6, 7].forEach(num => {
      const count = stats.distribution[num] || 0;
      const pct = Math.max(7, Math.round((count / maxVal) * 100));
      const row = document.createElement('div');
      row.className = 'dist-row';
      row.innerHTML = `
        <span>${num}</span>
        <div class="dist-bar-wrap">
          <div class="dist-bar" style="width: ${pct}%">${count}</div>
        </div>
      `;
      distContainer.appendChild(row);
    });
  }

  function renderArchiveModal() {
    const list = document.getElementById('archive-list');
    list.innerHTML = '';

    ASTRO_PUZZLES.forEach(puzzle => {
      const unlocked = isPuzzleUnlocked(puzzle.id);
      const card = document.createElement('div');
      card.className = `archive-card ${puzzle.id === currentPuzzle.id ? 'active-puzzle' : ''} ${!unlocked ? 'locked-puzzle' : ''}`;

      const save = loadSavedGame(puzzle.id);
      const isCompleted = unlocked && save && (save.gameStatus === 'won' || save.gameStatus === 'lost');

      card.innerHTML = `
        <div>
          <div class="archive-info-title">${puzzle.title}</div>
          <div class="archive-info-date">${unlocked ? puzzle.date : 'Unlocks Sunday 00:00 IST'}</div>
        </div>
        <div class="archive-badge ${isCompleted ? 'completed' : ''} ${!unlocked ? 'locked-badge' : ''}">
          ${!unlocked ? '🔒' : isCompleted ? (save.gameStatus === 'won' ? '★ SOLVED' : 'COMPLETED') : 'PLAY'}
        </div>
      `;

      if (unlocked) {
        card.addEventListener('click', () => {
          closeModal('archive-modal');
          initGame(puzzle.id);
        });
      }

      list.appendChild(card);
    });
  }

  /* ==============================================================
     9. PERSISTENCE
     ============================================================== */
  function saveCurrentGame() {
    if (!currentPuzzle) return;
    const data = {
      remainingTiles,
      solvedCategories,
      mistakesRemaining,
      guessHistory,
      emojiHistory,
      gameStatus
    };
    try {
      localStorage.setItem(`dhruva_connections_save_${currentPuzzle.id}`, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save game state:', e);
    }
  }

  function loadSavedGame(puzzleId) {
    try {
      const raw = localStorage.getItem(`dhruva_connections_save_${puzzleId}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /* ==============================================================
     8. VIEW BACKGROUND PHOTO FEATURE (FULL SCROLLABLE PHOTO)
     ============================================================== */
  function setupPhotoView() {
    const viewPhotoBtn = document.getElementById('view-photo-btn');
    if (!viewPhotoBtn) return;

    viewPhotoBtn.addEventListener('click', () => {
      openModal('photo-viewer-modal');
    });
  }

  /* ==============================================================
     9. WEEKLY IST COUNTDOWN TIMER (EVERY SUNDAY 00:00 IST)
     ============================================================== */
  function getNextSundayMidnightIST() {
    // Current time in UTC epoch ms
    const now = new Date();
    // Offset for IST is +5 hours 30 mins (330 minutes)
    const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
    const nowIST = new Date(now.getTime() + IST_OFFSET_MS);

    // Calculate days until next Sunday (0 is Sunday, 1 Monday, ... 6 Saturday)
    const currentDay = nowIST.getUTCDay(); // Day in IST
    let daysUntilSunday = (7 - currentDay) % 7;
    // If today is Sunday, check if it's already past 00:00 IST
    if (daysUntilSunday === 0) {
      daysUntilSunday = 7;
    }

    // Next Sunday 00:00:00 IST in IST local terms
    const nextSundayISTYear = nowIST.getUTCFullYear();
    const nextSundayISTMonth = nowIST.getUTCMonth();
    const nextSundayISTDate = nowIST.getUTCDate() + daysUntilSunday;

    // Build UTC timestamp for next Sunday 00:00:00 IST
    // Date.UTC(year, month, date, 0, 0, 0) gives epoch when IST is midnight,
    // so we subtract IST_OFFSET_MS to get actual UTC time.
    const targetUTC = Date.UTC(nextSundayISTYear, nextSundayISTMonth, nextSundayISTDate, 0, 0, 0) - IST_OFFSET_MS;
    return targetUTC;
  }

  function setupWeeklyCountdownTimer() {
    const headerEl = document.getElementById('header-countdown');
    const modalEl = document.getElementById('modal-countdown');

    function update() {
      const targetTime = getNextSundayMidnightIST();
      const now = Date.now();
      const diff = Math.max(0, targetTime - now);

      const totalSec = Math.floor(diff / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;

      const pad = (n) => String(n).padStart(2, '0');

      if (headerEl) {
        if (days > 0) {
          headerEl.textContent = `${days}d ${hours}h ${pad(mins)}m`;
        } else {
          headerEl.textContent = `${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
        }
      }

      if (modalEl) {
        modalEl.textContent = `${days}d ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
      }
    }

    update();
    setInterval(update, 1000);
  }

  // Run on DOM loaded
  document.addEventListener('DOMContentLoaded', () => {
    setupModals();
    setupPhotoView();
    setupWeeklyCountdownTimer();
    initGame();
  });

})();
