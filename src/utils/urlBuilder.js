/**
 * URL Builder
 * Constructs VidSrc embed URLs with proper parameters
 */

class URLBuilder {
    static get baseUrl() {
        return CONFIG.API.BASE_URL;
    }

    /**
     * Build movie embed URL
     * @param {string} id - IMDB ID (tt...) or TMDB ID (numeric)
     * @param {Object} options
     * @param {string} options.ds_lang - Default subtitle language (ISO 639-1)
     * @param {string} options.sub_url - URL encoded subtitle file URL
     * @param {boolean} options.autoplay - Enable autoplay
     * @returns {string} Complete embed URL
     */
    static buildMovieUrl(id, options = {}) {
        const params = new URLSearchParams();

        // Determine if IMDB or TMDB ID
        if (Helpers.isImdbId(id)) {
            params.append('imdb', id);
        } else if (Helpers.isTmdbId(id)) {
            params.append('tmdb', id);
        } else {
            // Assume path-based URL
            return `${this.baseUrl}${CONFIG.API.MOVIE_EMBED}/${id}`;
        }

        // Add optional parameters
        if (options.ds_lang) {
            params.append('ds_lang', options.ds_lang);
        }

        if (options.sub_url) {
            params.append('sub_url', encodeURIComponent(options.sub_url));
        }

        if (options.autoplay !== undefined) {
            params.append('autoplay', options.autoplay ? '1' : '0');
        }

        const queryString = params.toString();
        return `${this.baseUrl}${CONFIG.API.MOVIE_EMBED}?${queryString}`;
    }

    /**
     * Build TV show base embed URL (without season/episode)
     * @param {string} id - IMDB ID or TMDB ID
     * @param {Object} options
     * @param {string} options.ds_lang - Default subtitle language
     * @returns {string} Complete embed URL
     */
    static buildTVShowUrl(id, options = {}) {
        const params = new URLSearchParams();

        if (Helpers.isImdbId(id)) {
            params.append('imdb', id);
        } else if (Helpers.isTmdbId(id)) {
            params.append('tmdb', id);
        } else {
            return `${this.baseUrl}${CONFIG.API.TV_EMBED}/${id}`;
        }

        if (options.ds_lang) {
            params.append('ds_lang', options.ds_lang);
        }

        const queryString = params.toString();
        return `${this.baseUrl}${CONFIG.API.TV_EMBED}?${queryString}`;
    }

    /**
     * Build episode embed URL
     * @param {string} id - IMDB ID or TMDB ID
     * @param {number} season - Season number
     * @param {number} episode - Episode number
     * @param {Object} options
     * @param {string} options.ds_lang - Default subtitle language
     * @param {string} options.sub_url - URL encoded subtitle file URL
     * @param {boolean} options.autoplay - Enable autoplay
     * @param {boolean} options.autonext - Enable auto next episode
     * @returns {string} Complete embed URL
     */
    static buildEpisodeUrl(id, season, episode, options = {}) {
        const params = new URLSearchParams();

        if (Helpers.isImdbId(id)) {
            params.append('imdb', id);
        } else if (Helpers.isTmdbId(id)) {
            params.append('tmdb', id);
        } else {
            // Path-based URL
            return `${this.baseUrl}${CONFIG.API.TV_EMBED}/${id}/${season}-${episode}`;
        }

        // Required parameters
        params.append('season', season);
        params.append('episode', episode);

        // Optional parameters
        if (options.ds_lang) {
            params.append('ds_lang', options.ds_lang);
        }

        if (options.sub_url) {
            params.append('sub_url', encodeURIComponent(options.sub_url));
        }

        if (options.autoplay !== undefined) {
            params.append('autoplay', options.autoplay ? '1' : '0');
        }

        if (options.autonext !== undefined) {
            params.append('autonext', options.autonext ? '1' : '0');
        }

        const queryString = params.toString();
        return `${this.baseUrl}${CONFIG.API.TV_EMBED}?${queryString}`;
    }

    /**
     * Build latest movies list URL
     * @param {number} page - Page number
     * @returns {string}
     */
    static getLatestMoviesUrl(page = 1) {
        return `${this.baseUrl}${CONFIG.API.LATEST_MOVIES}/page-${page}.json`;
    }

    /**
     * Build latest TV shows list URL
     * @param {number} page - Page number
     * @returns {string}
     */
    static getLatestTVShowsUrl(page = 1) {
        return `${this.baseUrl}${CONFIG.API.LATEST_TVSHOWS}/page-${page}.json`;
    }

    /**
     * Build latest episodes list URL
     * @param {number} page - Page number
     * @returns {string}
     */
    static getLatestEpisodesUrl(page = 1) {
        return `${this.baseUrl}${CONFIG.API.LATEST_EPISODES}/page-${page}.json`;
    }

    /**
     * Build TMDB API URL
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Query parameters
     * @returns {string}
     */
    static buildTmdbUrl(endpoint, params = {}) {
        const queryParams = new URLSearchParams({
            api_key: CONFIG.TMDB.API_KEY,
            language: CONFIG.APP.DEFAULT_LANGUAGE,
            ...params
        });
        return `${CONFIG.TMDB.BASE_URL}${endpoint}?${queryParams.toString()}`;
    }
}
