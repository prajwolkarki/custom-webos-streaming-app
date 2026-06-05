/**
 * Hero Section Component
 * Featured content banner
 */
class HeroSection {
    constructor(container, data) {
        this.container = container;
        this.data = data;
    }

    render() {
        const { title, description, backdrop, id, type } = this.data;

        this.container.innerHTML = `
            <div class="hero-section" style="background-image: linear-gradient(to top, var(--color-background) 0%, transparent 50%), url('${backdrop || 'assets/images/backgrounds/hero-default.jpg'}')">
                <h1>${title}</h1>
                <p>${description || ''}</p>
                <div class="hero-actions">
                    <button class="action-btn focusable" data-action="play" tabindex="0">Play</button>
                    <button class="action-btn focusable" data-action="info" tabindex="0">More Info</button>
                </div>
            </div>
        `;

        this.container.querySelector('[data-action="play"]').addEventListener('click', () => {
            window.app.navigateTo('player', { id, type });
        });

        this.container.querySelector('[data-action="info"]').addEventListener('click', () => {
            window.app.navigateTo('details', { id, type });
        });

        SpatialNavigation.addFocusables(this.container);
    }
}
