/**
 * Error Message Component
 */
class ErrorMessage {
    constructor(container, message, onRetry) {
        this.container = container;
        this.message = message;
        this.onRetry = onRetry;
    }

    render() {
        this.container.innerHTML = `
            <div class="error-message">
                <p>${this.message || 'Something went wrong'}</p>
                ${this.onRetry ? '<button class="retry-btn focusable" tabindex="0">Try Again</button>' : ''}
            </div>
        `;

        if (this.onRetry) {
            const retryBtn = this.container.querySelector('.retry-btn');
            retryBtn.addEventListener('click', this.onRetry);
            SpatialNavigation.addFocusables(this.container);
        }
    }
}
