async function fetchGenreLists() {
  const movieUrl = buildTmdbApiUrl('/genre/movie/list');
  const tvUrl = buildTmdbApiUrl('/genre/tv/list');
  const [movieRes, tvRes] = await Promise.all([apiFetch(movieUrl), apiFetch(tvUrl)]);
  movieRes.genres.forEach(g => { APP.movieGenres[g.id] = g.name; });
  tvRes.genres.forEach(g => { APP.tvGenres[g.id] = g.name; });
}

async function loadRowItems(row, rowIndex, append = false) {
  if (row.loaded && !append) {
    renderRowCards(row, rowIndex);
    return;
  }

  let items = [];
  try {
    if (row.isVidSrc) {
      const res = await fetch(row.endpoint.replace('{PAGE}', row.page));
      if (!res.ok) throw new Error('VidSrc response error');
      const data = await res.json();
      const parsed = parseLatestVidSrc(data);
      items = await enrichVidSrcItems(parsed, row.type);
    } else {
      const url = buildTmdbApiUrl(row.endpoint, { page: row.page });
      const data = await apiFetch(url);
      items = data.results || [];
    }

    items.forEach(item => {
      if (!item.media_type) item.media_type = row.type;
    });

    if (append) {
      row.items = [...row.items, ...items];
    } else {
      row.items = items;
    }

    row.loaded = true;
    renderRowCards(row, rowIndex);
  } catch (err) {
    console.error(`Error loading row [${row.title}]:`, err);
    const wrapper = document.getElementById(`row-wrapper-${rowIndex}`);
    if (wrapper && (!append || row.items.length === 0)) {
      wrapper.innerHTML = `
        <div style="padding: 20px; font-family: Barlow Condensed; font-size: 18px; color: var(--secondary-accent);">
          Error loading row contents. Select to reload.
        </div>
      `;
    }
  }
}

async function enrichVidSrcItems(items, type) {
  if (!items || items.length === 0) return [];
  const fetchList = items.slice(0, 12);
  const promises = fetchList.map(async (item) => {
    const tmdbId = item.tmdb_id || item.tmdb;
    if (!tmdbId) return null;
    try {
      const url = buildTmdbApiUrl(`/${type}/${tmdbId}`);
      const data = await apiFetch(url);
      data.media_type = type;
      data.is_new = true;
      return data;
    } catch (e) {
      return {
        id: tmdbId,
        title: item.title || item.name || 'Title Unavailable',
        name: item.title || item.name || 'Title Unavailable',
        poster_path: null,
        backdrop_path: null,
        media_type: type,
        vote_average: 0,
        overview: 'Detailed metadata is currently loading. Click play to stream.',
        is_fallback: true,
        is_new: true
      };
    }
  });
  const results = await Promise.all(promises);
  return results.filter(r => r !== null);
}

async function fetchDetailContent(id, type) {
  const detailUrl = buildTmdbApiUrl(`/${type}/${id}`);
  const creditsUrl = buildTmdbApiUrl(`/${type}/${id}/credits`);
  const videosUrl = buildTmdbApiUrl(`/${type}/${id}/videos`);
  const similarUrl = buildTmdbApiUrl(`/${type}/${id}/similar`);
  const recsUrl = buildTmdbApiUrl(`/${type}/${id}/recommendations`);

  const [detailRes, creditsRes, videosRes, similarRes, recsRes] = await Promise.allSettled([
    apiFetch(detailUrl), apiFetch(creditsUrl), apiFetch(videosUrl),
    apiFetch(similarUrl), apiFetch(recsUrl)
  ]);

  if (detailRes.status === 'rejected') throw new Error('Detail fetch failed');
  const detail = detailRes.value;
  detail.media_type = type;
  detail.credits = creditsRes.status === 'fulfilled' ? creditsRes.value : null;
  detail.videos = videosRes.status === 'fulfilled' ? videosRes.value : null;
  const similarItems = similarRes.status === 'fulfilled' && similarRes.value.results ? similarRes.value.results : [];
  const recItems = recsRes.status === 'fulfilled' && recsRes.value.results ? recsRes.value.results : [];
  detail.similar = similarItems.slice(0, 10);
  detail.recommendations = recItems.slice(0, 10);
  return detail;
}

async function loadSeasonEpisodes(tmdbId, seasonNumber) {
  APP.currentSeasonIndex = seasonNumber;
  try {
    const url = buildTmdbApiUrl(`/tv/${tmdbId}/season/${seasonNumber}`);
    const data = await apiFetch(url);
    APP.currentSeasonEpisodes = data.episodes || [];
    renderTVSeasonEpisodes();
  } catch (err) {
    console.error(err);
    showToast("Error loading season episodes.", true);
    document.getElementById('episodes-grid').innerHTML = `
      <div style="grid-column: span 4; padding: 20px; text-align: center; color: var(--secondary-accent);">
        Failed to load episodes list.
      </div>
    `;
  }
}

async function performSearchQuery(query) {
  document.getElementById('results-title').innerText = `Searching: "${query}"...`;
  try {
    const url = buildTmdbApiUrl('/search/multi', { query: encodeURIComponent(query), page: 1 });
    const data = await apiFetch(url);
    const results = (data.results || []).filter(item => item.media_type === 'movie' || item.media_type === 'tv');
    renderSearchResults(results);
  } catch (err) {
    console.error(err);
    document.getElementById('results-title').innerText = 'Search query failed';
  }
}

async function fetchGenreGridPage() {
  if (APP.genreLoading) return;
  APP.genreLoading = true;
  try {
    const url = buildTmdbApiUrl(`/discover/${APP.currentGenreType}`, {
      with_genres: APP.currentGenreId,
      sort_by: 'popularity.desc',
      page: APP.currentGenrePage
    });
    const data = await apiFetch(url);
    const results = data.results || [];
    results.forEach(item => { item.media_type = APP.currentGenreType; });
    APP.genreGridItems = [...APP.genreGridItems, ...results];
    renderGenreGrid(results);
    APP.currentGenrePage += 1;
  } catch (err) {
    console.error(err);
    showToast("No more pages available.", true);
  } finally {
    APP.genreLoading = false;
  }
}

async function validateTmdbKey(key) {
  try {
    const testRes = await fetch(`${CONFIG.TMDB.BASE_URL}/genre/movie/list?api_key=${key}&language=en-US`);
    return testRes.ok;
  } catch (e) {
    return false;
  }
}
