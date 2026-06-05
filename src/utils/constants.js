/**
 * Application Constants
 */

// LG webOS Remote Key Codes
const KEY_CODES = {
    // Navigation
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,

    // Actions
    OK: 13,        // Enter/OK
    BACK: 461,     // Back button
    EXIT: 27,      // Escape/Exit

    // Media Controls
    PLAY: 415,
    PAUSE: 19,
    STOP: 413,
    REWIND: 412,
    FAST_FORWARD: 417,

    // Color Buttons
    RED: 403,
    GREEN: 404,
    YELLOW: 405,
    BLUE: 406,

    // Number Keys
    NUM_0: 48,
    NUM_1: 49,
    NUM_2: 50,
    NUM_3: 51,
    NUM_4: 52,
    NUM_5: 53,
    NUM_6: 54,
    NUM_7: 55,
    NUM_8: 56,
    NUM_9: 57,

    // Other
    INFO: 457,
    GUIDE: 458,
    CH_UP: 33,
    CH_DOWN: 34,
    VOL_UP: 447,
    VOL_DOWN: 448,
    MUTE: 449,
    HOME: 36,
    MENU: 462
};

// Screen/Route Names
const SCREENS = {
    HOME: 'home',
    MOVIES: 'movies',
    TV_SHOWS: 'tvshows',
    EPISODES: 'episodes',
    PLAYER: 'player',
    SEARCH: 'search',
    DETAILS: 'details',
    SETTINGS: 'settings',
    FAVORITES: 'favorites'
};

// Content Types
const CONTENT_TYPES = {
    MOVIE: 'movie',
    TV_SHOW: 'tv',
    EPISODE: 'episode'
};

// Storage Keys
const STORAGE_KEYS = {
    FAVORITES: 'vidsrc_favorites',
    CONTINUE_WATCHING: 'vidsrc_continue_watching',
    SETTINGS: 'vidsrc_settings',
    SEARCH_HISTORY: 'vidsrc_search_history'
};

// Focus States
const FOCUS_STATES = {
    NONE: 'none',
    FOCUSED: 'focused',
    SELECTED: 'selected',
    DISABLED: 'disabled'
};

// Error Messages
const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network connection failed. Please check your internet.',
    TIMEOUT: 'Request timed out. Please try again.',
    NOT_FOUND: 'Content not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNKNOWN_ERROR: 'An unknown error occurred.'
};

// ISO 639-1 Language Codes (common)
const LANGUAGE_CODES = {
    ENGLISH: 'en',
    SPANISH: 'es',
    FRENCH: 'fr',
    GERMAN: 'de',
    ITALIAN: 'it',
    PORTUGUESE: 'pt',
    RUSSIAN: 'ru',
    CHINESE: 'zh',
    JAPANESE: 'ja',
    KOREAN: 'ko',
    ARABIC: 'ar',
    HINDI: 'hi',
    DUTCH: 'nl',
    POLISH: 'pl',
    TURKISH: 'tr'
};

// Grid Layout Configurations
const GRID_CONFIG = {
    HOME_ROWS: {
        ITEMS_PER_ROW: 6,
        VISIBLE_ROWS: 2
    },
    MOVIE_GRID: {
        COLUMNS: 5,
        ROWS: 3
    },
    TV_GRID: {
        COLUMNS: 5,
        ROWS: 3
    }
};
