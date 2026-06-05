/**
 * Key Handler
 * Maps LG webOS remote keys to application actions
 */

class KeyHandler {
    constructor() {
        this.listeners = new Map();
        this.isEnabled = true;
    }

    init() {
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
        console.log('[KeyHandler] Initialized');
    }

    handleKeyDown(event) {
        if (!this.isEnabled) return;

        const keyCode = event.keyCode || event.which;

        // Prevent default browser behavior for TV navigation keys
        if ([
            KEY_CODES.LEFT, KEY_CODES.UP, KEY_CODES.RIGHT, KEY_CODES.DOWN,
            KEY_CODES.BACK, KEY_CODES.OK, KEY_CODES.PLAY, KEY_CODES.PAUSE,
            KEY_CODES.STOP, KEY_CODES.REWIND, KEY_CODES.FAST_FORWARD
        ].includes(keyCode)) {
            event.preventDefault();
        }

        // Dispatch to registered listeners
        this.dispatch(keyCode, event);

        // Global navigation handling
        this.handleGlobalNavigation(keyCode, event);
    }

    handleGlobalNavigation(keyCode, event) {
        switch (keyCode) {
            case KEY_CODES.HOME:
                window.app.navigateTo('home');
                break;

            case KEY_CODES.MENU:
                // Toggle menu or settings
                break;

            case KEY_CODES.INFO:
                // Show info overlay
                break;

            case KEY_CODES.RED:
                // Quick action: Go to Movies
                window.app.navigateTo('movies');
                break;

            case KEY_CODES.GREEN:
                // Quick action: Go to TV Shows
                window.app.navigateTo('tvshows');
                break;

            case KEY_CODES.YELLOW:
                // Quick action: Search
                window.app.navigateTo('search');
                break;

            case KEY_CODES.BLUE:
                // Quick action: Favorites
                // window.app.navigateTo('favorites');
                break;
        }
    }

    /**
     * Register a key listener
     * @param {string} name - Listener identifier
     * @param {number} keyCode - Key code to listen for
     * @param {Function} callback - Callback function
     */
    on(name, keyCode, callback) {
        if (!this.listeners.has(keyCode)) {
            this.listeners.set(keyCode, new Map());
        }
        this.listeners.get(keyCode).set(name, callback);
    }

    /**
     * Remove a key listener
     * @param {string} name - Listener identifier
     * @param {number} keyCode - Key code
     */
    off(name, keyCode) {
        if (this.listeners.has(keyCode)) {
            this.listeners.get(keyCode).delete(name);
        }
    }

    /**
     * Dispatch key event to listeners
     * @param {number} keyCode 
     * @param {Event} event 
     */
    dispatch(keyCode, event) {
        if (this.listeners.has(keyCode)) {
            this.listeners.get(keyCode).forEach((callback, name) => {
                try {
                    callback(event);
                } catch (error) {
                    console.error(`[KeyHandler] Error in listener "${name}":`, error);
                }
            });
        }
    }

    /**
     * Enable key handling
     */
    enable() {
        this.isEnabled = true;
    }

    /**
     * Disable key handling
     */
    disable() {
        this.isEnabled = false;
    }

    /**
     * Get key name from code
     * @param {number} keyCode 
     * @returns {string}
     */
    static getKeyName(keyCode) {
        const entries = Object.entries(KEY_CODES);
        const found = entries.find(([_, code]) => code === keyCode);
        return found ? found[0] : 'UNKNOWN';
    }
}

const keyHandler = new KeyHandler();
