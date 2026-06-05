/**
 * Season Selector Component
 */
class SeasonSelector {
    constructor(container, seasons) {
        this.container = container;
        this.seasons = seasons;
    }

    render() {
        this.container.innerHTML = '<h2>Select Season</h2>';

        const grid = document.createElement('div');
        grid.className = 'season-grid';

        this.seasons.forEach(season => {
            const card = document.createElement('div');
            card.className = 'season-card focusable';
            card.setAttribute('tabindex', '0');
            card.textContent = `Season ${season}`;
            card.addEventListener('click', () => {
                if (this.onSelect) {
                    this.onSelect(season);
                }
            });
            grid.appendChild(card);
        });

        this.container.appendChild(grid);
        SpatialNavigation.addFocusables(grid);
    }
}
