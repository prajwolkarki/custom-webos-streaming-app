function loadLocalStorage() {
  const key = localStorage.getItem(STORAGE_KEYS.TMDB_API_KEY);
  if (key && key.trim() !== '') {
    APP.tmdbApiKey = key;
  }
  const sub = localStorage.getItem(STORAGE_KEYS.SUBTITLE_LANG);
  if (sub !== null) {
    APP.subtitleLang = sub;
  }
  const provider = localStorage.getItem(STORAGE_KEYS.STREAM_PROVIDER);
  if (provider && (provider === PROVIDERS.VIDSRC || provider === PROVIDERS.VIDLINK)) {
    APP.streamProvider = provider;
  }
  try {
    const watch = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    if (watch) {
      APP.watchlist = JSON.parse(watch);
    }
  } catch (e) {
    console.error("Failed to load watchlist", e);
    APP.watchlist = [];
  }
}

function saveWatchlist() {
  localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(APP.watchlist));
}

function updateSubtitlePreferenceVisual() {
  document.querySelectorAll('#subtitle-opt-row .settings-opt-card').forEach(card => {
    if (card.dataset.lang === APP.subtitleLang) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

function updateProviderPreferenceVisual() {
  document.querySelectorAll('#provider-opt-row .settings-opt-card').forEach(card => {
    if (card.dataset.provider === APP.streamProvider) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}
