function handleGlobalKeydown(e) {
  const code = e.keyCode;
  const now = Date.now();
  if (now - lastKeyPressTime < 50) {
    e.preventDefault();
    return;
  }
  lastKeyPressTime = now;

  if (code === KEY_CODES.BACK || code === 8 || code === KEY_CODES.EXIT) {
    e.preventDefault();
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
      showPlayerHud(
        APP.currentDetail ? (APP.currentDetail.title || APP.currentDetail.name) : 'CineStream',
        APP.currentDetail?.media_type === 'tv' ? `Season ${APP.currentSeasonIndex} - Episode ${APP.currentEpisode}` : 'Feature movie'
      );
      if (code === KEY_CODES.OK) closePlayer();
      break;
  }
}
