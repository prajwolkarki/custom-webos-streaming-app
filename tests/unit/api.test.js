function testUrlBuilder() {
  console.log('Testing URL Builder...');
  const movieUrl = buildMovieEmbedUrl('tt5433140', { autoplay: true });
  console.assert(movieUrl.includes('imdb=tt5433140'), 'Movie URL with IMDB ID failed');
  const movieUrl2 = buildMovieEmbedUrl('385687', { ds_lang: 'de' });
  console.assert(movieUrl2.includes('tmdb=385687'), 'Movie URL with TMDB ID failed');
  console.assert(movieUrl2.includes('ds_lang=de'), 'Movie URL language param failed');
  const episodeUrl = buildEpisodeEmbedUrl('tt0944947', 1, 1, { autoplay: true, autonext: true });
  console.assert(episodeUrl.includes('season=1'), 'Episode URL season failed');
  console.assert(episodeUrl.includes('episode=1'), 'Episode URL episode failed');
  console.assert(episodeUrl.includes('autoplay=1'), 'Episode URL autoplay failed');
  console.log('URL Builder tests passed!');
}

function testHelpers() {
  console.log('Testing Helpers...');
  console.assert(isImdbId('tt1234567') === true, 'IMDB ID detection failed');
  console.assert(isImdbId('1234567') === false, 'Non-IMDB ID detection failed');
  console.assert(isTmdbId('385687') === true, 'TMDB ID detection failed');
  console.assert(isTmdbId('tt385687') === false, 'Non-TMDB ID detection failed');
  console.assert(formatDuration(125) === '2h 5m', 'Duration formatting failed');
  console.assert(formatDuration(45) === '45m', 'Short duration formatting failed');
  console.log('Helpers tests passed!');
}

function testParseVidSrc() {
  console.log('Testing VidSrc parser...');
  const arrResult = parseLatestVidSrc([{ id: 1 }, { id: 2 }]);
  console.assert(arrResult.length === 2, 'Array parse failed');
  const objResult = parseLatestVidSrc({ result: [{ id: 1 }] });
  console.assert(objResult.length === 1, 'Object result parse failed');
  const objResults = parseLatestVidSrc({ results: [{ id: 1 }] });
  console.assert(objResults.length === 1, 'Object results parse failed');
  console.log('VidSrc parser tests passed!');
}

if (typeof window !== 'undefined') {
  console.log('Running unit tests...');
  testUrlBuilder();
  testHelpers();
  testParseVidSrc();
  console.log('All unit tests completed!');
}
