let _lastFocusedNode = null;
let _tabItemsCache = null;

// Layout dimension and offset caches to prevent reflow layout thrashing on TV
let _cachedViewportWidth = 0;
let _cachedMainHeight = 0;
let _cachedRowHeight = 0;
const _rowOffsetCache = {};

function clearLayoutCaches() {
  _cachedViewportWidth = 0;
  _cachedMainHeight = 0;
  _cachedRowHeight = 0;
  // Clear the row offset cache keys
  for (const key in _rowOffsetCache) {
    delete _rowOffsetCache[key];
  }
  _tabItemsCache = null;
}

function getViewportWidth(wrapper) {
  if (!_cachedViewportWidth && wrapper && wrapper.parentElement) {
    _cachedViewportWidth = wrapper.parentElement.clientWidth || 1728;
  }
  return _cachedViewportWidth || 1728;
}

function getMainHeight(mainNode) {
  if (!_cachedMainHeight && mainNode) {
    _cachedMainHeight = mainNode.clientHeight || 980;
  }
  return _cachedMainHeight || 980;
}

function getRowHeight(rowNode) {
  if (!_cachedRowHeight && rowNode) {
    _cachedRowHeight = rowNode.clientHeight || 344;
  }
  return _cachedRowHeight || 344;
}

function getRowOffsetTop(rowIndex, rowNode) {
  if (_rowOffsetCache[rowIndex] === undefined && rowNode) {
    _rowOffsetCache[rowIndex] = rowNode.offsetTop;
  }
  return _rowOffsetCache[rowIndex] || 0;
}

function getTabItems() {
  if (!_tabItemsCache) {
    _tabItemsCache = document.querySelectorAll('#nav-tabs .tab-item');
  }
  return _tabItemsCache;
}

function invalidateTabCache() {
  _tabItemsCache = null;
}

function updateFocusVisuals() {
  if (_lastFocusedNode) {
    _lastFocusedNode.classList.remove('focused');
    _lastFocusedNode = null;
  }

  const zone = APP.focusZone;
  const col = APP.focusedCol;
  const row = APP.focusedRow;
  let focusedNode = null;

  if (APP.screen === SCREENS.HOME) {
    if (zone === FOCUS_ZONES.TABBAR) {
      focusedNode = getTabItems()[col];
    } else if (zone === FOCUS_ZONES.HERO) {
      const heroBtns = document.getElementById('hero-buttons');
      focusedNode = heroBtns ? heroBtns.children[col] : null;
    } else if (zone === FOCUS_ZONES.ROWS) {
      focusedNode = document.getElementById(`card-${row}-${col}`);
      if (!focusedNode) {
        focusedNode = document.getElementById(`row-see-all-${row}`);
      }
    }
  } else if (APP.screen === SCREENS.DETAIL) {
    if (zone === FOCUS_ZONES.DETAIL_ACTIONS) {
      const actionRow = document.getElementById('detail-actions-row');
      focusedNode = actionRow ? actionRow.children[col] : null;
    } else if (zone === FOCUS_ZONES.SEASONS) {
      focusedNode = document.getElementById(`season-tab-${col}`);
    } else if (zone === FOCUS_ZONES.EPISODES) {
      const idx = APP.detailEpisodeRow * 4 + APP.detailEpisodeCol;
      focusedNode = document.getElementById(`episode-card-${idx}`);
    } else if (zone === FOCUS_ZONES.CAST) {
      focusedNode = document.getElementById(`cast-actor-${col}`);
    } else if (zone === FOCUS_ZONES.SIMILAR || zone === FOCUS_ZONES.RECS) {
      focusedNode = document.getElementById(`detail-card-${zone}-${col}`);
    }
  } else if (APP.screen === SCREENS.SEARCH) {
    if (zone === FOCUS_ZONES.TABBAR) {
      focusedNode = getTabItems()[col];
    } else if (zone === FOCUS_ZONES.KEYBOARD) {
      focusedNode = document.getElementById(`search-keyboard-grid-key-${row}-${col}`);
    } else if (zone === FOCUS_ZONES.RESULTS) {
      const idx = row * 4 + col;
      focusedNode = document.getElementById(`search-card-${idx}`);
    }
  } else if (APP.screen === SCREENS.SETTINGS_KEYBOARD) {
    if (zone === FOCUS_ZONES.KEYBOARD) {
      focusedNode = document.getElementById(`setup-keyboard-grid-key-${row}-${col}`);
    }
  } else if (APP.screen === SCREENS.SETTINGS) {
    if (zone === FOCUS_ZONES.TABBAR) {
      focusedNode = getTabItems()[col];
    } else if (zone === FOCUS_ZONES.OPTIONS) {
      const optRow = document.getElementById('subtitle-opt-row');
      focusedNode = optRow ? optRow.children[col] : null;
    } else if (zone === FOCUS_ZONES.BUTTONS) {
      const btnRow = document.getElementById('settings-view');
      focusedNode = btnRow ? btnRow.querySelector('.settings-btn-row').children[col] : null;
    }
  } else if (APP.screen === SCREENS.GENRE) {
    if (zone === FOCUS_ZONES.GRID) {
      const idx = row * 6 + col;
      focusedNode = document.getElementById(`genre-card-${idx}`);
    }
  } else if (APP.screen === SCREENS.WATCHLIST) {
    if (zone === FOCUS_ZONES.TABBAR) {
      focusedNode = getTabItems()[col];
    } else if (zone === FOCUS_ZONES.GRID) {
      const idx = row * 6 + col;
      focusedNode = document.getElementById(`watchlist-card-${idx}`);
    }
  }

  if (focusedNode) {
    focusedNode.classList.add('focused');
    _lastFocusedNode = focusedNode;
    focusedNode.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
      inline: 'nearest'
    });
  }
}

function positionHorizontalRow(rowIndex, cardColIndex) {
  const wrapper = document.getElementById(`row-wrapper-${rowIndex}`);
  if (!wrapper) return;
  const cardWidth = 180;
  const containerWidth = getViewportWidth(wrapper);
  const visible = Math.floor(containerWidth / cardWidth);

  let offset = 0;
  if (cardColIndex >= visible - 1) {
    offset = (cardColIndex - visible + 2) * cardWidth;
  }
  wrapper.style.transform = `translate3d(-${offset}px, 0, 0)`;
}

function positionHorizontalRelatedRow(zone, colIndex) {
  const wrapper = document.getElementById(`detail-row-wrapper-${zone}`);
  if (!wrapper) return;
  const cardWidth = 180;
  const containerWidth = getViewportWidth(wrapper);
  const visible = Math.floor(containerWidth / cardWidth);

  let offset = 0;
  if (colIndex >= visible - 1) {
    offset = (colIndex - visible + 2) * cardWidth;
  }
  wrapper.style.transform = `translate3d(-${offset}px, 0, 0)`;
}

function alignVerticalScroll() {
  if (APP.screen !== SCREENS.HOME) return;
  const rowNode = document.getElementById(`row-sec-${APP.focusedRow}`);
  if (!rowNode) return;
  const main = document.getElementById('main-content');

  if (APP.focusZone === FOCUS_ZONES.TABBAR || APP.focusZone === FOCUS_ZONES.HERO) {
    main.scrollTop = 0;
    return;
  }

  const rowTop = getRowOffsetTop(APP.focusedRow, rowNode);
  const rowHeight = getRowHeight(rowNode);
  const mainHeight = getMainHeight(main);

  const scrollTop = rowTop - (mainHeight / 2) + (rowHeight / 2);
  main.scrollTop = Math.max(0, scrollTop);
}
