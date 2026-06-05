/**
 * Episode List Component
 */
class EpisodeList {
    constructor(container) {
        this.container = container;
    }

    render(episodes) {
        this.container.innerHTML = '';

        episodes.forEach(ep => {
            const card = document.createElement('div');
            card.className = 'episode-card focusable';
            card.setAttribute('tabindex', '0');
            card.innerHTML = `
                <div class="episode-info">
                    <div class="episode-title">${ep.title}</div>
                    <div class="episode-meta">S${ep.season} E${ep.episode}</div>
                </div>
            `;
            card.addEventListener('click', () => {
                window.app.navigateTo('player', { 
                    id: ep.imdb_id || ep.tmdb_id, 
                    type: 'tv', 
                    season: ep.season, 
                    episode: ep.episode 
                });
            });
            this.container.appendChild(card);
        });

        SpatialNavigation.addFocusables(this.container);
    }
}
