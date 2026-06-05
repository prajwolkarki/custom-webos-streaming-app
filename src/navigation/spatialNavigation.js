function navigateHomeScreen(code) {
  const rows = APP.activeTab === 'movies' ? APP.movieRows : APP.tvRows;
  const tabsCount = 5;

  switch (code) {
    case KEY_CODES.LEFT:
      if (APP.focusZone === FOCUS_ZONES.TABBAR) APP.focusedCol = Math.max(0, APP.focusedCol - 1);
      else if (APP.focusZone === FOCUS_ZONES.HERO) APP.focusedCol = Math.max(0, APP.focusedCol - 1);
      else if (APP.focusZone === FOCUS_ZONES.ROWS) {
        if (APP.focusedCol > 0) {
          APP.focusedCol -= 1;
          positionHorizontalRow(APP.focusedRow, APP.focusedCol);
        }
      }
      break;
    case KEY_CODES.RIGHT:
      if (APP.focusZone === FOCUS_ZONES.TABBAR) APP.focusedCol = Math.min(tabsCount - 1, APP.focusedCol + 1);
      else if (APP.focusZone === FOCUS_ZONES.HERO) APP.focusedCol = Math.min(1, APP.focusedCol + 1);
      else if (APP.focusZone === FOCUS_ZONES.ROWS) {
        const rowItemsCount = rows[APP.focusedRow].items.length;
        if (APP.focusedCol < rowItemsCount - 1) {
          APP.focusedCol += 1;
          positionHorizontalRow(APP.focusedRow, APP.focusedCol);
          if (APP.focusedCol === rowItemsCount - 3) {
            const row = rows[APP.focusedRow];
            row.page += 1;
            loadRowItems(row, APP.focusedRow, true).catch(err => console.error(err));
          }
        }
      }
      break;
    case KEY_CODES.UP:
      if (APP.focusZone === FOCUS_ZONES.ROWS) {
        APP.rowColMemory[APP.focusedRow] = APP.focusedCol;
        if (APP.focusedRow === 0) {
          APP.focusZone = FOCUS_ZONES.HERO;
          APP.focusedCol = 0;
        } else {
          APP.focusedRow -= 1;
          APP.focusedCol = APP.rowColMemory[APP.focusedRow] || 0;
        }
      } else if (APP.focusZone === FOCUS_ZONES.HERO) {
        APP.focusZone = FOCUS_ZONES.TABBAR;
        APP.focusedCol = APP.activeTab === 'movies' ? 0 : 1;
      }
      break;
    case KEY_CODES.DOWN:
      if (APP.focusZone === FOCUS_ZONES.TABBAR) {
        APP.focusZone = FOCUS_ZONES.HERO;
        APP.focusedCol = 0;
      } else if (APP.focusZone === FOCUS_ZONES.HERO) {
        APP.focusZone = FOCUS_ZONES.ROWS;
        APP.focusedRow = 0;
        APP.focusedCol = APP.rowColMemory[0] || 0;
      } else if (APP.focusZone === FOCUS_ZONES.ROWS) {
        if (APP.focusedRow < rows.length - 1) {
          APP.rowColMemory[APP.focusedRow] = APP.focusedCol;
          APP.focusedRow += 1;
          APP.focusedCol = APP.rowColMemory[APP.focusedRow] || 0;
        }
      }
      break;
    case KEY_CODES.OK:
      triggerHomeEnterAction(rows);
      return;
  }
  updateFocusVisuals();
  alignVerticalScroll();
}

function triggerHomeEnterAction(rows) {
  if (APP.focusZone === FOCUS_ZONES.TABBAR) {
    const tabsMap = ['movies', 'tv', 'search', 'watchlist', 'settings'];
    const selectedTab = tabsMap[APP.focusedCol];
    if (selectedTab === 'movies' || selectedTab === 'tv') switchTab(selectedTab);
    else if (selectedTab === 'search') switchTabSearch();
    else if (selectedTab === 'watchlist') switchTabWatchlist();
    else if (selectedTab === 'settings') switchTabSettings();
  } else if (APP.focusZone === FOCUS_ZONES.HERO) {
    const item = APP.heroItems[APP.heroIndex];
    if (item) {
      if (APP.focusedCol === 0) {
        showDetailScreen(item.id, item.media_type || APP.activeTab).then(() => {
          launchPlayer(item.id, item.media_type || APP.activeTab);
        });
      } else {
        showDetailScreen(item.id, item.media_type || APP.activeTab);
      }
    }
  } else if (APP.focusZone === FOCUS_ZONES.ROWS) {
    const card = document.getElementById(`card-${APP.focusedRow}-${APP.focusedCol}`);
    if (card) {
      const id = card.getAttribute('data-id');
      const type = card.getAttribute('data-type');
      showDetailScreen(id, type);
    } else {
      const seeAll = document.getElementById(`row-see-all-${APP.focusedRow}`);
      if (seeAll) {
        const rowData = rows[APP.focusedRow];
        const match = rowData.endpoint.match(/with_genres=([0-9,]+)/);
        const genreId = match ? match[1] : '';
        loadGenreBrowseScreen(genreId, rowData.title, rowData.type);
      }
    }
  }
}

function navigateDetailScreen(code) {
  const zone = APP.detailZones[APP.detailZoneIndex];
  const detail = APP.currentDetail;

  switch (code) {
    case KEY_CODES.LEFT:
      if (zone === FOCUS_ZONES.DETAIL_ACTIONS) APP.focusedCol = Math.max(0, APP.focusedCol - 1);
      else if (zone === FOCUS_ZONES.SEASONS) {
        if (APP.focusedCol > 0) { APP.focusedCol -= 1; triggerSeasonShiftDebounce(); }
      } else if (zone === FOCUS_ZONES.EPISODES) {
        if (APP.detailEpisodeCol > 0) APP.detailEpisodeCol -= 1;
        else if (APP.detailEpisodeRow > 0) { APP.detailEpisodeRow -= 1; APP.detailEpisodeCol = 3; }
      } else if (zone === FOCUS_ZONES.CAST) APP.focusedCol = Math.max(0, APP.focusedCol - 1);
      else if (zone === FOCUS_ZONES.SIMILAR || zone === FOCUS_ZONES.RECS) {
        if (APP.focusedCol > 0) { APP.focusedCol -= 1; positionHorizontalRelatedRow(zone, APP.focusedCol); }
      }
      break;
    case KEY_CODES.RIGHT:
      if (zone === FOCUS_ZONES.DETAIL_ACTIONS) APP.focusedCol = Math.min(2, APP.focusedCol + 1);
      else if (zone === FOCUS_ZONES.SEASONS) {
        const count = detail.seasons ? detail.seasons.length : 0;
        if (APP.focusedCol < count - 1) { APP.focusedCol += 1; triggerSeasonShiftDebounce(); }
      } else if (zone === FOCUS_ZONES.EPISODES) {
        const total = APP.currentSeasonEpisodes.length;
        const currentIdx = APP.detailEpisodeRow * 4 + APP.detailEpisodeCol;
        if (currentIdx < total - 1) {
          if (APP.detailEpisodeCol < 3) APP.detailEpisodeCol += 1;
          else { APP.detailEpisodeRow += 1; APP.detailEpisodeCol = 0; }
        }
      } else if (zone === FOCUS_ZONES.CAST) {
        const count = detail.credits && detail.credits.cast ? detail.credits.cast.length : 0;
        APP.focusedCol = Math.min(Math.min(count, 8) - 1, APP.focusedCol + 1);
      } else if (zone === FOCUS_ZONES.SIMILAR || zone === FOCUS_ZONES.RECS) {
        const list = zone === FOCUS_ZONES.SIMILAR ? detail.similar : detail.recommendations;
        if (APP.focusedCol < list.length - 1) { APP.focusedCol += 1; positionHorizontalRelatedRow(zone, APP.focusedCol); }
      }
      break;
    case KEY_CODES.UP:
      if (APP.detailZoneIndex > 0) {
        if (zone === FOCUS_ZONES.EPISODES && APP.detailEpisodeRow > 0) {
          APP.detailEpisodeRow -= 1;
        } else {
          APP.detailZoneMemory[zone] = zone === FOCUS_ZONES.EPISODES ? [APP.detailEpisodeRow, APP.detailEpisodeCol] : APP.focusedCol;
          APP.detailZoneIndex -= 1;
          const newZone = APP.detailZones[APP.detailZoneIndex];
          APP.focusZone = newZone;
          const mem = APP.detailZoneMemory[newZone];
          if (newZone === FOCUS_ZONES.EPISODES) {
            APP.detailEpisodeRow = mem ? mem[0] : 0;
            APP.detailEpisodeCol = mem ? mem[1] : 0;
          } else {
            APP.focusedCol = mem !== undefined ? mem : 0;
          }
        }
      }
      break;
    case KEY_CODES.DOWN:
      if (APP.detailZoneIndex < APP.detailZones.length - 1) {
        if (zone === FOCUS_ZONES.EPISODES) {
          const total = APP.currentSeasonEpisodes.length;
          const totalRows = Math.ceil(total / 4);
          if (APP.detailEpisodeRow < totalRows - 1) {
            APP.detailEpisodeRow += 1;
            const nextIdx = APP.detailEpisodeRow * 4 + APP.detailEpisodeCol;
            if (nextIdx >= total) APP.detailEpisodeCol = total % 4 - 1;
            break;
          }
        }
        APP.detailZoneMemory[zone] = zone === FOCUS_ZONES.EPISODES ? [APP.detailEpisodeRow, APP.detailEpisodeCol] : APP.focusedCol;
        APP.detailZoneIndex += 1;
        const newZone = APP.detailZones[APP.detailZoneIndex];
        APP.focusZone = newZone;
        if (newZone === FOCUS_ZONES.EPISODES) {
          APP.detailEpisodeRow = 0; APP.detailEpisodeCol = 0;
        } else {
          APP.focusedCol = APP.detailZoneMemory[newZone] !== undefined ? APP.detailZoneMemory[newZone] : 0;
        }
      }
      break;
    case KEY_CODES.OK:
      triggerDetailEnterAction(zone);
      return;
  }
  updateFocusVisuals();
}

function triggerDetailEnterAction(zone) {
  const detail = APP.currentDetail;
  if (!detail) return;

  if (zone === FOCUS_ZONES.DETAIL_ACTIONS) {
    if (APP.focusedCol === 0) {
      if (detail.media_type === 'movie') launchPlayer(detail.id, 'movie');
      else {
        const firstEp = APP.currentSeasonEpisodes[0];
        const epNum = firstEp ? firstEp.episode_number : 1;
        launchPlayer(detail.id, 'tv', APP.currentSeasonIndex, epNum);
      }
    } else if (APP.focusedCol === 1) toggleWatchlist();
    else if (APP.focusedCol === 2) launchTrailer();
  } else if (zone === FOCUS_ZONES.EPISODES) {
    const idx = APP.detailEpisodeRow * 4 + APP.detailEpisodeCol;
    const episode = APP.currentSeasonEpisodes[idx];
    if (episode) launchPlayer(detail.id, 'tv', APP.currentSeasonIndex, episode.episode_number);
  } else if (zone === FOCUS_ZONES.SIMILAR || zone === FOCUS_ZONES.RECS) {
    const list = zone === FOCUS_ZONES.SIMILAR ? detail.similar : detail.recommendations;
    const item = list[APP.focusedCol];
    if (item) showDetailScreen(item.id, item.media_type || detail.media_type);
  }
}

let seasonTabTimer = null;
function triggerSeasonShiftDebounce() {
  document.querySelectorAll('#season-tabs .season-tab').forEach((tab, idx) => {
    if (idx === APP.focusedCol) tab.classList.add('active');
    else tab.classList.remove('active');
  });
  if (seasonTabTimer) clearTimeout(seasonTabTimer);
  seasonTabTimer = setTimeout(async () => {
    const tab = document.getElementById(`season-tab-${APP.focusedCol}`);
    if (tab) {
      const sNum = tab.getAttribute('data-season-number');
      await loadSeasonEpisodes(APP.currentDetail.id, sNum);
    }
  }, 300);
}

function navigateSearchScreen(code) {
  switch (code) {
    case KEY_CODES.LEFT:
      if (APP.focusZone === FOCUS_ZONES.TABBAR) APP.focusedCol = Math.max(0, APP.focusedCol - 1);
      else if (APP.focusZone === FOCUS_ZONES.KEYBOARD) APP.focusedCol = Math.max(0, APP.focusedCol - 1);
      else if (APP.focusZone === FOCUS_ZONES.RESULTS) { if (APP.focusedCol > 0) APP.focusedCol -= 1; }
      break;
    case KEY_CODES.RIGHT:
      if (APP.focusZone === FOCUS_ZONES.TABBAR) APP.focusedCol = Math.min(4, APP.focusedCol + 1);
      else if (APP.focusZone === FOCUS_ZONES.KEYBOARD) {
        const rowKeys = KEYBOARD_LAYOUT[APP.focusedRow];
        APP.focusedCol = Math.min(rowKeys.length - 1, APP.focusedCol + 1);
      } else if (APP.focusZone === FOCUS_ZONES.RESULTS) {
        const resultsNode = document.getElementById('search-results-grid');
        const total = resultsNode.querySelectorAll('.card').length;
        const currentIdx = APP.focusedRow * 4 + APP.focusedCol;
        if (currentIdx < total - 1) {
          if (APP.focusedCol < 3) APP.focusedCol += 1;
          else { APP.focusedRow += 1; APP.focusedCol = 0; }
        }
      }
      break;
    case KEY_CODES.UP:
      if (APP.focusZone === FOCUS_ZONES.KEYBOARD) {
        if (APP.focusedRow === 0) { APP.focusZone = FOCUS_ZONES.TABBAR; APP.focusedCol = 2; }
        else {
          APP.focusedRow -= 1;
          const rowKeys = KEYBOARD_LAYOUT[APP.focusedRow];
          APP.focusedCol = Math.min(rowKeys.length - 1, APP.focusedCol);
        }
      } else if (APP.focusZone === FOCUS_ZONES.RESULTS) {
        if (APP.focusedRow > 0) APP.focusedRow -= 1;
        else { APP.focusZone = FOCUS_ZONES.KEYBOARD; APP.focusedRow = 4; APP.focusedCol = 0; }
      }
      break;
    case KEY_CODES.DOWN:
      if (APP.focusZone === FOCUS_ZONES.TABBAR) { APP.focusZone = FOCUS_ZONES.KEYBOARD; APP.focusedRow = 0; APP.focusedCol = 2; }
      else if (APP.focusZone === FOCUS_ZONES.KEYBOARD) {
        if (APP.focusedRow < 4) {
          APP.focusedRow += 1;
          const rowKeys = KEYBOARD_LAYOUT[APP.focusedRow];
          APP.focusedCol = Math.min(rowKeys.length - 1, APP.focusedCol);
        } else {
          const resultsNode = document.getElementById('search-results-grid');
          const total = resultsNode.querySelectorAll('.card').length;
          if (total > 0) { APP.focusZone = FOCUS_ZONES.RESULTS; APP.focusedRow = 0; APP.focusedCol = 0; }
        }
      } else if (APP.focusZone === FOCUS_ZONES.RESULTS) {
        const resultsNode = document.getElementById('search-results-grid');
        const total = resultsNode.querySelectorAll('.card').length;
        const totalRows = Math.ceil(total / 4);
        if (APP.focusedRow < totalRows - 1) {
          APP.focusedRow += 1;
          const currentIdx = APP.focusedRow * 4 + APP.focusedCol;
          if (currentIdx >= total) APP.focusedCol = total % 4 - 1;
        }
      }
      break;
    case KEY_CODES.OK:
      triggerSearchEnterAction();
      return;
  }
  updateFocusVisuals();
}

function triggerSearchEnterAction() {
  if (APP.focusZone === FOCUS_ZONES.TABBAR) {
    const tabsMap = ['movies', 'tv', 'search', 'watchlist', 'settings'];
    const tab = tabsMap[APP.focusedCol];
    if (tab === 'movies' || tab === 'tv') switchTab(tab);
    if (tab === 'watchlist') switchTabWatchlist();
    if (tab === 'settings') switchTabSettings();
  } else if (APP.focusZone === FOCUS_ZONES.KEYBOARD) {
    const key = KEYBOARD_LAYOUT[APP.focusedRow][APP.focusedCol];
    if (key === 'SPACE') APP.searchQuery += ' ';
    else if (key === 'BACKSPACE') APP.searchQuery = APP.searchQuery.slice(0, -1);
    else if (key === 'CLEAR') APP.searchQuery = '';
    else if (key === 'CLOSE') { goBack(); return; }
    else APP.searchQuery += key;
    updateSearchInputDisplay();
    triggerSearchTextChange();
  } else if (APP.focusZone === FOCUS_ZONES.RESULTS) {
    const idx = APP.focusedRow * 4 + APP.focusedCol;
    const card = document.getElementById(`search-card-${idx}`);
    if (card) {
      const id = card.getAttribute('data-id');
      const type = card.getAttribute('data-type');
      showDetailScreen(id, type);
    }
  }
  updateFocusVisuals();
}

function navigateSettingsScreen(code) {
  const optsCount = 6;
  switch (code) {
    case KEY_CODES.LEFT:
      if (APP.focusZone === FOCUS_ZONES.TABBAR) APP.focusedCol = Math.max(0, APP.focusedCol - 1);
      else if (APP.focusZone === FOCUS_ZONES.OPTIONS) APP.focusedCol = Math.max(0, APP.focusedCol - 1);
      else if (APP.focusZone === FOCUS_ZONES.BUTTONS) APP.focusedCol = Math.max(0, APP.focusedCol - 1);
      break;
    case KEY_CODES.RIGHT:
      if (APP.focusZone === FOCUS_ZONES.TABBAR) APP.focusedCol = Math.min(4, APP.focusedCol + 1);
      else if (APP.focusZone === FOCUS_ZONES.OPTIONS) APP.focusedCol = Math.min(optsCount - 1, APP.focusedCol + 1);
      else if (APP.focusZone === FOCUS_ZONES.BUTTONS) APP.focusedCol = Math.min(1, APP.focusedCol + 1);
      break;
    case KEY_CODES.UP:
      if (APP.focusZone === FOCUS_ZONES.OPTIONS) { APP.focusZone = FOCUS_ZONES.TABBAR; APP.focusedCol = 4; }
      else if (APP.focusZone === FOCUS_ZONES.BUTTONS) { APP.focusZone = FOCUS_ZONES.OPTIONS; APP.focusedCol = 0; }
      break;
    case KEY_CODES.DOWN:
      if (APP.focusZone === FOCUS_ZONES.TABBAR) { APP.focusZone = FOCUS_ZONES.OPTIONS; APP.focusedCol = 0; }
      else if (APP.focusZone === FOCUS_ZONES.OPTIONS) { APP.focusZone = FOCUS_ZONES.BUTTONS; APP.focusedCol = 0; }
      break;
    case KEY_CODES.OK:
      triggerSettingsEnterAction();
      return;
  }
  updateFocusVisuals();
}

function triggerSettingsEnterAction() {
  if (APP.focusZone === FOCUS_ZONES.TABBAR) {
    const tabsMap = ['movies', 'tv', 'search', 'watchlist', 'settings'];
    const tab = tabsMap[APP.focusedCol];
    if (tab === 'movies' || tab === 'tv') switchTab(tab);
    if (tab === 'search') switchTabSearch();
    if (tab === 'watchlist') switchTabWatchlist();
  } else if (APP.focusZone === FOCUS_ZONES.OPTIONS) {
    const item = document.querySelectorAll('#subtitle-opt-row .settings-opt-card')[APP.focusedCol];
    if (item) {
      const lang = item.getAttribute('data-lang');
      APP.subtitleLang = lang;
      localStorage.setItem(STORAGE_KEYS.SUBTITLE_LANG, lang);
      updateSubtitlePreferenceVisual();
      showToast(`Subtitle preference updated to: ${lang || 'None'}`);
    }
  } else if (APP.focusZone === FOCUS_ZONES.BUTTONS) {
    if (APP.focusedCol === 0) openSetupScreen();
    else {
      localStorage.clear();
      showToast("Cache Cleared. Reloading...", false);
      setTimeout(() => window.location.reload(), 1000);
    }
  }
  updateFocusVisuals();
}

function navigateSettingsKeyboard(code) {
  switch (code) {
    case KEY_CODES.LEFT: APP.focusedCol = Math.max(0, APP.focusedCol - 1); break;
    case KEY_CODES.RIGHT:
      const rowKeys = KEYBOARD_LAYOUT[APP.focusedRow];
      APP.focusedCol = Math.min(rowKeys.length - 1, APP.focusedCol + 1);
      break;
    case KEY_CODES.UP:
      if (APP.focusedRow > 0) {
        APP.focusedRow -= 1;
        const upRowKeys = KEYBOARD_LAYOUT[APP.focusedRow];
        APP.focusedCol = Math.min(upRowKeys.length - 1, APP.focusedCol);
      }
      break;
    case KEY_CODES.DOWN:
      if (APP.focusedRow < 4) {
        APP.focusedRow += 1;
        const downRowKeys = KEYBOARD_LAYOUT[APP.focusedRow];
        APP.focusedCol = Math.min(downRowKeys.length - 1, APP.focusedCol);
      }
      break;
    case KEY_CODES.OK:
      triggerSettingsKeyboardEnterAction();
      return;
  }
  updateFocusVisuals();
}

async function triggerSettingsKeyboardEnterAction() {
  const key = KEYBOARD_LAYOUT[APP.focusedRow][APP.focusedCol];
  if (key === 'SPACE') APP.setupQuery += ' ';
  else if (key === 'BACKSPACE') APP.setupQuery = APP.setupQuery.slice(0, -1);
  else if (key === 'CLEAR') APP.setupQuery = '';
  else if (key === 'CLOSE') {
    if (APP.tmdbApiKey && APP.tmdbApiKey !== 'YOUR_TMDB_API_KEY') {
      document.getElementById('setup-screen').classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
      goBack();
    } else {
      showToast("A valid TMDB API key is required.", true);
    }
    return;
  } else APP.setupQuery += key;

  updateSetupInputDisplay();

  if (APP.setupQuery.trim().length >= 32) {
    showLoading(true, 'Validating Key...');
    const isValid = await validateTmdbKey(APP.setupQuery.trim());
    showLoading(false);

    if (isValid) {
      APP.tmdbApiKey = APP.setupQuery.trim();
      localStorage.setItem(STORAGE_KEYS.TMDB_API_KEY, APP.tmdbApiKey);
      showToast("TMDB API Key configured successfully!");
      document.getElementById('setup-screen').classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
      await initApplication();
    } else {
      showToast("Invalid key. Double check values.", true);
    }
  }
  updateFocusVisuals();
}

function navigateGenreGrid(code) {
  const itemsCount = APP.genreGridItems.length;
  switch (code) {
    case KEY_CODES.LEFT:
      if (APP.focusedCol > 0) APP.focusedCol -= 1;
      break;
    case KEY_CODES.RIGHT:
      const nextIdx = APP.focusedRow * 6 + (APP.focusedCol + 1);
      if (nextIdx < itemsCount) APP.focusedCol += 1;
      break;
    case KEY_CODES.UP:
      if (APP.focusedRow > 0) APP.focusedRow -= 1;
      else { goBack(); return; }
      break;
    case KEY_CODES.DOWN:
      const totalRows = Math.ceil(itemsCount / 6);
      if (APP.focusedRow < totalRows - 1) {
        APP.focusedRow += 1;
        const idx = APP.focusedRow * 6 + APP.focusedCol;
        if (idx >= itemsCount) APP.focusedCol = itemsCount % 6 - 1;
        if (APP.focusedRow === totalRows - 2 && !APP.genreLoading) {
          fetchGenreGridPage().catch(err => console.error(err));
        }
      }
      break;
    case KEY_CODES.OK:
      const idx = APP.focusedRow * 6 + APP.focusedCol;
      const card = document.getElementById(`genre-card-${idx}`);
      if (card) {
        const id = card.getAttribute('data-id');
        const type = card.getAttribute('data-type');
        showDetailScreen(id, type);
      }
      return;
  }
  updateFocusVisuals();
}

function navigateWatchlistGrid(code) {
  const total = APP.watchlist.length;
  switch (code) {
    case KEY_CODES.LEFT:
      if (APP.focusZone === FOCUS_ZONES.TABBAR) APP.focusedCol = Math.max(0, APP.focusedCol - 1);
      else if (APP.focusZone === FOCUS_ZONES.GRID) { if (APP.focusedCol > 0) APP.focusedCol -= 1; }
      break;
    case KEY_CODES.RIGHT:
      if (APP.focusZone === FOCUS_ZONES.TABBAR) APP.focusedCol = Math.min(4, APP.focusedCol + 1);
      else if (APP.focusZone === FOCUS_ZONES.GRID) {
        const currentIdx = APP.focusedRow * 6 + APP.focusedCol;
        if (currentIdx < total - 1) {
          if (APP.focusedCol < 5) APP.focusedCol += 1;
          else { APP.focusedRow += 1; APP.focusedCol = 0; }
        }
      }
      break;
    case KEY_CODES.UP:
      if (APP.focusZone === FOCUS_ZONES.GRID) {
        if (APP.focusedRow > 0) APP.focusedRow -= 1;
        else { APP.focusZone = FOCUS_ZONES.TABBAR; APP.focusedCol = 3; }
      }
      break;
    case KEY_CODES.DOWN:
      if (APP.focusZone === FOCUS_ZONES.TABBAR) {
        if (total > 0) { APP.focusZone = FOCUS_ZONES.GRID; APP.focusedRow = 0; APP.focusedCol = 0; }
      } else if (APP.focusZone === FOCUS_ZONES.GRID) {
        const totalRows = Math.ceil(total / 6);
        if (APP.focusedRow < totalRows - 1) {
          APP.focusedRow += 1;
          const idx = APP.focusedRow * 6 + APP.focusedCol;
          if (idx >= total) APP.focusedCol = total % 6 - 1;
        }
      }
      break;
    case KEY_CODES.OK:
      if (APP.focusZone === FOCUS_ZONES.TABBAR) {
        const tabsMap = ['movies', 'tv', 'search', 'watchlist', 'settings'];
        const tab = tabsMap[APP.focusedCol];
        if (tab === 'movies' || tab === 'tv') switchTab(tab);
        if (tab === 'search') switchTabSearch();
        if (tab === 'settings') switchTabSettings();
      } else if (APP.focusZone === FOCUS_ZONES.GRID) {
        const idx = APP.focusedRow * 6 + APP.focusedCol;
        const item = APP.watchlist[idx];
        if (item) showDetailScreen(item.id, item.media_type);
      }
      return;
  }
  updateFocusVisuals();
}
