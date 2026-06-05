/**
 * Search Bar Component
 */
class SearchBar {
    constructor(container, onSearch) {
        this.container = container;
        this.onSearch = onSearch;
    }

    render() {
        this.container.innerHTML = `
            <div class="search-bar">
                <input type="text" 
                       id="search-input" 
                       class="focusable" 
                       placeholder="Search..." 
                       tabindex="0">
                <button id="search-btn" class="focusable" tabindex="0">Search</button>
            </div>
        `;

        const input = document.getElementById('search-input');
        const btn = document.getElementById('search-btn');

        btn.addEventListener('click', () => {
            if (this.onSearch) {
                this.onSearch(input.value);
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.keyCode === KEY_CODES.OK && this.onSearch) {
                this.onSearch(input.value);
            }
        });

        SpatialNavigation.addFocusables(this.container);
    }
}
