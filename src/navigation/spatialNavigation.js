/**
 * Spatial Navigation
 * Handles arrow key navigation between focusable elements
 */

class SpatialNavigation {
    constructor() {
        this.enabled = true;
        this.focusableSelector = '.focusable';
        this.currentContainer = null;
    }

    init() {
        // Register arrow key handlers
        keyHandler.on('spatial-nav', KEY_CODES.LEFT, () => this.navigate('left'));
        keyHandler.on('spatial-nav', KEY_CODES.RIGHT, () => this.navigate('right'));
        keyHandler.on('spatial-nav', KEY_CODES.UP, () => this.navigate('up'));
        keyHandler.on('spatial-nav', KEY_CODES.DOWN, () => this.navigate('down'));
        keyHandler.on('spatial-nav', KEY_CODES.OK, () => this.activate());

        console.log('[SpatialNavigation] Initialized');
    }

    /**
     * Navigate in a direction
     * @param {string} direction - 'up', 'down', 'left', 'right'
     */
    navigate(direction) {
        if (!this.enabled) return;

        const current = focusManager.getCurrentFocus();
        if (!current) {
            // Focus first focusable element
            const first = this.getFirstFocusable();
            if (first) {
                focusManager.setFocus(first);
            }
            return;
        }

        // Find nearest focusable in direction
        const next = focusManager.findNearestFocusable(current, direction);
        if (next) {
            focusManager.setFocus(next);
        }
    }

    /**
     * Activate currently focused element (simulate click)
     */
    activate() {
        const current = focusManager.getCurrentFocus();
        if (current) {
            current.click();
            current.dispatchEvent(new Event('activate'));
        }
    }

    /**
     * Get all focusable elements
     * @returns {NodeList}
     */
    getFocusables() {
        return document.querySelectorAll(this.focusableSelector);
    }

    /**
     * Get first focusable element
     * @returns {HTMLElement|null}
     */
    getFirstFocusable() {
        const focusables = this.getFocusables();
        for (let el of focusables) {
            if (focusManager.isVisible(el)) {
                return el;
            }
        }
        return null;
    }

    /**
     * Add focusable elements from a container
     * @param {HTMLElement} container 
     */
    addFocusables(container) {
        const focusables = container.querySelectorAll(this.focusableSelector);

        focusables.forEach(el => {
            // Ensure tabindex
            if (!el.hasAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }

            // Add click handler for mouse/touch (for testing on PC)
            el.addEventListener('mouseenter', () => {
                if (this.enabled) {
                    focusManager.setFocus(el);
                }
            });
        });

        // Auto-focus first element if no focus exists
        if (!focusManager.getCurrentFocus()) {
            const first = this.getFirstFocusable();
            if (first) {
                focusManager.setFocus(first);
            }
        }
    }

    /**
     * Remove focusable elements from tracking
     * @param {HTMLElement} container 
     */
    removeFocusables(container) {
        const focusables = container.querySelectorAll(this.focusableSelector);
        focusables.forEach(el => {
            el.classList.remove('focused');
        });
    }

    /**
     * Enable spatial navigation
     */
    enable() {
        this.enabled = true;
    }

    /**
     * Disable spatial navigation
     */
    disable() {
        this.enabled = false;
    }

    /**
     * Set focus to a specific element by selector
     * @param {string} selector 
     */
    focus(selector) {
        const element = document.querySelector(selector);
        if (element) {
            focusManager.setFocus(element);
        }
    }
}

const spatialNavigation = new SpatialNavigation();
