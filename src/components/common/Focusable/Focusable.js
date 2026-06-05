/**
 * Focusable Wrapper Component
 * Makes any element focusable with TV navigation
 */
class Focusable {
    constructor(element, options = {}) {
        this.element = element;
        this.options = options;
        this.init();
    }

    init() {
        this.element.classList.add('focusable');
        if (!this.element.hasAttribute('tabindex')) {
            this.element.setAttribute('tabindex', '0');
        }

        this.element.addEventListener('focus', () => {
            this.element.classList.add('focused');
        });

        this.element.addEventListener('blur', () => {
            this.element.classList.remove('focused');
        });
    }
}
