function getWebOSVersion() {
  if (!isWebOS()) return null;
  const match = navigator.userAgent.match(/Web0S\/([\d.]+)/);
  return match ? match[1] : null;
}

function registerSystemEvents() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('[WebOS] App hidden');
    } else {
      console.log('[WebOS] App visible');
    }
  });
}

function initWebOS() {
  if (!isWebOS()) {
    console.log('[WebOS] Not running on webOS');
    return;
  }
  registerSystemEvents();
  console.log('[WebOS] Service initialized');
}
