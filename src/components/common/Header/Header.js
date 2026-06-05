/**
 * Header Component
 * App header with navigation
 */
class Header {
    constructor(container) {
        this.container = container;
    }

    render() {
        this.container.innerHTML = `
            <div class="app-header-content">
                <div class="app-logo">VidSrc Stream</div>
                <nav class="app-nav">
                    <div class="nav-item focusable" data-screen="home" tabindex="0">Home</div>
                    <div class="nav-item focusable" data-screen="movies" tabindex="0">Movies</div>
                    <div class="nav-item focusable" data-screen="tvshows" tabindex="0">TV Shows</div>
                    <div class="nav-item focusable" data-screen="search" tabindex="0">Search</div>
                </nav>
            </div>
        `;

        this.container.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const screen = item.dataset.screen;
                if (window.app) {
                    window.app.navigateTo(screen);
                }
            });
        });

        SpatialNavigation.addFocusables(this.container);
    }
}
