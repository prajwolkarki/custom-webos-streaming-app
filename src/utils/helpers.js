/**
 * Helper Utilities
 */

class Helpers {
    /**
     * Format duration from minutes to readable string
     * @param {number} minutes 
     * @returns {string}
     */
    static formatDuration(minutes) {
        if (!minutes || minutes <= 0) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    }

    /**
     * Format date string
     * @param {string} dateString 
     * @returns {string}
     */
    static formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Truncate text with ellipsis
     * @param {string} text 
     * @param {number} maxLength 
     * @returns {string}
     */
    static truncate(text, maxLength = 100) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    /**
     * Debounce function
     * @param {Function} func 
     * @param {number} wait 
     * @returns {Function}
     */
    static debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     * @param {Function} func 
     * @param {number} limit 
     * @returns {Function}
     */
    static throttle(func, limit = 300) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if ID is IMDB format
     * @param {string} id 
     * @returns {boolean}
     */
    static isImdbId(id) {
        return /^tt\d+$/i.test(id);
    }

    /**
     * Check if ID is TMDB format (numeric)
     * @param {string} id 
     * @returns {boolean}
     */
    static isTmdbId(id) {
        return /^\d+$/.test(id);
    }

    /**
     * Generate a unique ID
     * @returns {string}
     */
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Sanitize HTML to prevent XSS
     * @param {string} str 
     * @returns {string}
     */
    static escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Parse URL parameters
     * @param {string} url 
     * @returns {Object}
     */
    static parseUrlParams(url) {
        const params = {};
        const urlObj = new URL(url);
        urlObj.searchParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    }

    /**
     * Build query string from object
     * @param {Object} params 
     * @returns {string}
     */
    static buildQueryString(params) {
        return Object.entries(params)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
    }

    /**
     * Get TMDB image URL
     * @param {string} path 
     * @param {string} size 
     * @returns {string}
     */
    static getTmdbImageUrl(path, size = 'w342') {
        if (!path) return 'assets/images/posters/placeholder.png';
        return `${CONFIG.TMDB.IMAGE_BASE}/${size}${path}`;
    }

    /**
     * Detect if running on webOS
     * @returns {boolean}
     */
    static isWebOS() {
        return navigator.userAgent.includes('Web0S') || 
               navigator.userAgent.includes('webOS') ||
               typeof webOS !== 'undefined';
    }

    /**
     * Get webOS version
     * @returns {string|null}
     */
    static getWebOSVersion() {
        if (!this.isWebOS()) return null;
        const match = navigator.userAgent.match(/Web0S\/([\d.]+)/);
        return match ? match[1] : null;
    }
}
