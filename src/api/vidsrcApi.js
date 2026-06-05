/**
 * VidSrc API Wrapper
 * Handles all interactions with vidsrc-embed.ru endpoints
 */

class VidSrcAPI {
    static get baseUrl() {
        return CONFIG.API.BASE_URL;
    }

    /**
     * Get latest movies
     * @param {number} page - Page number
     * @returns {Promise<Array>} Array of movie objects
     */
    static async getLatestMovies(page = 1) {
        const url = `${this.baseUrl}${CONFIG.API.LATEST_MOVIES}/page-${page}.json`;
        try {
            const data = await request.get(url);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('[VidSrcAPI] Failed to fetch latest movies:', error);
            return [];
        }
    }

    /**
     * Get latest TV shows
     * @param {number} page - Page number
     * @returns {Promise<Array>} Array of TV show objects
     */
    static async getLatestTVShows(page = 1) {
        const url = `${this.baseUrl}${CONFIG.API.LATEST_TVSHOWS}/page-${page}.json`;
        try {
            const data = await request.get(url);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('[VidSrcAPI] Failed to fetch latest TV shows:', error);
            return [];
        }
    }

    /**
     * Get latest episodes
     * @param {number} page - Page number
     * @returns {Promise<Array>} Array of episode objects
     */
    static async getLatestEpisodes(page = 1) {
        const url = `${this.baseUrl}${CONFIG.API.LATEST_EPISODES}/page-${page}.json`;
        try {
            const data = await request.get(url);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('[VidSrcAPI] Failed to fetch latest episodes:', error);
            return [];
        }
    }

    /**
     * Get movie embed URL
     * @param {string} id - IMDB or TMDB ID
     * @param {Object} options - Optional parameters
     * @returns {string} Embed URL
     */
    static getMovieEmbedUrl(id, options = {}) {
        return URLBuilder.buildMovieUrl(id, options);
    }

    /**
     * Get TV show embed URL
     * @param {string} id - IMDB or TMDB ID
     * @param {number} season - Season number
     * @param {number} episode - Episode number
     * @param {Object} options - Optional parameters
     * @returns {string} Embed URL
     */
    static getEpisodeEmbedUrl(id, season, episode, options = {}) {
        return URLBuilder.buildEpisodeUrl(id, season, episode, options);
    }

    /**
     * Get TV show base embed URL (without season/episode)
     * @param {string} id - IMDB or TMDB ID
     * @param {Object} options - Optional parameters
     * @returns {string} Embed URL
     */
    static getTVShowEmbedUrl(id, options = {}) {
        const params = new URLSearchParams();

        if (id.startsWith('tt')) {
            params.append('imdb', id);
        } else {
            params.append('tmdb', id);
        }

        if (options.ds_lang) {
            params.append('ds_lang', options.ds_lang);
        }

        const queryString = params.toString();
        return `${this.baseUrl}${CONFIG.API.TV_EMBED}${queryString ? '?' + queryString : ''}`;
    }
}
