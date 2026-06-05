/**
 * TV Show Grid Component
 */
class TVShowGrid {
    constructor(container) {
        this.container = container;
    }

    render(shows) {
        this.container.innerHTML = '';

        shows.forEach(show => {
            const card = document.createElement('div');
            card.className = 'tvshow-card focusable';
            card.setAttribute('tabindex', '0');
            card.innerHTML = `
                <img src="${show.poster || 'assets/images/posters/placeholder.png'}" alt="${show.title}">
                <div class="card-title">${show.title}</div>
            `;
            card.addEventListener('click', () => {
                window.app.navigateTo('details', { id: show.imdb_id || show.tmdb_id, type: 'tv' });
            });
            this.container.appendChild(card);
        });

        SpatialNavigation.addFocusables(this.container);
    }
}
