/**
 * API Unit Tests
 */

// Mock request handler for testing
class MockRequest {
    async get(url) {
        if (url.includes('movies/latest')) {
            return [
                { id: 'tt1234567', title: 'Test Movie', poster: 'test.jpg' }
            ];
        }
        if (url.includes('tvshows/latest')) {
            return [
                { id: 'tt7654321', title: 'Test Show', poster: 'test.jpg' }
            ];
        }
        return [];
    }
}

// Test URL Builder
function testUrlBuilder() {
    console.log('Testing URL Builder...');

    // Test movie URL with IMDB ID
    const movieUrl = URLBuilder.buildMovieUrl('tt5433140');
    console.assert(movieUrl.includes('imdb=tt5433140'), 'Movie URL with IMDB ID failed');

    // Test movie URL with TMDB ID
    const movieUrl2 = URLBuilder.buildMovieUrl('385687', { ds_lang: 'de' });
    console.assert(movieUrl2.includes('tmdb=385687'), 'Movie URL with TMDB ID failed');
    console.assert(movieUrl2.includes('ds_lang=de'), 'Movie URL language param failed');

    // Test episode URL
    const episodeUrl = URLBuilder.buildEpisodeUrl('tt0944947', 1, 1, { autoplay: true, autonext: true });
    console.assert(episodeUrl.includes('season=1'), 'Episode URL season failed');
    console.assert(episodeUrl.includes('episode=1'), 'Episode URL episode failed');
    console.assert(episodeUrl.includes('autoplay=1'), 'Episode URL autoplay failed');

    console.log('URL Builder tests passed!');
}

// Test Helpers
function testHelpers() {
    console.log('Testing Helpers...');

    console.assert(Helpers.isImdbId('tt1234567') === true, 'IMDB ID detection failed');
    console.assert(Helpers.isImdbId('1234567') === false, 'Non-IMDB ID detection failed');
    console.assert(Helpers.isTmdbId('385687') === true, 'TMDB ID detection failed');
    console.assert(Helpers.isTmdbId('tt385687') === false, 'Non-TMDB ID detection failed');

    console.assert(Helpers.formatDuration(125) === '2h 5m', 'Duration formatting failed');
    console.assert(Helpers.formatDuration(45) === '45m', 'Short duration formatting failed');

    console.log('Helpers tests passed!');
}

// Test Storage
function testStorage() {
    console.log('Testing Storage...');

    const testId = 'test-item-123';
    storage.addFavorite({ id: testId, title: 'Test Item' });
    console.assert(storage.isFavorite(testId) === true, 'Add favorite failed');

    storage.removeFavorite(testId);
    console.assert(storage.isFavorite(testId) === false, 'Remove favorite failed');

    console.log('Storage tests passed!');
}

// Run tests
if (typeof window !== 'undefined') {
    console.log('Running unit tests...');
    testUrlBuilder();
    testHelpers();
    testStorage();
    console.log('All unit tests completed!');
}
