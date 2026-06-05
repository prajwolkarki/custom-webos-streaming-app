/**
 * Focus Manager
 * Handles focus states and visual indicators for TV navigation
 */

class FocusManager {
    constructor() {
        this.currentFocus = null;
        this.focusHistory = [];
        this.focusClasses = {
            focused: 'focused',
            selected: 'selected'
        };
    }

    init() {
        console.log('[FocusManager] Initialized');
    }

    /**
     * Set focus on an element
     * @param {HTMLElement} element 
     * @param {boolean} saveHistory - Whether to save to focus history
     */
    setFocus(element, saveHistory = true) {
        if (!element) return;

        // Remove focus from current element
        if (this.currentFocus) {
            this.currentFocus.classList.remove(this.focusClasses.focused);
            this.currentFocus.blur();
        }

        // Set focus on new element
        this.currentFocus = element;
        element.classList.add(this.focusClasses.focused);
        element.focus();

        // Scroll element into view if needed
        this.scrollIntoView(element);

        // Save to history
        if (saveHistory) {
            this.focusHistory.push(element);
            if (this.focusHistory.length > 50) {
                this.focusHistory.shift();
            }
        }

        // Dispatch focus event
        element.dispatchEvent(new CustomEvent('tvfocus', { 
            detail: { element, previous: this.currentFocus } 
        }));
    }

    /**
     * Get currently focused element
     * @returns {HTMLElement|null}
     */
    getCurrentFocus() {
        return this.currentFocus;
    }

    /**
     * Move focus to previous element in history
     */
    focusPrevious() {
        if (this.focusHistory.length > 1) {
            this.focusHistory.pop(); // Remove current
            const previous = this.focusHistory.pop();
            if (previous && document.contains(previous)) {
                this.setFocus(previous, false);
            }
        }
    }

    /**
     * Scroll element into view with TV-safe margins
     * @param {HTMLElement} element 
     */
    scrollIntoView(element) {
        const rect = element.getBoundingClientRect();
        const margin = CONFIG.NAVIGATION.OVERSCAN_MARGIN;

        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Check if element is outside viewport
        const isAbove = rect.top < margin;
        const isBelow = rect.bottom > viewportHeight - margin;
        const isLeft = rect.left < margin;
        const isRight = rect.right > viewportWidth - margin;

        if (isAbove || isBelow) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: isAbove ? 'start' : 'end'
            });
        }

        if (isLeft || isRight) {
            element.scrollIntoView({
                behavior: 'smooth',
                inline: isLeft ? 'start' : 'end'
            });
        }
    }

    /**
     * Find the nearest focusable element in a direction
     * @param {HTMLElement} fromElement 
     * @param {string} direction - 'up', 'down', 'left', 'right'
     * @returns {HTMLElement|null}
     */
    findNearestFocusable(fromElement, direction) {
        const focusables = Array.from(document.querySelectorAll('.focusable'));
        const fromRect = fromElement.getBoundingClientRect();
        const fromCenter = {
            x: fromRect.left + fromRect.width / 2,
            y: fromRect.top + fromRect.height / 2
        };

        let nearest = null;
        let minDistance = Infinity;

        focusables.forEach(element => {
            if (element === fromElement) return;
            if (!this.isVisible(element)) return;

            const rect = element.getBoundingClientRect();
            const center = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };

            // Check if element is in the correct direction
            const isInDirection = this.isInDirection(fromCenter, center, direction);
            if (!isInDirection) return;

            const distance = this.calculateDistance(fromCenter, center);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = element;
            }
        });

        return nearest;
    }

    /**
     * Check if point2 is in the specified direction from point1
     */
    isInDirection(from, to, direction) {
        const dx = to.x - from.x;
        const dy = to.y - from.y;

        switch (direction) {
            case 'left': return dx < 0 && Math.abs(dx) > Math.abs(dy) * 0.5;
            case 'right': return dx > 0 && Math.abs(dx) > Math.abs(dy) * 0.5;
            case 'up': return dy < 0 && Math.abs(dy) > Math.abs(dx) * 0.5;
            case 'down': return dy > 0 && Math.abs(dy) > Math.abs(dx) * 0.5;
            default: return false;
        }
    }

    /**
     * Calculate Euclidean distance between two points
     */
    calculateDistance(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    /**
     * Check if element is visible
     * @param {HTMLElement} element 
     * @returns {boolean}
     */
    isVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0';
    }

    /**
     * Clear focus history
     */
    clearHistory() {
        this.focusHistory = [];
    }
}

const focusManager = new FocusManager();
