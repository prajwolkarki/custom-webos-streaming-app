/**
 * Loading Spinner Component
 */
class LoadingSpinner {
    constructor(container) {
        this.container = container;
    }

    show() {
        this.container.classList.remove('hidden');
    }

    hide() {
        this.container.classList.add('hidden');
    }

    render() {
        this.container.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading...</p>
            </div>
        `;
    }
}
