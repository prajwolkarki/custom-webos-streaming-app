function testKeyCodes() {
  console.log('Testing Key Codes...');
  console.assert(KEY_CODES.LEFT === 37, 'LEFT key code wrong');
  console.assert(KEY_CODES.UP === 38, 'UP key code wrong');
  console.assert(KEY_CODES.RIGHT === 39, 'RIGHT key code wrong');
  console.assert(KEY_CODES.DOWN === 40, 'DOWN key code wrong');
  console.assert(KEY_CODES.OK === 13, 'OK key code wrong');
  console.assert(KEY_CODES.BACK === 461, 'BACK key code wrong');
  console.log('Key codes tests passed!');
}

function testConstants() {
  console.log('Testing Constants...');
  console.assert(SCREENS.HOME === 'home', 'SCREEN HOME wrong');
  console.assert(SCREENS.DETAIL === 'detail', 'SCREEN DETAIL wrong');
  console.assert(CONTENT_TYPES.MOVIE === 'movie', 'CONTENT_TYPE MOVIE wrong');
  console.assert(CONTENT_TYPES.TV === 'tv', 'CONTENT_TYPE TV wrong');
  console.assert(FOCUS_ZONES.TABBAR === 'tabbar', 'FOCUS_ZONE TABBAR wrong');
  console.assert(FOCUS_ZONES.ROWS === 'rows', 'FOCUS_ZONE ROWS wrong');
  console.assert(STORAGE_KEYS.TMDB_API_KEY === 'tmdb_api_key', 'STORAGE_KEY TMDB_API_KEY wrong');
  console.log('Constants tests passed!');
}

function testCategories() {
  console.log('Testing Categories...');
  console.assert(MOVIE_CATEGORIES.length > 0, 'Movie categories empty');
  console.assert(TV_CATEGORIES.length > 0, 'TV categories empty');
  console.assert(MOVIE_CATEGORIES[0].id === 'trending_day', 'First movie category wrong');
  console.assert(TV_CATEGORIES[0].id === 'trending_tv_day', 'First TV category wrong');
  console.assert(KEYBOARD_LAYOUT.length === 5, 'Keyboard layout rows wrong');
  console.assert(KEYBOARD_LAYOUT[0].length === 10, 'Keyboard layout first row cols wrong');
  console.log('Categories tests passed!');
}

if (typeof window !== 'undefined') {
  console.log('Running integration tests...');
  testKeyCodes();
  testConstants();
  testCategories();
  console.log('All integration tests completed!');
}
