const fs = require('fs');
const path = require('path');

let cached = null;

/** Load window.SITE from public/config.js (single source of truth). */
function loadSite() {
  if (cached) return cached;
  const file = path.join(__dirname, '..', 'public', 'config.js');
  const code = fs.readFileSync(file, 'utf8');
  const window = {};
  // eslint-disable-next-line no-new-func
  const fn = new Function('window', `${code}\nreturn window.SITE;`);
  const site = fn(window);
  if (!site || typeof site !== 'object') {
    throw new Error('Failed to load SITE from public/config.js');
  }
  cached = site;
  return site;
}

function clearSiteCache() {
  cached = null;
}

module.exports = { loadSite, clearSiteCache };
