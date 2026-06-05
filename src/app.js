/**
 * VidSrc Streaming App - Main Entry Point
 * Bootstraps the application and handles screen routing
 */

class App {
    constructor() {
        this.currentScreen = null;
        this.screens = {};
        this.init();
    }

    init() {
        console.log('[App] Initializing VidSrc Stream...');

        // Initialize navigation
        KeyHandler.init();
        FocusManager.init();
        SpatialNavigation.init();

        // Register screens
        this.registerScreen('home', HomeScreen);
        this.registerScreen('movies', MoviesScreen);
        this.registerScreen('tvshows', TVShowsScreen);
        this.registerScreen('episodes', EpisodesScreen);
        this.registerScreen('player', PlayerScreen);
        this.registerScreen('search', SearchScreen);
        this.registerScreen('details', DetailsScreen);

        // Load home screen
        this.navigateTo('home');

        // Setup global back button handler
        document.addEventListener('keydown', (e) => {
            if (e.keyCode === KEY_CODES.BACK) {
                e.preventDefault();
                this.handleBack();
            }
        });
    }

    registerScreen(name, ScreenClass) {
        this.screens[name] = ScreenClass;
    }

    navigateTo(screenName, params = {}) {
        console.log(`[App] Navigating to: ${screenName}`, params);

        const mainContainer = document.getElementById('app-main');

        // Cleanup current screen
        if (this.currentScreen && this.currentScreen.destroy) {
            this.currentScreen.destroy();
        }

        // Clear container
        mainContainer.innerHTML = '';

        // Create new screen instance
        const ScreenClass = this.screens[screenName];
        if (ScreenClass) {
            this.currentScreen = new ScreenClass(mainContainer, params);
            this.currentScreen.render();
        } else {
            console.error(`[App] Screen not found: ${screenName}`);
        }
    }

    handleBack() {
        if (this.currentScreen && this.currentScreen.onBack) {
            this.currentScreen.onBack();
        } else {
            // Default: go home
            this.navigateTo('home');
        }
    }

    showLoading() {
        document.getElementById('loading-overlay').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.add('hidden');
    }
}

// Screen Classes (stubs - implement in separate files)
class HomeScreen {
    constructor(container, params) {
        this.container = container;
        this.params = params;
    }

    render() {
        this.container.innerHTML = `
            <div class="home-screen">
                <div class="hero-section">
                    <h1>Welcome to VidSrc Stream</h1>
                    <p>Your personal streaming platform</p>
                </div>
                <div class="content-sections">
                    <div class="content-row" data-row="latest-movies">
                        <h2>Latest Movies</h2>
                        <div class="row-items" id="latest-movies-row"></div>
                    </div>
                    <div class="content-row" data-row="latest-tv">
                        <h2>Latest TV Shows</h2>
                        <div class="row-items" id="latest-tv-row"></div>
                    </div>
                    <div class="content-row" data-row="latest-episodes">
                        <h2>Latest Episodes</h2>
                        <div class="row-items" id="latest-episodes-row"></div>
                    </div>
                </div>
            </div>
        `;
        this.loadContent();
    }

    async loadContent() {
        try {
            const [movies, tvShows, episodes] = await Promise.all([
                VidSrcAPI.getLatestMovies(1),
                VidSrcAPI.getLatestTVShows(1),
                VidSrcAPI.getLatestEpisodes(1)
            ]);

            this.renderRow('latest-movies-row', movies, 'movie');
            this.renderRow('latest-tv-row', tvShows, 'tv');
            this.renderRow('latest-episodes-row', episodes, 'episode');
        } catch (error) {
            console.error('[HomeScreen] Failed to load content:', error);
        }
    }

    renderRow(containerId, items, type) {
        const container = document.getElementById(containerId);
        if (!container || !items) return;

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'poster-card focusable';
            card.setAttribute('tabindex', '0');
            card.innerHTML = `
                <div class="poster-image">
                    <img src="${item.poster || 'assets/images/posters/placeholder.png'}" alt="${item.title}">
                </div>
                <div class="poster-title">${item.title}</div>
            `;
            card.addEventListener('click', () => {
                if (type === 'movie') {
                    window.app.navigateTo('player', { id: item.imdb_id || item.tmdb_id, type: 'movie' });
                } else if (type === 'tv') {
                    window.app.navigateTo('details', { id: item.imdb_id || item.tmdb_id, type: 'tv' });
                } else if (type === 'episode') {
                    window.app.navigateTo('player', { 
                        id: item.imdb_id || item.tmdb_id, 
                        type: 'tv', 
                        season: item.season, 
                        episode: item.episode 
                    });
                }
            });
            container.appendChild(card);
        });

        // Register focusables
        SpatialNavigation.addFocusables(container);
    }

    destroy() {
        // Cleanup
    }

    onBack() {
        // Home screen: do nothing on back (or show exit confirmation)
    }
}

class MoviesScreen {
    constructor(container, params) {
        this.container = container;
        this.params = params;
        this.currentPage = 1;
    }

    render() {
        this.container.innerHTML = `
            <div class="movies-screen">
                <h1>Movies</h1>
                <div class="movie-grid" id="movie-grid"></div>
            </div>
        `;
        this.loadMovies();
    }

    async loadMovies() {
        try {
            const movies = await VidSrcAPI.getLatestMovies(this.currentPage);
            const grid = document.getElementById('movie-grid');

            movies.forEach(movie => {
                const card = document.createElement('div');
                card.className = 'movie-card focusable';
                card.setAttribute('tabindex', '0');
                card.innerHTML = `
                    <img src="${movie.poster || 'assets/images/posters/placeholder.png'}" alt="${movie.title}">
                    <div class="card-title">${movie.title}</div>
                `;
                card.addEventListener('click', () => {
                    window.app.navigateTo('player', { 
                        id: movie.imdb_id || movie.tmdb_id, 
                        type: 'movie' 
                    });
                });
                grid.appendChild(card);
            });

            SpatialNavigation.addFocusables(grid);
        } catch (error) {
            console.error('[MoviesScreen] Failed to load movies:', error);
        }
    }

    destroy() {}
    onBack() { window.app.navigateTo('home'); }
}

class TVShowsScreen {
    constructor(container, params) {
        this.container = container;
        this.params = params;
        this.currentPage = 1;
    }

    render() {
        this.container.innerHTML = `
            <div class="tvshows-screen">
                <h1>TV Shows</h1>
                <div class="tvshow-grid" id="tvshow-grid"></div>
            </div>
        `;
        this.loadTVShows();
    }

    async loadTVShows() {
        try {
            const shows = await VidSrcAPI.getLatestTVShows(this.currentPage);
            const grid = document.getElementById('tvshow-grid');

            shows.forEach(show => {
                const card = document.createElement('div');
                card.className = 'tvshow-card focusable';
                card.setAttribute('tabindex', '0');
                card.innerHTML = `
                    <img src="${show.poster || 'assets/images/posters/placeholder.png'}" alt="${show.title}">
                    <div class="card-title">${show.title}</div>
                `;
                card.addEventListener('click', () => {
                    window.app.navigateTo('details', { 
                        id: show.imdb_id || show.tmdb_id, 
                        type: 'tv' 
                    });
                });
                grid.appendChild(card);
            });

            SpatialNavigation.addFocusables(grid);
        } catch (error) {
            console.error('[TVShowsScreen] Failed to load TV shows:', error);
        }
    }

    destroy() {}
    onBack() { window.app.navigateTo('home'); }
}

class EpisodesScreen {
    constructor(container, params) {
        this.container = container;
        this.params = params;
        this.currentPage = 1;
    }

    render() {
        this.container.innerHTML = `
            <div class="episodes-screen">
                <h1>Latest Episodes</h1>
                <div class="episode-list" id="episode-list"></div>
            </div>
        `;
        this.loadEpisodes();
    }

    async loadEpisodes() {
        try {
            const episodes = await VidSrcAPI.getLatestEpisodes(this.currentPage);
            const list = document.getElementById('episode-list');

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
                list.appendChild(card);
            });

            SpatialNavigation.addFocusables(list);
        } catch (error) {
            console.error('[EpisodesScreen] Failed to load episodes:', error);
        }
    }

    destroy() {}
    onBack() { window.app.navigateTo('home'); }
}

class PlayerScreen {
    constructor(container, params) {
        this.container = container;
        this.params = params;
        this.player = null;
    }

    render() {
        const { id, type, season, episode } = this.params;

        let embedUrl;
        if (type === 'movie') {
            embedUrl = URLBuilder.buildMovieUrl(id);
        } else {
            embedUrl = URLBuilder.buildEpisodeUrl(id, season, episode);
        }

        this.container.innerHTML = `
            <div class="player-screen">
                <div class="player-container">
                    <iframe 
                        id="video-player"
                        src="${embedUrl}"
                        frameborder="0"
                        allowfullscreen
                        allow="autoplay; encrypted-media"
                    ></iframe>
                </div>
                <div class="player-overlay">
                    <div class="player-info">
                        <h2>${this.params.title || 'Now Playing'}</h2>
                        ${season ? `<p>Season ${season}, Episode ${episode}</p>` : ''}
                    </div>
                    <div class="player-controls">
                        <button class="control-btn focusable" data-action="back" tabindex="0">
                            <span>Back</span>
                        </button>
                        <button class="control-btn focusable" data-action="fullscreen" tabindex="0">
                            <span>Fullscreen</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.setupControls();
    }

    setupControls() {
        const backBtn = this.container.querySelector('[data-action="back"]');
        const fullscreenBtn = this.container.querySelector('[data-action="fullscreen"]');

        backBtn.addEventListener('click', () => this.onBack());
        fullscreenBtn.addEventListener('click', () => {
            const iframe = document.getElementById('video-player');
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            }
        });

        SpatialNavigation.addFocusables(this.container.querySelector('.player-controls'));
    }

    destroy() {
        // Cleanup iframe
        const iframe = document.getElementById('video-player');
        if (iframe) {
            iframe.src = '';
        }
    }

    onBack() {
        window.app.navigateTo('home');
    }
}

class SearchScreen {
    constructor(container, params) {
        this.container = container;
        this.params = params;
    }

    render() {
        this.container.innerHTML = `
            <div class="search-screen">
                <h1>Search</h1>
                <div class="search-bar">
                    <input type="text" id="search-input" class="focusable" placeholder="Search movies or TV shows..." tabindex="0">
                    <button id="search-btn" class="focusable" tabindex="0">Search</button>
                </div>
                <div class="search-results" id="search-results"></div>
            </div>
        `;

        const searchBtn = document.getElementById('search-btn');
        searchBtn.addEventListener('click', () => this.performSearch());

        SpatialNavigation.addFocusables(this.container.querySelector('.search-bar'));
    }

    async performSearch() {
        const query = document.getElementById('search-input').value;
        if (!query) return;

        // Note: VidSrc doesn't have a search API, you'd need TMDB integration
        // This is a placeholder
        console.log('[SearchScreen] Searching for:', query);
    }

    destroy() {}
    onBack() { window.app.navigateTo('home'); }
}

class DetailsScreen {
    constructor(container, params) {
        this.container = container;
        this.params = params;
    }

    render() {
        const { id, type } = this.params;

        this.container.innerHTML = `
            <div class="details-screen">
                <div class="details-backdrop">
                    <img src="assets/images/backgrounds/default.jpg" alt="Backdrop">
                </div>
                <div class="details-content">
                    <h1 id="details-title">Loading...</h1>
                    <p id="details-overview"></p>
                    <div class="details-actions">
                        <button class="action-btn focusable" id="play-btn" tabindex="0">Play</button>
                        <button class="action-btn focusable" id="favorite-btn" tabindex="0">Add to Favorites</button>
                    </div>
                    <div class="seasons-section" id="seasons-section"></div>
                </div>
            </div>
        `;

        this.loadDetails();
    }

    async loadDetails() {
        // Placeholder - you'd fetch from TMDB or your own API
        document.getElementById('details-title').textContent = 'Title Placeholder';
        document.getElementById('details-overview').textContent = 'Description placeholder...';

        const playBtn = document.getElementById('play-btn');
        playBtn.addEventListener('click', () => {
            if (this.params.type === 'movie') {
                window.app.navigateTo('player', { id: this.params.id, type: 'movie' });
            } else {
                // For TV shows, show season/episode selector
                this.showSeasonSelector();
            }
        });

        SpatialNavigation.addFocusables(this.container.querySelector('.details-actions'));
    }

    showSeasonSelector() {
        const section = document.getElementById('seasons-section');
        section.innerHTML = `
            <h2>Select Season</h2>
            <div class="season-grid">
                <div class="season-card focusable" data-season="1" tabindex="0">Season 1</div>
                <div class="season-card focusable" data-season="2" tabindex="0">Season 2</div>
            </div>
        `;

        section.querySelectorAll('.season-card').forEach(card => {
            card.addEventListener('click', () => {
                const season = card.dataset.season;
                window.app.navigateTo('episodes', { 
                    id: this.params.id, 
                    season: season 
                });
            });
        });

        SpatialNavigation.addFocusables(section);
    }

    destroy() {}
    onBack() { window.app.navigateTo('home'); }
}

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
