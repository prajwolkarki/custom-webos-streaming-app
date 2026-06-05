/**
 * Poster Card Component
 * Reusable poster card for movies/shows
 */
class PosterCard {
    constructor(container, data, options = {}) {
        this.container = container;
        this.data = data;
        this.options = options;
    }

    render() {
        const { title, poster, id, type } = this.data;

        const card = document.createElement('div');
        card.className = 'poster-card focusable';
        card.setAttribute('tabindex', '0');
        card.innerHTML = `
            <div class="poster-image">
                <img src="${poster || 'assets/images/posters/placeholder.png'}" 
                     alt="${title}" 
                     loading="lazy">
            </div>
            <div class="poster-title">${title}</div>
        `;

        card.addEventListener('click', () => {
            if (this.options.onClick) {
                this.options.onClick(this.data);
            }
        });

        this.container.appendChild(card);
        return card;
    }
}
