function buildMovieEmbedUrl(id, options = {}) {
  const params = new URLSearchParams();
  if (isImdbId(id)) {
    params.append('imdb', id);
  } else if (isTmdbId(id)) {
    params.append('tmdb', id);
  } else {
    return `${CONFIG.API.BASE_URL}${CONFIG.API.MOVIE_EMBED}/${id}`;
  }
  if (options.autoplay) params.append('autoplay', '1');
  if (options.ds_lang) params.append('ds_lang', options.ds_lang);
  const queryString = params.toString();
  return `${CONFIG.API.BASE_URL}${CONFIG.API.MOVIE_EMBED}?${queryString}`;
}

function buildEpisodeEmbedUrl(id, season, episode, options = {}) {
  const params = new URLSearchParams();
  if (isImdbId(id)) {
    params.append('imdb', id);
  } else if (isTmdbId(id)) {
    params.append('tmdb', id);
  } else {
    return `${CONFIG.API.BASE_URL}${CONFIG.API.TV_EMBED}/${id}/${season}-${episode}`;
  }
  params.append('season', season);
  params.append('episode', episode);
  if (options.autoplay) params.append('autoplay', '1');
  if (options.autonext) params.append('autonext', '1');
  if (options.ds_lang) params.append('ds_lang', options.ds_lang);
  const queryString = params.toString();
  return `${CONFIG.API.BASE_URL}${CONFIG.API.TV_EMBED}?${queryString}`;
}

function buildTmdbImageUrl(path, size = 'w500') {
  if (!path) return '';
  return `${CONFIG.TMDB.IMAGE_BASE}${path}`;
}

function buildTmdbBackdropUrl(path) {
  if (!path) return '';
  return `${CONFIG.TMDB.BACKDROP_BASE}${path}`;
}

function buildTmdbApiUrl(endpoint, params = {}) {
  const queryParams = new URLSearchParams({
    api_key: APP.tmdbApiKey,
    language: CONFIG.APP.LANGUAGE,
    ...params
  });
  const separator = endpoint.includes('?') ? '&' : '?';
  return `${CONFIG.TMDB.BASE_URL}${endpoint}${separator}${queryParams.toString()}`;
}
