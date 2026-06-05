let lastKeyPressTime = 0;

function showToast(message, isError = false) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'error' : ''}`;
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      ${isError
        ? '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>'
        : '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>'}
    </svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  toast.offsetHeight;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function getCardFallbackHtml(title) {
  return `
    <div class="card-fallback">
      <svg class="fallback-svg" viewBox="0 0 24 24">
        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 8H2v12h20V4z"/>
      </svg>
      <div class="fallback-text">${title}</div>
    </div>
  `;
}

function createMetaPill(html) {
  const pill = document.createElement('div');
  pill.className = 'genre-pill';
  pill.style.fontSize = '18px';
  pill.style.background = 'rgba(255,255,255,0.08)';
  pill.innerHTML = html;
  return pill;
}

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.addEventListener('load', () => img.classList.add('loaded'));
        img.addEventListener('error', () => {
          const parent = img.parentNode;
          if (parent) {
            const title = img.dataset.title || 'No Title';
            parent.innerHTML = getCardFallbackHtml(title);
          }
        });
        img.removeAttribute('data-src');
      }
      observer.unobserve(img);
    }
  });
}, {
  root: null,
  rootMargin: '100px 300px 100px 300px',
  threshold: 0.01
});

function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => { clearTimeout(timeout); func(...args); };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function isImdbId(id) {
  return /^tt\d+$/i.test(id);
}

function isTmdbId(id) {
  return /^\d+$/.test(id);
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function isWebOS() {
  return navigator.userAgent.includes('Web0S') ||
         navigator.userAgent.includes('webOS') ||
         typeof webOS !== 'undefined';
}

function parseLatestVidSrc(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    if (Array.isArray(data.result)) return data.result;
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data)) return data.data;
    for (const key in data) {
      if (Array.isArray(data[key])) return data[key];
    }
  }
  return [];
}
