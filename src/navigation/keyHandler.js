let currentNavMode = '5way';
const NAV_DEBOUNCE_MS = 100;    // D-pad / OK debounce
const BACK_DEBOUNCE_MS = 400;   // Back key: LG Magic Remote can double-fire
let lastNavTime = 0;
let lastBackTime = 0;

function initRemote() {
  // Mouse/Pointer events (Magic Remote Pointer Mode)
  document.addEventListener("mousemove", () => {
    if (currentNavMode !== 'pointer') {
      currentNavMode = 'pointer';
      document.body.classList.add('pointer-mode');
      document.body.classList.remove('dpad-mode');
    }
  });

  document.addEventListener("cursorStateChange", (e) => {
    const isVisible = e.detail && e.detail.visibility;
    if (isVisible) {
      currentNavMode = 'pointer';
      document.body.classList.add('pointer-mode');
      document.body.classList.remove('dpad-mode');
    } else {
      currentNavMode = '5way';
      document.body.classList.add('dpad-mode');
      document.body.classList.remove('pointer-mode');
    }
  });

  // Setup delegation for mouse hover/enter to automatically sync focus coordinates
  document.addEventListener('mouseover', (e) => {
    if (currentNavMode !== 'pointer') return;
    const focusable = e.target.closest('.focusable');
    if (!focusable) {
      // Clear visual focus when not hovering on a focusable element
      if (typeof _lastFocusedNode !== 'undefined' && _lastFocusedNode) {
        _lastFocusedNode.classList.remove('focused');
        _lastFocusedNode = null;
      }
      return;
    }

    syncFocusToElement(focusable);
  });
}

function syncFocusToElement(node) {
  const id = node.id;

  // Clear previous focused elements
  const prevFocused = document.querySelector('.focusable.focused');
  if (prevFocused && prevFocused !== node) {
    prevFocused.classList.remove('focused');
  }

  node.classList.add('focused');
  if (typeof _lastFocusedNode !== 'undefined') {
    _lastFocusedNode = node;
  }

  // Determine zones and sync coordinate state
  if (APP.screen === SCREENS.HOME) {
    if (node.classList.contains('tab-item')) {
      APP.focusZone = FOCUS_ZONES.TABBAR;
      const tabName = node.getAttribute('data-tab');
      const tabMap = ['movies', 'tv', 'search', 'watchlist', 'settings'];
      APP.focusedCol = tabMap.indexOf(tabName);
    } else if (node.classList.contains('hero-btn')) {
      APP.focusZone = FOCUS_ZONES.HERO;
      APP.focusedCol = parseInt(node.getAttribute('data-btn-index')) || 0;
    } else if (node.classList.contains('card')) {
      APP.focusZone = FOCUS_ZONES.ROWS;
      APP.focusedRow = parseInt(node.getAttribute('data-row')) || 0;
      APP.focusedCol = parseInt(node.getAttribute('data-col')) || 0;
    } else if (node.classList.contains('see-all-btn')) {
      APP.focusZone = FOCUS_ZONES.ROWS;
      const rowIdx = parseInt(node.getAttribute('data-row-idx')) || 0;
      APP.focusedRow = rowIdx;
      const rows = APP.activeTab === 'movies' ? APP.movieRows : APP.tvRows;
      const count = (rows[rowIdx] && rows[rowIdx].items) ? rows[rowIdx].items.length : 0;
      APP.focusedCol = count;
    }
  } else if (APP.screen === SCREENS.DETAIL) {
    if (node.classList.contains('detail-btn')) {
      APP.focusZone = FOCUS_ZONES.DETAIL_ACTIONS;
      APP.focusedCol = parseInt(node.getAttribute('data-btn-idx')) || 0;
    } else if (node.classList.contains('season-tab')) {
      APP.focusZone = FOCUS_ZONES.SEASONS;
      APP.focusedCol = parseInt(node.getAttribute('data-col')) || 0;
    } else if (node.classList.contains('episode-card')) {
      APP.focusZone = FOCUS_ZONES.EPISODES;
      APP.detailEpisodeRow = parseInt(node.getAttribute('data-row')) || 0;
      APP.detailEpisodeCol = parseInt(node.getAttribute('data-col')) || 0;
    } else if (node.classList.contains('cast-chip')) {
      APP.focusZone = FOCUS_ZONES.CAST;
      APP.focusedCol = parseInt(node.getAttribute('data-col')) || 0;
    } else if (id && id.startsWith('detail-card-')) {
      const parts = id.split('-');
      const zoneName = parts[2];
      const colIdx = parseInt(parts[3]) || 0;
      APP.focusZone = zoneName === 'similar' ? FOCUS_ZONES.SIMILAR : FOCUS_ZONES.RECS;
      APP.focusedCol = colIdx;
    }
  } else if (APP.screen === SCREENS.SEARCH) {
    if (node.classList.contains('tab-item')) {
      APP.focusZone = FOCUS_ZONES.TABBAR;
      const tabName = node.getAttribute('data-tab');
      const tabMap = ['movies', 'tv', 'search', 'watchlist', 'settings'];
      APP.focusedCol = tabMap.indexOf(tabName);
    } else if (node.classList.contains('keyboard-key')) {
      const parts = id.split('-');
      APP.focusZone = FOCUS_ZONES.KEYBOARD;
      APP.focusedRow = parseInt(parts[parts.length - 2]) || 0;
      APP.focusedCol = parseInt(parts[parts.length - 1]) || 0;
    } else if (id && id.startsWith('search-card-')) {
      const idx = parseInt(id.replace('search-card-', '')) || 0;
      APP.focusZone = FOCUS_ZONES.RESULTS;
      APP.focusedRow = Math.floor(idx / 4);
      APP.focusedCol = idx % 4;
    }
  } else if (APP.screen === SCREENS.SETTINGS_KEYBOARD) {
    if (node.classList.contains('keyboard-key')) {
      const parts = id.split('-');
      APP.focusZone = FOCUS_ZONES.KEYBOARD;
      APP.focusedRow = parseInt(parts[parts.length - 2]) || 0;
      APP.focusedCol = parseInt(parts[parts.length - 1]) || 0;
    }
  } else if (APP.screen === SCREENS.SETTINGS) {
    if (node.classList.contains('tab-item')) {
      APP.focusZone = FOCUS_ZONES.TABBAR;
      const tabName = node.getAttribute('data-tab');
      const tabMap = ['movies', 'tv', 'search', 'watchlist', 'settings'];
      APP.focusedCol = tabMap.indexOf(tabName);
    } else if (node.classList.contains('settings-opt-card') && node.closest('#subtitle-opt-row')) {
      APP.focusZone = FOCUS_ZONES.OPTIONS;
      const children = Array.from(document.getElementById('subtitle-opt-row').children);
      APP.focusedCol = children.indexOf(node);
    } else if (node.classList.contains('settings-opt-card') && node.closest('#provider-opt-row')) {
      APP.focusZone = FOCUS_ZONES.PROVIDER;
      const children = Array.from(document.getElementById('provider-opt-row').children);
      APP.focusedCol = children.indexOf(node);
    } else if (node.classList.contains('detail-btn')) {
      APP.focusZone = FOCUS_ZONES.BUTTONS;
      APP.focusedCol = node.id === 'settings-btn-changekey' ? 0 : 1;
    }
  } else if (APP.screen === SCREENS.GENRE) {
    if (id && id.startsWith('genre-card-')) {
      const idx = parseInt(id.replace('genre-card-', '')) || 0;
      APP.focusZone = FOCUS_ZONES.GRID;
      APP.focusedRow = Math.floor(idx / 6);
      APP.focusedCol = idx % 6;
    }
  } else if (APP.screen === SCREENS.WATCHLIST) {
    if (node.classList.contains('tab-item')) {
      APP.focusZone = FOCUS_ZONES.TABBAR;
      const tabName = node.getAttribute('data-tab');
      const tabMap = ['movies', 'tv', 'search', 'watchlist', 'settings'];
      APP.focusedCol = tabMap.indexOf(tabName);
    } else if (id && id.startsWith('watchlist-card-')) {
      const idx = parseInt(id.replace('watchlist-card-', '')) || 0;
      APP.focusZone = FOCUS_ZONES.GRID;
      APP.focusedRow = Math.floor(idx / 6);
      APP.focusedCol = idx % 6;
    }
  }
}

function handleGlobalKeydown(e) {
  const code = e.keyCode || e.which;
  const now = Date.now();

  // Force mode back to D-pad if D-pad keys are pressed
  if ([KEY_CODES.UP, KEY_CODES.DOWN, KEY_CODES.LEFT, KEY_CODES.RIGHT].includes(code)) {
    if (currentNavMode !== '5way') {
      currentNavMode = '5way';
      document.body.classList.add('dpad-mode');
      document.body.classList.remove('pointer-mode');
      updateFocusVisuals();
      e.preventDefault();
      return;
    }
  }

  // Prevent double triggers
  if (now - lastNavTime < NAV_DEBOUNCE_MS) {
    if ([KEY_CODES.UP, KEY_CODES.DOWN, KEY_CODES.LEFT, KEY_CODES.RIGHT, KEY_CODES.OK].includes(code)) {
      e.preventDefault();
    }
    return;
  }
  lastNavTime = now;

  if (code === KEY_CODES.BACK || code === 8 || code === KEY_CODES.EXIT) {
    e.preventDefault();
    // Extra debounce: LG Magic Remote often fires 2 keydown events per back press
    const backNow = Date.now();
    if (backNow - lastBackTime < BACK_DEBOUNCE_MS) return;
    lastBackTime = backNow;
    goBack();
    return;
  }

  if (code === KEY_CODES.RED) {
    e.preventDefault();
    if (APP.screen !== SCREENS.SETTINGS_KEYBOARD) {
      switchTabSearch();
    }
    return;
  }

  if (code === KEY_CODES.GREEN) {
    e.preventDefault();
    if (APP.screen === SCREENS.HOME) {
      const nextTab = APP.activeTab === 'movies' ? 'tv' : 'movies';
      switchTab(nextTab);
    }
    return;
  }

  if (code === KEY_CODES.LEFT || code === KEY_CODES.UP || code === KEY_CODES.RIGHT || code === KEY_CODES.DOWN) {
    e.preventDefault();
  }

  switch (APP.screen) {
    case SCREENS.HOME: navigateHomeScreen(code); break;
    case SCREENS.DETAIL: navigateDetailScreen(code); break;
    case SCREENS.SEARCH: navigateSearchScreen(code); break;
    case SCREENS.SETTINGS: navigateSettingsScreen(code); break;
    case SCREENS.SETTINGS_KEYBOARD: navigateSettingsKeyboard(code); break;
    case SCREENS.GENRE: navigateGenreGrid(code); break;
    case SCREENS.WATCHLIST: navigateWatchlistGrid(code); break;
    case SCREENS.PLAYER:
      handlePlayerKey(code, e);
      break;
  }
}

/**
 * In player mode the iframe owns input. We focus it so the embed's
 * built-in controls (play/pause bar, seek) receive D-pad events directly.
 * Media remote keys (PLAY, PAUSE, FF, REW) are sent via postMessage as a
 * best-effort — this only works if the embed player is coded to accept them.
 * All other keys (D-pad, OK) are NOT swallowed; the iframe receives them.
 */
function handlePlayerKey(code, e) {
  const iframe = document.getElementById('player-iframe');

  // Media keys: try postMessage to the player (best-effort, cross-origin)
  if (code === KEY_CODES.PLAY || code === KEY_CODES.PAUSE) {
    e.preventDefault();
    tryPostMessageToPlayer({ action: 'togglePlay' });
    tryPostMessageToPlayer({ event: 'command', func: 'playVideo', args: '' }); // YouTube fallback
    showPlayerHudBrief();
    return;
  }
  if (code === KEY_CODES.FAST_FORWARD) {
    e.preventDefault();
    tryPostMessageToPlayer({ action: 'seekForward', seconds: 10 });
    showPlayerHudBrief();
    return;
  }
  if (code === KEY_CODES.REWIND) {
    e.preventDefault();
    tryPostMessageToPlayer({ action: 'seekBackward', seconds: 10 });
    showPlayerHudBrief();
    return;
  }
  if (code === KEY_CODES.STOP) {
    e.preventDefault();
    closePlayer();
    return;
  }

  // For all other keys (D-pad, OK, number keys etc.) focus the iframe
  // so the embed's own built-in controls handle them.
  if (iframe && document.activeElement !== iframe) {
    iframe.focus({ preventScroll: true });
  }
  showPlayerHudBrief();
}

function tryPostMessageToPlayer(msg) {
  const iframe = document.getElementById('player-iframe');
  if (!iframe || !iframe.contentWindow) return;
  try {
    // Send to the embed origin (cross-origin; player must opt-in to receive)
    iframe.contentWindow.postMessage(JSON.stringify(msg), '*');
  } catch (_) { /* cross-origin block — silently ignored */ }
}

function showPlayerHudBrief() {
  const detail = APP.currentDetail;
  const title = detail ? (detail.title || detail.name) : 'CineStream';
  const sub = (detail && detail.media_type === 'tv')
    ? `Season ${APP.currentSeasonIndex} · Episode ${APP.currentEpisode || ''}`
    : 'Feature Movie';
  showPlayerHud(title, sub);
}

window.addEventListener('DOMContentLoaded', () => {
  initRemote();
});
