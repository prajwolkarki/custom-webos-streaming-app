/**
 * App Configuration
 */

const CONFIG = {
    // API Endpoints
    API: {
        BASE_URL: 'https://vidsrc-embed.ru',
        MOVIE_EMBED: '/embed/movie',
        TV_EMBED: '/embed/tv',
        LATEST_MOVIES: '/movies/latest',
        LATEST_TVSHOWS: '/tvshows/latest',
        LATEST_EPISODES: '/episodes/latest'
    },

    // Optional: TMDB API for metadata/posters
    TMDB: {
        BASE_URL: 'https://api.themoviedb.org/3',
        API_KEY: '', // Add your TMDB API key here
        IMAGE_BASE: 'https://image.tmdb.org/t/p',
        POSTER_SIZE: 'w342',
        BACKDROP_SIZE: 'w1280'
    },

    // App Settings
    APP: {
        NAME: 'VidSrc Stream',
        VERSION: '1.0.0',
        DEFAULT_LANGUAGE: 'en',
        ITEMS_PER_PAGE: 20,
        MAX_RECENT_ITEMS: 10
    },

    // TV Navigation Settings
    NAVIGATION: {
        SCROLL_SPEED: 300,
        FOCUS_DEBOUNCE: 150,
        OVERSCAN_MARGIN: 60 // pixels from edge
    },

    // Player Settings
    PLAYER: {
        DEFAULT_AUTOPLAY: true,
        DEFAULT_AUTO_NEXT: false,
        DEFAULT_SUBTITLE_LANG: 'en'
    }
};

// Freeze config to prevent accidental modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.API);
Object.freeze(CONFIG.TMDB);
Object.freeze(CONFIG.APP);
Object.freeze(CONFIG.NAVIGATION);
Object.freeze(CONFIG.PLAYER);
