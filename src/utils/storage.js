/**
 * Local Storage Manager
 * Handles favorites, continue watching, and settings
 */

class StorageManager {
    constructor() {
        this.prefix = 'vidsrc_';
    }

    /**
     * Get item from localStorage
     * @param {string} key 
     * @returns {any}
     */
    get(key) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('[StorageManager] Failed to get item:', error);
            return null;
        }
    }

    /**
     * Set item in localStorage
     * @param {string} key 
     * @param {any} value 
     */
    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
        } catch (error) {
            console.error('[StorageManager] Failed to set item:', error);
        }
    }

    /**
     * Remove item from localStorage
     * @param {string} key 
     */
    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
        } catch (error) {
            console.error('[StorageManager] Failed to remove item:', error);
        }
    }

    /**
     * Clear all app data
     */
    clear() {
        try {
            Object.keys(localStorage)
                .filter(key => key.startsWith(this.prefix))
                .forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.error('[StorageManager] Failed to clear storage:', error);
        }
    }

    // Favorites Methods
    getFavorites() {
        return this.get('favorites') || [];
    }

    addFavorite(item) {
        const favorites = this.getFavorites();
        if (!favorites.find(f => f.id === item.id)) {
            favorites.push({
                ...item,
                addedAt: new Date().toISOString()
            });
            this.set('favorites', favorites);
        }
    }

    removeFavorite(id) {
        const favorites = this.getFavorites().filter(f => f.id !== id);
        this.set('favorites', favorites);
    }

    isFavorite(id) {
        return this.getFavorites().some(f => f.id === id);
    }

    // Continue Watching Methods
    getContinueWatching() {
        return this.get('continue_watching') || [];
    }

    addContinueWatching(item) {
        let history = this.getContinueWatching();

        // Remove if already exists
        history = history.filter(h => h.id !== item.id);

        // Add to front
        history.unshift({
            ...item,
            watchedAt: new Date().toISOString()
        });

        // Limit to max items
        if (history.length > CONFIG.APP.MAX_RECENT_ITEMS) {
            history = history.slice(0, CONFIG.APP.MAX_RECENT_ITEMS);
        }

        this.set('continue_watching', history);
    }

    removeContinueWatching(id) {
        const history = this.getContinueWatching().filter(h => h.id !== id);
        this.set('continue_watching', history);
    }

    // Settings Methods
    getSettings() {
        return this.get('settings') || {
            language: CONFIG.APP.DEFAULT_LANGUAGE,
            autoplay: CONFIG.PLAYER.DEFAULT_AUTOPLAY,
            autoNext: CONFIG.PLAYER.DEFAULT_AUTO_NEXT,
            subtitleLang: CONFIG.PLAYER.DEFAULT_SUBTITLE_LANG
        };
    }

    updateSettings(settings) {
        const current = this.getSettings();
        this.set('settings', { ...current, ...settings });
    }

    // Search History
    getSearchHistory() {
        return this.get('search_history') || [];
    }

    addSearchQuery(query) {
        let history = this.getSearchHistory();
        history = history.filter(q => q !== query);
        history.unshift(query);
        if (history.length > 10) history = history.slice(0, 10);
        this.set('search_history', history);
    }

    clearSearchHistory() {
        this.remove('search_history');
    }
}

const storage = new StorageManager();
