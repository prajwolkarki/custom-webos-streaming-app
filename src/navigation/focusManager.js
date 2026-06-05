function updateFocusVisuals() {
  document.querySelectorAll('.focused').forEach(node => {
    node.classList.remove('focused');
  });

  const zone = APP.focusZone;
  const col = APP.focusedCol;
  const row = APP.focusedRow;
  let focusedNode = null;

  if (APP.screen === SCREENS.HOME) {
    if (zone === FOCUS_ZONES.TABBAR) {
      const items = document.querySelectorAll('#nav-tabs .tab-item');
      focusedNode = items[col];
    } else if (zone === FOCUS_ZONES.HERO) {
      const btns = document.querySelectorAll('#hero-buttons .hero-btn');
      focusedNode = btns[col];
    } else if (zone === FOCUS_ZONES.ROWS) {
      focusedNode = document.getElementById(`card-${row}-${col}`);
      if (!focusedNode) {
        focusedNode = document.getElementById(`row-see-all-${row}`);
      }
    }
  } else if (APP.screen === SCREENS.DETAIL) {
    if (zone === FOCUS_ZONES.DETAIL_ACTIONS) {
      const btns = document.querySelectorAll('#detail-actions-row .detail-btn');
      focusedNode = btns[col];
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
      const items = document.querySelectorAll('#nav-tabs .tab-item');
      focusedNode = items[col];
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
      const items = document.querySelectorAll('#nav-tabs .tab-item');
      focusedNode = items[col];
    } else if (zone === FOCUS_ZONES.OPTIONS) {
      const items = document.querySelectorAll('#subtitle-opt-row .settings-opt-card');
      focusedNode = items[col];
    } else if (zone === FOCUS_ZONES.BUTTONS) {
      const btns = document.querySelectorAll('#settings-view .settings-btn-row button');
      focusedNode = btns[col];
    }
  } else if (APP.screen === SCREENS.GENRE) {
    if (zone === FOCUS_ZONES.GRID) {
      const idx = row * 6 + col;
      focusedNode = document.getElementById(`genre-card-${idx}`);
    }
  } else if (APP.screen === SCREENS.WATCHLIST) {
    if (zone === FOCUS_ZONES.TABBAR) {
      const items = document.querySelectorAll('#nav-tabs .tab-item');
      focusedNode = items[col];
    } else if (zone === FOCUS_ZONES.GRID) {
      const idx = row * 6 + col;
      focusedNode = document.getElementById(`watchlist-card-${idx}`);
    }
  }

  if (focusedNode) {
    focusedNode.classList.add('focused');
    focusedNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  }
}

function positionHorizontalRow(rowIndex, cardColIndex) {
  const wrapper = document.getElementById(`row-wrapper-${rowIndex}`);
  if (!wrapper) return;
  const cardWidth = 180;
  const containerWidth = wrapper.parentElement.clientWidth;
  const visible = Math.floor(containerWidth / cardWidth);

  let offset = 0;
  if (cardColIndex >= visible - 1) {
    offset = (cardColIndex - visible + 2) * cardWidth;
  }
  wrapper.style.transform = `translateX(-${offset}px)`;
}

function positionHorizontalRelatedRow(zone, colIndex) {
  const wrapper = document.getElementById(`detail-row-wrapper-${zone}`);
  if (!wrapper) return;
  const cardWidth = 180;
  const containerWidth = wrapper.parentElement.clientWidth;
  const visible = Math.floor(containerWidth / cardWidth);

  let offset = 0;
  if (colIndex >= visible - 1) {
    offset = (colIndex - visible + 2) * cardWidth;
  }
  wrapper.style.transform = `translateX(-${offset}px)`;
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

  const rect = rowNode.getBoundingClientRect();
  const parentRect = main.getBoundingClientRect();
  const scrollTop = rowNode.offsetTop - (parentRect.height / 2) + (rect.height / 2);
  main.scrollTo({
    top: Math.max(0, scrollTop),
    behavior: 'smooth'
  });
}
