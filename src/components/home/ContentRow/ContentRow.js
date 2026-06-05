/**
 * Content Row Component
 * Horizontal scrolling row of content
 */
class ContentRow {
    constructor(container, title, items, options = {}) {
        this.container = container;
        this.title = title;
        this.items = items;
        this.options = options;
    }

    render() {
        const row = document.createElement('div');
        row.className = 'content-row';
        row.innerHTML = `<h2>${this.title}</h2>`;

        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'row-items';

        this.items.forEach(item => {
            const card = new PosterCard(itemsContainer, item, {
                onClick: (data) => {
                    if (this.options.onItemClick) {
                        this.options.onItemClick(data);
                    }
                }
            });
            card.render();
        });

        row.appendChild(itemsContainer);
        this.container.appendChild(row);

        SpatialNavigation.addFocusables(itemsContainer);
    }
}
