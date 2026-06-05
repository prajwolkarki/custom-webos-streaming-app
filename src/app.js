const APP = {
  screen: 'home',
  screenStack: [],
  detailHistory: [],
  focusZone: 'tabbar',
  focusedRow: 0,
  focusedCol: 0,
  rowColMemory: {},
  detailZoneMemory: {},
  activeTab: 'movies',
  movieRows: [],
  tvRows: [],
  currentDetail: null,
  currentSeasonEpisodes: [],
  currentSeasonIndex: 1,
  watchlist: [],
  tmdbApiKey: '2668df122d5919267bedb70261c67a5e',
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  tmdbImageBase: 'https://image.tmdb.org/t/p/w185',
  tmdbPosterBase: 'https://image.tmdb.org/t/p/w342',
  tmdbBackdropBase: 'https://image.tmdb.org/t/p/w780',
  vidsrcEmbedBase: 'https://vsembed.ru/embed',
  subtitleLang: '',
  heroItems: [],
  heroIndex: 0,
  heroInterval: null,
  searchQuery: '',
  setupQuery: '',
  setupTarget: 'tmdbApiKey',
  currentGenreId: null,
  currentGenreName: '',
  currentGenreType: 'movie',
  currentGenrePage: 1,
  genreGridItems: [],
  genreLoading: false,
  movieGenres: {},
  tvGenres: {},
  detailZones: [],
  detailZoneIndex: 0,
  detailEpisodeRow: 0,
  detailEpisodeCol: 0,
};

let searchDebounceTimer = null;
let hudTimeout = null;

window.addEventListener('DOMContentLoaded', async () => {
  loadLocalStorage();
  updateSubtitlePreferenceVisual();

  if (APP.tmdbApiKey === 'YOUR_TMDB_API_KEY' || !APP.tmdbApiKey || APP.tmdbApiKey.trim() === '') {
    openSetupScreen();
  } else {
    await initApplication();
  }

  document.addEventListener('keydown', handleGlobalKeydown);
});

async function initApplication() {
  showLoading(true, 'Connecting to TMDB...');
  try {
    await fetchGenreLists();

    APP.movieRows = MOVIE_CATEGORIES.map(r => ({ ...r, items: [], page: 1, loaded: false }));
    APP.tvRows = TV_CATEGORIES.map(r => ({ ...r, items: [], page: 1, loaded: false }));

    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');

    await switchTab('movies');
  } catch (err) {
    console.error(err);
    showToast("Initial connection failed. Verify API key and network.", true);
    openSetupScreen();
  } finally {
    showLoading(false);
  }
}

function showLoading(show, text = 'CINESTREAM') {
  const loader = document.getElementById('loading-screen');
  const textNode = document.getElementById('loading-text');
  textNode.innerText = text;
  if (show) {
    loader.classList.remove('hidden');
  } else {
    loader.classList.add('hidden');
  }
}

async function switchTab(tab) {
  if (typeof clearLayoutCaches === 'function') clearLayoutCaches();
  APP.activeTab = tab;

  document.querySelectorAll('.tab-item').forEach(item => {
    if (item.dataset.tab === tab) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  stopHeroRotation();
  hideAllViews();
  document.getElementById('home-view').classList.remove('hidden');
  APP.screen = 'home';
  document.getElementById('main-content').scrollTop = 0;

  const rows = tab === 'movies' ? APP.movieRows : APP.tvRows;
  renderRowContainers(rows);

  APP.focusZone = 'tabbar';
  APP.focusedCol = tab === 'movies' ? 0 : 1;
  updateFocusVisuals();

  const primaryRows = rows.slice(0, 4);
  const secondaryRows = rows.slice(4);

  showLoading(true, `Loading ${tab === 'movies' ? 'Movies' : 'TV Shows'}...`);
  try {
    await Promise.all(primaryRows.map((row, idx) => loadRowItems(row, idx)));

    if (primaryRows[0] && primaryRows[0].items.length > 0) {
      APP.heroItems = primaryRows[0].items.slice(0, 8);
      APP.heroIndex = 0;
      renderHeroItem();
      startHeroRotation();
    }
    showLoading(false);

    for (let i = 0; i < secondaryRows.length; i++) {
      const actualIndex = i + 4;
      loadRowItems(secondaryRows[i], actualIndex).catch(err => console.error(err));
    }
  } catch (err) {
    showLoading(false);
    showToast("Error loading home page content rows.", true);
  }
}

function renderRowContainers(rows) {
  const container = document.getElementById('rows-container');
  container.innerHTML = '';

  rows.forEach((row, idx) => {
    const rowSection = document.createElement('section');
    rowSection.className = 'content-row';
    rowSection.id = `row-sec-${idx}`;
    rowSection.setAttribute('data-row-index', idx);

    rowSection.innerHTML = `
      <div class="row-header">
        <h3 class="row-title" id="row-title-${idx}">
          <span>${row.title}</span>
        </h3>
        <div class="see-all-btn focusable" id="row-see-all-${idx}" data-row-idx="${idx}">See All →</div>
      </div>
      <div class="cards-viewport">
        <div class="cards-wrapper" id="row-wrapper-${idx}">
          <div style="padding: 20px; font-family: Barlow Condensed; font-size: 18px; color: var(--text-muted);">Loading content...</div>
        </div>
      </div>
    `;
    container.appendChild(rowSection);
  });
}

function renderRowCards(row, rowIndex) {
  const wrapper = document.getElementById(`row-wrapper-${rowIndex}`);
  if (!wrapper) return;
  wrapper.innerHTML = '';

  const fragment = document.createDocumentFragment();
  row.items.forEach((item, colIndex) => {
    const card = document.createElement('div');
    card.className = 'card focusable';
    card.id = `card-${rowIndex}-${colIndex}`;
    card.setAttribute('data-row', rowIndex);
    card.setAttribute('data-col', colIndex);
    card.setAttribute('data-id', item.id);
    card.setAttribute('data-type', item.media_type || row.type);

    const title = item.title || item.name || 'Untitled';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : '0.0';
    const year = (item.release_date || item.first_air_date || '----').split('-')[0];

    let badgeHtml = '';
    if (item.vote_average && item.vote_average > 0) {
      badgeHtml += `<span class="card-badge badge-rating">★ ${rating}</span>`;
    }
    if (item.is_new) {
      badgeHtml += `<span class="card-badge badge-new">NEW</span>`;
    }

    const mediaLabel = item.media_type || row.type;
    if (item.poster_path) {
      const posterUrl = `${APP.tmdbImageBase}${item.poster_path}`;
      card.innerHTML = `
        <div class="badge-container">${badgeHtml}</div>
        <img class="card-img" data-src="${posterUrl}" data-title="${title}" src="" alt="${title}">
        <div class="card-overlay">
          <h4 class="card-title">${title}</h4>
          <div class="card-info">
            <span>${year}</span>
            <span class="card-media-type">${mediaLabel}</span>
          </div>
        </div>
      `;
      const img = card.querySelector('.card-img');
      imageObserver.observe(img);
    } else {
      card.innerHTML = `
        <div class="badge-container">${badgeHtml}</div>
        ${getCardFallbackHtml(title)}
        <div class="card-overlay">
          <h4 class="card-title">${title}</h4>
          <div class="card-info">
            <span>${year}</span>
            <span class="card-media-type">${mediaLabel}</span>
          </div>
        </div>
      `;
    }
    fragment.appendChild(card);
  });
  wrapper.appendChild(fragment);

  positionHorizontalRow(rowIndex, rowIndex === APP.focusedRow && APP.focusZone === 'rows' ? APP.focusedCol : 0);
}

function renderHeroItem() {
  if (APP.heroItems.length === 0) return;
  const item = APP.heroItems[APP.heroIndex];

  const bg = document.getElementById('hero-bg');
  const title = document.getElementById('hero-title');
  const tagline = document.getElementById('hero-tagline');
  const rating = document.getElementById('hero-rating');
  const year = document.getElementById('hero-year');
  const genres = document.getElementById('hero-genres');

  if (item.backdrop_path) {
    bg.style.backgroundImage = `url(${APP.tmdbBackdropBase}${item.backdrop_path})`;
    bg.classList.add('active');
  } else {
    bg.style.background = 'linear-gradient(135deg, #111, #222)';
    bg.classList.add('active');
  }

  title.innerText = item.title || item.name || 'Featured Title';
  tagline.innerText = item.overview || 'Featured item description unavailable.';
  rating.innerText = `★ ${item.vote_average ? item.vote_average.toFixed(1) : '0.0'}`;
  year.innerText = (item.release_date || item.first_air_date || '----').split('-')[0];

  genres.innerHTML = '';
  if (item.genre_ids) {
    const fragment = document.createDocumentFragment();
    item.genre_ids.slice(0, 3).forEach(gid => {
      const name = APP.activeTab === 'movies' ? APP.movieGenres[gid] : APP.tvGenres[gid];
      if (name) {
        const pill = document.createElement('span');
        pill.className = 'genre-pill';
        pill.innerText = name;
        fragment.appendChild(pill);
      }
    });
    genres.appendChild(fragment);
  }

  const indicators = document.getElementById('hero-indicators');
  indicators.innerHTML = '';
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < APP.heroItems.length; i++) {
    const dot = document.createElement('div');
    dot.className = `indicator-dot ${i === APP.heroIndex ? 'active' : ''}`;
    fragment.appendChild(dot);
  }
  indicators.appendChild(fragment);
}

function nextHeroItem() {
  APP.heroIndex = (APP.heroIndex + 1) % APP.heroItems.length;
  renderHeroItem();
}

function startHeroRotation() {
  if (APP.heroInterval) clearInterval(APP.heroInterval);
  APP.heroInterval = setInterval(() => {
    if (APP.focusZone !== 'hero' && APP.screen === 'home') {
      nextHeroItem();
    }
  }, 8000);
}

function stopHeroRotation() {
  if (APP.heroInterval) {
    clearInterval(APP.heroInterval);
    APP.heroInterval = null;
  }
}

async function showDetailScreen(id, type) {
  showLoading(true, 'Fetching details...');
  stopHeroRotation();

  if (APP.screen === 'detail') {
    APP.detailHistory.push(APP.currentDetail);
  }

  try {
    const detail = await fetchDetailContent(id, type);
    APP.currentDetail = detail;
    renderDetailScreenContent();

    if (type === 'tv') {
      document.getElementById('tv-picker-section').classList.remove('hidden');
      renderTVSeasonsList();
      const defaultSeason = detail.seasons && detail.seasons.length > 0 ? detail.seasons[0].season_number : 1;
      await loadSeasonEpisodes(id, defaultSeason);
    } else {
      document.getElementById('tv-picker-section').classList.add('hidden');
    }

    initDetailZones();
    openScreen('detail');
    updateDetailFocus();
  } catch (err) {
    console.error(err);
    showToast("Failed to fetch detailed info.", true);
  } finally {
    showLoading(false);
  }
}

function renderDetailScreenContent() {
  const detail = APP.currentDetail;
  const poster = document.getElementById('detail-poster');
  const title = document.getElementById('detail-title');
  const tagline = document.getElementById('detail-tagline');
  const metaRow = document.getElementById('detail-meta-row');
  const overview = document.getElementById('detail-overview');

  if (detail.poster_path) {
    poster.src = `${APP.tmdbPosterBase}${detail.poster_path}`;
    poster.classList.remove('hidden');
  } else {
    poster.src = '';
    poster.classList.add('hidden');
  }

  title.innerText = detail.title || detail.name || 'Untitled';
  tagline.innerText = detail.tagline ? `"${detail.tagline}"` : '';
  overview.innerText = detail.overview || 'Overview narrative is currently unavailable.';

  updateDetailWatchlistButton();

  metaRow.innerHTML = '';
  const rating = detail.vote_average ? detail.vote_average.toFixed(1) : '0.0';
  metaRow.appendChild(createMetaPill(`<span class="detail-star">★</span> ${rating}`));

  if (detail.media_type === 'movie') {
    const runtime = detail.runtime ? `${detail.runtime} min` : 'N/A';
    metaRow.appendChild(createMetaPill(runtime));
  } else {
    const seasons = detail.number_of_seasons ? `${detail.number_of_seasons} Seasons` : 'N/A';
    metaRow.appendChild(createMetaPill(seasons));
  }

  const year = (detail.release_date || detail.first_air_date || '----').split('-')[0];
  metaRow.appendChild(createMetaPill(year));

  if (detail.genres) {
    detail.genres.slice(0, 3).forEach(g => {
      metaRow.appendChild(createMetaPill(g.name));
    });
  }

  const castWrapper = document.getElementById('cast-chips-wrapper');
  castWrapper.innerHTML = '';
  if (detail.credits && detail.credits.cast && detail.credits.cast.length > 0) {
    document.getElementById('cast-section').classList.remove('hidden');
    detail.credits.cast.slice(0, 8).forEach((actor, colIdx) => {
      const chip = document.createElement('div');
      chip.className = 'cast-chip focusable';
      chip.id = `cast-actor-${colIdx}`;
      chip.setAttribute('data-col', colIdx);

      let avatarHtml;
      if (actor.profile_path) {
        avatarHtml = `<img class="cast-avatar" data-src="https://image.tmdb.org/t/p/w185${actor.profile_path}" src="" alt="${actor.name}">`;
      } else {
        const initials = actor.name.split(' ').map(n => n[0]).join('').slice(0, 2);
        avatarHtml = `<div class="cast-avatar-fallback">${initials}</div>`;
      }

      chip.innerHTML = `
        ${avatarHtml}
        <div class="cast-name-wrap">
          <span class="cast-name">${actor.name}</span>
          <span class="cast-character">${actor.character || 'Actor'}</span>
        </div>
      `;
      castWrapper.appendChild(chip);
    });
    castWrapper.querySelectorAll('.cast-avatar').forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    document.getElementById('cast-section').classList.add('hidden');
  }

  renderDetailRelatedRows();
}

function updateDetailWatchlistButton() {
  const watchlistBtn = document.getElementById('detail-watchlist-btn');
  const inWatchlist = APP.watchlist.some(item => item.id == APP.currentDetail.id && item.media_type == APP.currentDetail.media_type);
  watchlistBtn.innerText = inWatchlist ? '✓ IN WATCHLIST' : '+ WATCHLIST';
  watchlistBtn.style.color = inWatchlist ? 'var(--primary-accent)' : '#fff';
}

function renderTVSeasonsList() {
  const tabs = document.getElementById('season-tabs');
  tabs.innerHTML = '';
  const seasons = APP.currentDetail.seasons || [];
  seasons.forEach((season, idx) => {
    const tab = document.createElement('div');
    tab.className = `season-tab focusable ${idx === 0 ? 'active' : ''}`;
    tab.id = `season-tab-${idx}`;
    tab.setAttribute('data-col', idx);
    tab.setAttribute('data-season-number', season.season_number);
    tab.innerText = season.name || `S${season.season_number}`;
    tabs.appendChild(tab);
  });
}

function renderTVSeasonEpisodes() {
  const grid = document.getElementById('episodes-grid');
  grid.innerHTML = '';

  if (APP.currentSeasonEpisodes.length === 0) {
    grid.innerHTML = '<div class="empty-episodes-msg">No episodes listed.</div>';
    return;
  }

  const fragment = document.createDocumentFragment();
  APP.currentSeasonEpisodes.forEach((ep, idx) => {
    const card = document.createElement('div');
    card.className = 'episode-card focusable';
    card.id = `episode-card-${idx}`;

    const row = Math.floor(idx / 4);
    const col = idx % 4;
    card.setAttribute('data-row', row);
    card.setAttribute('data-col', col);
    card.setAttribute('data-ep-num', ep.episode_number);

    const epTitle = ep.name || `Episode ${ep.episode_number}`;
    const date = ep.air_date ? new Date(ep.air_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown date';

    let thumbUrl = '';
    if (ep.still_path) {
      thumbUrl = `https://image.tmdb.org/t/p/w300${ep.still_path}`;
    }

    card.innerHTML = `
      <div class="episode-thumb-wrap">
        ${thumbUrl
          ? `<img class="episode-thumb" data-src="${thumbUrl}" src="" alt="${epTitle}">`
          : `<div class="card-fallback"><svg class="fallback-svg" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 12H5V6h14v9z"/></svg></div>`}
        <span class="episode-number-badge">S${ep.season_number} E${ep.episode_number}</span>
      </div>
      <div class="episode-card-info">
        <h4 class="episode-title">${epTitle}</h4>
        <span class="episode-date">${date}</span>
      </div>
    `;

    if (ep.still_path) {
      const img = card.querySelector('.episode-thumb');
      imageObserver.observe(img);
    }
    fragment.appendChild(card);
  });
  grid.appendChild(fragment);
}

/**
 * Delegated click handler for detail-screen focusable elements.
 * Supports mouse/trackpad clicks on buttons, season tabs,
 * episode cards, cast chips and similar/rec cards.
 */
document.getElementById('detail-screen').addEventListener('click', function (e) {
  const target = e.target.closest('.focusable');
  if (!target) return;

  if (target.classList.contains('detail-btn')) {
    APP.focusedCol = parseInt(target.getAttribute('data-btn-idx'));
    APP.focusZone = FOCUS_ZONES.DETAIL_ACTIONS;
    triggerDetailEnterAction(FOCUS_ZONES.DETAIL_ACTIONS);
    updateFocusVisuals();
  } else if (target.classList.contains('season-tab')) {
    const col = parseInt(target.getAttribute('data-col'));
    APP.focusedCol = col;
    APP.focusZone = FOCUS_ZONES.SEASONS;
    triggerSeasonShiftDebounce();
    updateFocusVisuals();
  } else if (target.classList.contains('episode-card')) {
    APP.detailEpisodeRow = parseInt(target.getAttribute('data-row'));
    APP.detailEpisodeCol = parseInt(target.getAttribute('data-col'));
    APP.focusZone = FOCUS_ZONES.EPISODES;
    triggerDetailEnterAction(FOCUS_ZONES.EPISODES);
    updateFocusVisuals();
  } else if (target.classList.contains('cast-chip')) {
    const name = (target.querySelector('.cast-name') || {}).innerText || 'Actor';
    showToast(`Actor: ${name}`, false);
  } else if (target.id && target.id.startsWith('detail-card-')) {
    const rest = target.id.replace('detail-card-', '');
    const dashIdx = rest.indexOf('-');
    const zone = rest.slice(0, dashIdx);
    const col = parseInt(rest.slice(dashIdx + 1));
    APP.focusedCol = col;
    APP.focusZone = zone;
    triggerDetailEnterAction(zone);
    updateFocusVisuals();
  }
});

function initDetailZones() {
  const detail = APP.currentDetail;
  APP.detailZones = ['detail-actions'];
  if (detail.media_type === 'tv') {
    APP.detailZones.push('seasons');
    APP.detailZones.push('episodes');
  }
  if (detail.credits && detail.credits.cast && detail.credits.cast.length > 0) {
    APP.detailZones.push('cast');
  }
  if (detail.similar && detail.similar.length > 0) {
    APP.detailZones.push('similar');
  }
  if (detail.recommendations && detail.recommendations.length > 0) {
    APP.detailZones.push('recs');
  }
  APP.detailZoneIndex = 0;
  APP.focusedCol = 0;
  APP.detailEpisodeRow = 0;
  APP.detailEpisodeCol = 0;
  APP.detailZoneMemory = {};
  APP.focusZone = APP.detailZones[0];
}

function renderDetailRelatedRows() {
  const container = document.getElementById('detail-rows-container');
  container.innerHTML = '';
  const detail = APP.currentDetail;

  if (detail.similar && detail.similar.length > 0) {
    const section = createRelatedRowHtml('similar', 'More Like This', detail.similar);
    container.appendChild(section);
    observeHorizontalRow('similar', detail.similar.length);
  }

  if (detail.recommendations && detail.recommendations.length > 0) {
    const section = createRelatedRowHtml('recs', 'You Might Also Like', detail.recommendations);
    container.appendChild(section);
    observeHorizontalRow('recs', detail.recommendations.length);
  }
}

function createRelatedRowHtml(secIdx, title, items) {
  const section = document.createElement('section');
  section.className = 'content-row';
  section.id = `detail-row-sec-${secIdx}`;

  let wrapperHtml = '';
  items.forEach((item, colIdx) => {
    const cardId = `detail-card-${secIdx}-${colIdx}`;
    const cardTitle = item.title || item.name || 'Untitled';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : '0.0';
    const year = (item.release_date || item.first_air_date || '----').split('-')[0];

    let badgeHtml = item.vote_average > 0 ? `<span class="card-badge badge-rating">★ ${rating}</span>` : '';

    let posterInner;
    if (item.poster_path) {
      posterInner = `<img class="card-img" data-src="${APP.tmdbImageBase}${item.poster_path}" data-title="${cardTitle}" src="" alt="${cardTitle}">`;
    } else {
      posterInner = getCardFallbackHtml(cardTitle);
    }

    wrapperHtml += `
      <div class="card focusable" id="${cardId}" data-col="${colIdx}" data-id="${item.id}" data-type="${item.media_type || APP.currentDetail.media_type}">
        <div class="badge-container">${badgeHtml}</div>
        ${posterInner}
        <div class="card-overlay">
          <h4 class="card-title">${cardTitle}</h4>
          <div class="card-info">
            <span>${year}</span>
            <span style="color: var(--primary-accent); text-transform: uppercase;">${item.media_type || APP.currentDetail.media_type}</span>
          </div>
        </div>
      </div>
    `;
  });

  section.innerHTML = `
    <div class="row-header">
      <h3 class="row-title"><span>${title}</span></h3>
    </div>
    <div class="cards-viewport">
      <div class="cards-wrapper" id="detail-row-wrapper-${secIdx}">
        ${wrapperHtml}
      </div>
    </div>
  `;
  return section;
}

function observeHorizontalRow(secIdx, count) {
  setTimeout(() => {
    const wrapper = document.getElementById(`detail-row-wrapper-${secIdx}`);
    if (wrapper) {
      wrapper.querySelectorAll('.card-img').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }, 50);
}

function openScreen(screenName) {
  if (APP.screen !== screenName) {
    APP.screenStack.push(APP.screen);
    APP.screen = screenName;
    updateScreenVisibility();
  }
}

function goBack() {
  if (APP.screen === 'player') {
    closePlayer();
    return;
  }

  if (APP.screen === 'detail' && APP.detailHistory.length > 0) {
    APP.currentDetail = APP.detailHistory.pop();
    renderDetailScreenContent();
    if (APP.currentDetail.media_type === 'tv') {
      document.getElementById('tv-picker-section').classList.remove('hidden');
      renderTVSeasonsList();
      loadSeasonEpisodes(APP.currentDetail.id, APP.currentSeasonIndex);
    } else {
      document.getElementById('tv-picker-section').classList.add('hidden');
    }
    initDetailZones();
    updateDetailFocus();
    return;
  }

  if (APP.screenStack.length > 0) {
    const prev = APP.screenStack.pop();
    APP.screen = prev;
    updateScreenVisibility();

    if (prev === 'home') {
      startHeroRotation();
      restoreHomeFocus();
    } else if (prev === 'detail') {
      updateDetailFocus();
    }
  } else {
    if (APP.screen === 'home') {
      showToast("Press exit on remote to close application");
    } else {
      APP.screen = 'home';
      updateScreenVisibility();
      startHeroRotation();
      restoreHomeFocus();
    }
  }
}

function updateScreenVisibility() {
  if (typeof clearLayoutCaches === 'function') clearLayoutCaches();
  const views = {
    'home': document.getElementById('home-view'),
    'search': document.getElementById('search-view'),
    'watchlist': document.getElementById('watchlist-view'),
    'settings': document.getElementById('settings-view'),
    'genre': document.getElementById('genre-view'),
  };

  Object.keys(views).forEach(k => {
    if (APP.screen === k) {
      views[k].classList.remove('hidden');
    } else {
      views[k].classList.add('hidden');
    }
  });

  const detailScreen = document.getElementById('detail-screen');
  detailScreen.classList.toggle('hidden', APP.screen !== 'detail');

  const playerScreen = document.getElementById('player-screen');
  playerScreen.classList.toggle('hidden', APP.screen !== 'player');
}

function restoreHomeFocus() {
  if (APP.focusZone === 'rows') {
    setTimeout(() => {
      positionHorizontalRow(APP.focusedRow, APP.focusedCol);
      alignVerticalScroll();
    }, 50);
  }
  updateFocusVisuals();
}

function updateDetailFocus() {
  updateFocusVisuals();
}

function hideAllViews() {
  ['home-view', 'search-view', 'watchlist-view', 'settings-view', 'genre-view'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
}

function toggleWatchlist() {
  const detail = APP.currentDetail;
  if (!detail) return;

  const index = APP.watchlist.findIndex(item => item.id == detail.id && item.media_type == detail.media_type);
  if (index === -1) {
    APP.watchlist.push({
      id: detail.id,
      title: detail.title || detail.name,
      name: detail.title || detail.name,
      poster_path: detail.poster_path,
      vote_average: detail.vote_average,
      release_date: detail.release_date,
      first_air_date: detail.first_air_date,
      media_type: detail.media_type
    });
    showToast("Added to Watchlist");
  } else {
    APP.watchlist.splice(index, 1);
    showToast("Removed from Watchlist");
  }
  saveWatchlist();
  updateDetailWatchlistButton();
}

function switchTabWatchlist() {
  hideAllViews();
  document.getElementById('watchlist-view').classList.remove('hidden');
  APP.screen = 'watchlist';
  renderWatchlistGrid();
  APP.focusZone = 'tabbar';
  APP.focusedCol = 3;
  updateFocusVisuals();
}

function renderWatchlistGrid() {
  const grid = document.getElementById('watchlist-grid');
  grid.innerHTML = '';

  if (APP.watchlist.length === 0) {
    grid.innerHTML = '<div class="empty-grid-msg">Your Watchlist is empty. Add movies or TV shows from details view!</div>';
    return;
  }

  const fragment = document.createDocumentFragment();
  APP.watchlist.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'card focusable';
    card.id = `watchlist-card-${idx}`;
    const row = Math.floor(idx / 6);
    const col = idx % 6;
    card.setAttribute('data-row', row);
    card.setAttribute('data-col', col);
    card.setAttribute('data-id', item.id);
    card.setAttribute('data-type', item.media_type);

    const title = item.title || item.name || 'Untitled';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : '0.0';
    const year = (item.release_date || item.first_air_date || '----').split('-')[0];

    let badgeHtml = item.vote_average > 0 ? `<span class="card-badge badge-rating">★ ${rating}</span>` : '';
    badgeHtml += `<span class="card-badge badge-type">${item.media_type}</span>`;

    let posterInner;
    if (item.poster_path) {
      posterInner = `<img class="card-img" data-src="${APP.tmdbImageBase}${item.poster_path}" data-title="${title}" src="" alt="${title}">`;
    } else {
      posterInner = getCardFallbackHtml(title);
    }

    card.innerHTML = `
      <div class="badge-container">${badgeHtml}</div>
      ${posterInner}
      <div class="card-overlay">
        <h4 class="card-title">${title}</h4>
        <div class="card-info">
          <span>${year}</span>
        </div>
      </div>
    `;

    if (item.poster_path) {
      const img = card.querySelector('.card-img');
      imageObserver.observe(img);
    }
    fragment.appendChild(card);
  });
  grid.appendChild(fragment);
}

function switchTabSearch() {
  hideAllViews();
  document.getElementById('search-view').classList.remove('hidden');
  APP.screen = 'search';
  renderKeyboard('search-keyboard-grid');
  updateSearchInputDisplay();
  document.getElementById('search-results-grid').innerHTML = '';
  document.getElementById('results-title').innerText = 'Type search characters';
  APP.focusZone = 'tabbar';
  APP.focusedCol = 2;
  updateFocusVisuals();
}

function updateSearchInputDisplay() {
  const text = document.getElementById('search-input-text');
  if (APP.searchQuery.trim() === '') {
    text.innerText = 'Type search query...';
    text.classList.add('placeholder');
  } else {
    text.innerText = APP.searchQuery;
    text.classList.remove('placeholder');
  }
}

function renderKeyboard(gridId) {
  const grid = document.getElementById(gridId);
  grid.innerHTML = '';

  KEYBOARD_LAYOUT.forEach((row, rowIdx) => {
    const keyboardRow = document.createElement('div');
    keyboardRow.className = 'keyboard-row';

    row.forEach((key, colIdx) => {
      const keyNode = document.createElement('div');
      keyNode.className = 'keyboard-key focusable';
      keyNode.id = `${gridId}-key-${rowIdx}-${colIdx}`;
      keyNode.setAttribute('data-key', key);
      keyNode.innerText = key;

      if (key === 'SPACE') keyNode.className += ' wide-3';
      if (key === 'BACKSPACE') keyNode.className += ' wide-2';
      if (key === 'CLEAR' || key === 'CLOSE') keyNode.className += ' wide-2';

      keyboardRow.appendChild(keyNode);
    });
    grid.appendChild(keyboardRow);
  });
}

function triggerSearchTextChange() {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(async () => {
    const query = APP.searchQuery.trim();
    if (query.length > 1) {
      await performSearchQuery(query);
    } else {
      document.getElementById('search-results-grid').innerHTML = '';
      document.getElementById('results-title').innerText = 'Type search characters';
    }
  }, 400);
}

function renderSearchResults(results) {
  const grid = document.getElementById('search-results-grid');
  grid.innerHTML = '';

  if (results.length === 0) {
    document.getElementById('results-title').innerText = `No items found for "${APP.searchQuery}"`;
    return;
  }

  document.getElementById('results-title').innerText = `Search Results (${results.length})`;
  const fragment = document.createDocumentFragment();
  results.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'card focusable';
    card.id = `search-card-${idx}`;
    const row = Math.floor(idx / 4);
    const col = idx % 4;
    card.setAttribute('data-row', row);
    card.setAttribute('data-col', col);
    card.setAttribute('data-id', item.id);
    card.setAttribute('data-type', item.media_type);

    const title = item.title || item.name || 'Untitled';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : '0.0';
    const year = (item.release_date || item.first_air_date || '----').split('-')[0];

    let badgeHtml = item.vote_average > 0 ? `<span class="card-badge badge-rating">★ ${rating}</span>` : '';
    badgeHtml += `<span class="card-badge badge-type">${item.media_type}</span>`;

    let posterInner;
    if (item.poster_path) {
      posterInner = `<img class="card-img" data-src="${APP.tmdbImageBase}${item.poster_path}" data-title="${title}" src="" alt="${title}">`;
    } else {
      posterInner = getCardFallbackHtml(title);
    }

    card.innerHTML = `
      <div class="badge-container">${badgeHtml}</div>
      ${posterInner}
      <div class="card-overlay">
        <h4 class="card-title">${title}</h4>
        <div class="card-info">
          <span>${year}</span>
        </div>
      </div>
    `;

    if (item.poster_path) {
      const img = card.querySelector('.card-img');
      imageObserver.observe(img);
    }
    fragment.appendChild(card);
  });
  grid.appendChild(fragment);
}

function switchTabSettings() {
  hideAllViews();
  document.getElementById('settings-view').classList.remove('hidden');
  APP.screen = 'settings';
  APP.focusZone = 'tabbar';
  APP.focusedCol = 4;
  updateFocusVisuals();
}

function openSetupScreen() {
  document.getElementById('app').classList.add('hidden');
  document.getElementById('setup-screen').classList.remove('hidden');
  APP.screen = 'settings-keyboard';
  APP.setupQuery = APP.tmdbApiKey === 'YOUR_TMDB_API_KEY' ? '' : APP.tmdbApiKey;
  APP.setupTarget = 'tmdbApiKey';
  renderKeyboard('setup-keyboard-grid');
  updateSetupInputDisplay();
  APP.focusZone = 'keyboard';
  APP.focusedRow = 0;
  APP.focusedCol = 0;
  updateFocusVisuals();
}

function updateSetupInputDisplay() {
  const display = document.getElementById('setup-input-display');
  if (APP.setupQuery.trim() === '') {
    display.innerText = 'Enter key...';
    display.classList.add('placeholder');
  } else {
    display.innerText = APP.setupQuery;
    display.classList.remove('placeholder');
  }
}

function launchPlayer(tmdbId, mediaType, seasonNum = null, epNum = null) {
  let embedUrl;
  let playTitle = APP.currentDetail ? (APP.currentDetail.title || APP.currentDetail.name) : 'Video';
  let playSubtitle = '';
  const langParam = APP.subtitleLang ? `&ds_lang=${APP.subtitleLang}` : '';

  if (mediaType === 'movie') {
    embedUrl = `${APP.vidsrcEmbedBase}/movie?tmdb=${tmdbId}&autoplay=1${langParam}`;
    playSubtitle = 'Feature Movie';
  } else {
    if (seasonNum !== null && epNum !== null) {
      embedUrl = `${APP.vidsrcEmbedBase}/tv?tmdb=${tmdbId}&season=${seasonNum}&episode=${epNum}&autoplay=1&autonext=1${langParam}`;
      playSubtitle = `Season ${seasonNum} - Episode ${epNum}`;
      const episode = APP.currentSeasonEpisodes.find(e => e.episode_number == epNum);
      if (episode && episode.name) {
        playSubtitle += `: ${episode.name}`;
      }
    } else {
      embedUrl = `${APP.vidsrcEmbedBase}/tv?tmdb=${tmdbId}${langParam}`;
      playSubtitle = 'TV Series Discovery';
    }
  }

  showLoading(true, 'Buffering stream source...');
  const iframe = document.getElementById('player-iframe');
  iframe.src = embedUrl;

  iframe.addEventListener('load', () => {
    showLoading(false);
    openScreen('player');
    showPlayerHud(playTitle, playSubtitle);
  });

  setTimeout(() => {
    if (APP.screen !== 'player') {
      showLoading(false);
      openScreen('player');
      showPlayerHud(playTitle, playSubtitle);
    }
  }, 3000);
}

function launchTrailer() {
  const detail = APP.currentDetail;
  if (!detail || !detail.videos || !detail.videos.results || detail.videos.results.length === 0) {
    showToast("No trailer available.", true);
    return;
  }

  const trailer = detail.videos.results.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')) || detail.videos.results[0];
  if (trailer && trailer.key) {
    const ytEmbedUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
    showLoading(true, 'Opening trailer...');

    const iframe = document.getElementById('player-iframe');
    iframe.src = ytEmbedUrl;

    iframe.addEventListener('load', () => {
      showLoading(false);
      openScreen('player');
      showPlayerHud(`${detail.title || detail.name} - Official Trailer`, 'YouTube Preview');
    });
  } else {
    showToast("Trailer key not found.", true);
  }
}

function showPlayerHud(title, subtitle) {
  document.getElementById('player-hud-title').innerText = title;
  document.getElementById('player-hud-subtitle').innerText = subtitle;
  const hud = document.getElementById('player-hud');
  hud.classList.remove('hidden');

  if (hudTimeout) clearTimeout(hudTimeout);
  hudTimeout = setTimeout(() => {
    hud.classList.add('hidden');
  }, 3000);
}

function closePlayer() {
  document.getElementById('player-iframe').src = '';
  goBack();
}

async function loadGenreBrowseScreen(genreId, name, type) {
  showLoading(true, `Discovering ${name}...`);
  APP.currentGenreId = genreId;
  APP.currentGenreName = name;
  APP.currentGenreType = type;
  APP.currentGenrePage = 1;
  APP.genreGridItems = [];
  APP.genreLoading = false;

  document.getElementById('genre-grid-title').innerText = `${type === 'movie' ? 'Movies' : 'TV Shows'} > ${name}`;
  document.getElementById('genre-grid').innerHTML = '';

  try {
    await fetchGenreGridPage();
    openScreen('genre');
    APP.focusZone = 'grid';
    APP.focusedRow = 0;
    APP.focusedCol = 0;
    updateFocusVisuals();
  } catch (e) {
    showToast("Error loading genre grid discover page.", true);
  } finally {
    showLoading(false);
  }
}

function renderGenreGrid(newItems) {
  const grid = document.getElementById('genre-grid');
  const startIdx = APP.genreGridItems.length - newItems.length;
  const fragment = document.createDocumentFragment();

  newItems.forEach((item, idx) => {
    const actualIdx = startIdx + idx;
    const card = document.createElement('div');
    card.className = 'card focusable';
    card.id = `genre-card-${actualIdx}`;
    const row = Math.floor(actualIdx / 6);
    const col = actualIdx % 6;
    card.setAttribute('data-row', row);
    card.setAttribute('data-col', col);
    card.setAttribute('data-id', item.id);
    card.setAttribute('data-type', item.media_type);

    const title = item.title || item.name || 'Untitled';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : '0.0';
    const year = (item.release_date || item.first_air_date || '----').split('-')[0];

    let badgeHtml = item.vote_average > 0 ? `<span class="card-badge badge-rating">★ ${rating}</span>` : '';

    let posterInner;
    if (item.poster_path) {
      posterInner = `<img class="card-img" data-src="${APP.tmdbImageBase}${item.poster_path}" data-title="${title}" src="" alt="${title}">`;
    } else {
      posterInner = getCardFallbackHtml(title);
    }

    card.innerHTML = `
      <div class="badge-container">${badgeHtml}</div>
      ${posterInner}
      <div class="card-overlay">
        <h4 class="card-title">${title}</h4>
        <div class="card-info">
          <span>${year}</span>
        </div>
      </div>
    `;

    if (item.poster_path) {
      const img = card.querySelector('.card-img');
      imageObserver.observe(img);
    }
    fragment.appendChild(card);
  });
  grid.appendChild(fragment);
}
