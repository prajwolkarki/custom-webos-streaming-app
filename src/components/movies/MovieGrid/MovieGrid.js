/**
 * Movie Grid Component
 */
class MovieGrid {
    constructor(container) {
        this.container = container;
    }

    render(movies) {
        this.container.innerHTML = '';

        movies.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'movie-card focusable';
            card.setAttribute('tabindex', '0');
            card.innerHTML = `
                <img src="${movie.poster || 'assets/images/posters/placeholder.png'}" alt="${movie.title}">
                <div class="card-title">${movie.title}</div>
            `;
            card.addEventListener('click', () => {
                window.app.navigateTo('player', { id: movie.imdb_id || movie.tmdb_id, type: 'movie' });
            });
            this.container.appendChild(card);
        });

        SpatialNavigation.addFocusables(this.container);
    }
}
