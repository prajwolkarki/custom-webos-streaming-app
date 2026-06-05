/**
 * Search Results Component
 */
class SearchResults {
    constructor(container) {
        this.container = container;
    }

    render(results) {
        this.container.innerHTML = '';

        if (!results || results.length === 0) {
            this.container.innerHTML = '<p class="text-center text-muted">No results found</p>';
            return;
        }

        results.forEach(item => {
            const card = new PosterCard(this.container, item, {
                onClick: (data) => {
                    window.app.navigateTo('details', { id: data.id, type: data.type });
                }
            });
            card.render();
        });

        SpatialNavigation.addFocusables(this.container);
    }
}
