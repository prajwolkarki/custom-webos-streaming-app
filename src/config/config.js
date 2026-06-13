const CONFIG = {
  API: {
    BASE_URL: 'https://vsembed.ru',
    MOVIE_EMBED: '/embed/movie',
    TV_EMBED: '/embed/tv',
    LATEST_MOVIES: '/movies/latest',
    LATEST_TVSHOWS: '/tvshows/latest',
    LATEST_EPISODES: '/episodes/latest'
  },
  TMDB: {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: '2668df122d5919267bedb70261c67a5e',
    IMAGE_BASE: 'https://image.tmdb.org/t/p/w500',
    BACKDROP_BASE: 'https://image.tmdb.org/t/p/original',
    POSTER_SIZE: 'w500'
  },
  APP: {
    NAME: 'CineStream',
    VERSION: '1.0.0',
    LANGUAGE: 'en-US',
    ITEMS_PER_PAGE: 20,
    MAX_RECENT_ITEMS: 10
  },
  NAVIGATION: {
    SCROLL_SPEED: 300,
    FOCUS_DEBOUNCE: 150,
    OVERSCAN_MARGIN: 60
  },
  PLAYER: {
    DEFAULT_AUTOPLAY: true,
    DEFAULT_AUTO_NEXT: true,
    DEFAULT_SUBTITLE_LANG: ''
  }
};

const MOVIE_CATEGORIES = [
  { id: 'trending_day', title: 'Trending Today', type: 'movie', endpoint: '/trending/movie/day' },
  { id: 'trending_week', title: 'Trending This Week', type: 'movie', endpoint: '/trending/movie/week' },
  { id: 'now_playing', title: 'Now Playing in Theaters', type: 'movie', endpoint: '/movie/now_playing' },
  { id: 'top_rated', title: 'Top Rated All Time', type: 'movie', endpoint: '/movie/top_rated' },
  { id: 'popular', title: 'Most Popular', type: 'movie', endpoint: '/movie/popular' },
  { id: 'upcoming', title: 'Upcoming Releases', type: 'movie', endpoint: '/movie/upcoming' },
  { id: 'vidsrc_latest', title: 'Recently Added (VidSrc)', type: 'movie', isVidSrc: true, endpoint: 'https://vsembed.ru/movies/latest/page-1.json' },
  { id: 'action', title: 'Action & Adventure', type: 'movie', endpoint: '/discover/movie?with_genres=28&sort_by=popularity.desc' },
  { id: 'comedy', title: 'Comedy', type: 'movie', endpoint: '/discover/movie?with_genres=35&sort_by=popularity.desc' },
  { id: 'horror', title: 'Horror & Thriller', type: 'movie', endpoint: '/discover/movie?with_genres=27,53&sort_by=popularity.desc' },
  { id: 'scifi', title: 'Science Fiction', type: 'movie', endpoint: '/discover/movie?with_genres=878&sort_by=popularity.desc' },
  { id: 'drama', title: 'Drama', type: 'movie', endpoint: '/discover/movie?with_genres=18&sort_by=popularity.desc' },
  { id: 'animation', title: 'Animation & Family', type: 'movie', endpoint: '/discover/movie?with_genres=16,10751&sort_by=popularity.desc' }
];

const TV_CATEGORIES = [
  { id: 'trending_tv_day', title: 'Trending TV Today', type: 'tv', endpoint: '/trending/tv/day' },
  { id: 'airing_today', title: 'Airing Right Now', type: 'tv', endpoint: '/tv/airing_today' },
  { id: 'on_the_air', title: 'On The Air This Week', type: 'tv', endpoint: '/tv/on_the_air' },
  { id: 'top_rated_tv', title: 'Top Rated Series', type: 'tv', endpoint: '/tv/top_rated' },
  { id: 'popular_tv', title: 'Most Popular Shows', type: 'tv', endpoint: '/tv/popular' },
  { id: 'vidsrc_latest_tv', title: 'Latest Episodes Added (VidSrc)', type: 'tv', isVidSrc: true, endpoint: 'https://vidsrc-embed.ru/episodes/latest/page-1.json' },
  { id: 'action_tv', title: 'Action TV', type: 'tv', endpoint: '/discover/tv?with_genres=10759&sort_by=popularity.desc' },
  { id: 'crime_tv', title: 'Crime & Mystery', type: 'tv', endpoint: '/discover/tv?with_genres=80,9648&sort_by=popularity.desc' },
  { id: 'comedy_tv', title: 'Comedy Series', type: 'tv', endpoint: '/discover/tv?with_genres=35&sort_by=popularity.desc' },
  { id: 'scifi_tv', title: 'Sci-Fi & Fantasy', type: 'tv', endpoint: '/discover/tv?with_genres=10765&sort_by=popularity.desc' },
  { id: 'drama_tv', title: 'Drama Series', type: 'tv', endpoint: '/discover/tv?with_genres=18&sort_by=popularity.desc' },
  { id: 'doc_tv', title: 'Documentary', type: 'tv', endpoint: '/discover/tv?with_genres=99&sort_by=popularity.desc' }
];

const KEYBOARD_LAYOUT = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '-'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '.', '_', '/'],
  ['CAPS', 'SPACE', 'BACKSPACE', 'CLEAR', 'CLOSE']
];
