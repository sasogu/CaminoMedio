const STORAGE_KEY = 'cm-theme-mode';
const LEGACY_KEY = 'modoOscuro';
const root = document.documentElement;
const body = document.body;
const prefersDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

function computeMode() {
  const explicit = root.getAttribute('data-theme');
  if (explicit === 'light' || explicit === 'dark') return explicit;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy === '1' || legacy === '0') return legacy === '1' ? 'dark' : 'light';
  } catch (_) {}
  return prefersDark && prefersDark.matches ? 'dark' : 'light';
}

function apply(mode) {
  const isDark = mode === 'dark';
  if (mode === 'dark' || mode === 'light') root.setAttribute('data-theme', mode);
  else root.removeAttribute('data-theme');
  body.classList.toggle('dark-mode', isDark);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', isDark ? '#0b0b0c' : '#ffffff');
  const logoEl = document.getElementById('logo');
  if (logoEl) {
    const darkSrc = logoEl.getAttribute('data-dark') || '../assets/img/logoblanco.png';
    const lightSrc = logoEl.getAttribute('data-light') || '../assets/img/logonegro.png';
    logoEl.src = isDark ? darkSrc : lightSrc;
  }
  try { localStorage.setItem(LEGACY_KEY, isDark ? '1' : '0'); } catch (_) {}
}

function init() {
  apply(computeMode());
  if (prefersDark) {
    const listener = () => {
      const explicit = root.getAttribute('data-theme');
      if (!explicit) apply(computeMode());
    };
    if (prefersDark.addEventListener) prefersDark.addEventListener('change', listener);
    else if (prefersDark.addListener) prefersDark.addListener(listener);
  }
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY || event.key === LEGACY_KEY) apply(computeMode());
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
