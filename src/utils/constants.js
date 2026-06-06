const KEY_CODES = {
  LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40,
  OK: 13, BACK: 461, EXIT: 27,
  PLAY: 415, PAUSE: 19, STOP: 413,
  REWIND: 412, FAST_FORWARD: 417,
  RED: 403, GREEN: 404, YELLOW: 405, BLUE: 406,
  NUM_0: 48, NUM_1: 49, NUM_2: 50, NUM_3: 51, NUM_4: 52,
  NUM_5: 53, NUM_6: 54, NUM_7: 55, NUM_8: 56, NUM_9: 57,
  INFO: 457, GUIDE: 458, CH_UP: 33, CH_DOWN: 34,
  VOL_UP: 447, VOL_DOWN: 448, MUTE: 449, HOME: 36, MENU: 462
};

const SCREENS = {
  HOME: 'home', DETAIL: 'detail', PLAYER: 'player',
  SEARCH: 'search', WATCHLIST: 'watchlist', SETTINGS: 'settings',
  GENRE: 'genre', SETTINGS_KEYBOARD: 'settings-keyboard'
};

const CONTENT_TYPES = { MOVIE: 'movie', TV: 'tv', EPISODE: 'episode' };

const STORAGE_KEYS = {
  TMDB_API_KEY: 'tmdb_api_key',
  SUBTITLE_LANG: 'subtitle_lang',
  WATCHLIST: 'watchlist',
  FAVORITES: 'vidsrc_favorites',
  CONTINUE_WATCHING: 'vidsrc_continue_watching',
  SETTINGS: 'vidsrc_settings',
  SEARCH_HISTORY: 'vidsrc_search_history',
  STREAM_PROVIDER: 'stream_provider'
};

const PROVIDERS = {
  VIDSRC: 'vidsrc',
  VIDLINK: 'vidlink'
};

const FOCUS_ZONES = {
  TABBAR: 'tabbar', HERO: 'hero', ROWS: 'rows',
  DETAIL_ACTIONS: 'detail-actions', SEASONS: 'seasons',
  EPISODES: 'episodes', CAST: 'cast', SIMILAR: 'similar',
  RECS: 'recs', KEYBOARD: 'keyboard', RESULTS: 'results',
  GRID: 'grid', OPTIONS: 'options', BUTTONS: 'buttons',
  PROVIDER: 'provider'
};
