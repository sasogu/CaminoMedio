const STORAGE_KEY = 'cm-theme-mode';
const root = document.documentElement;
const body = document.body;
const prefersDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
const logo = document.getElementById('logo');

function computeMode() {
  const explicit = root.getAttribute('data-theme');
  if (explicit === 'light' || explicit === 'dark') return explicit;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (_) {}
  return prefersDark && prefersDark.matches ? 'dark' : 'light';
}

function apply(mode) {
  const isDark = mode === 'dark';
  body.classList.toggle('dark-mode', isDark);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', isDark ? '#0b0b0c' : '#ffffff');
  if (logo) {
    const darkSrc = logo.getAttribute('data-dark') || '../assets/img/logoblanco.png';
    const lightSrc = logo.getAttribute('data-light') || '../assets/img/logonegro.png';
    logo.src = isDark ? darkSrc : lightSrc;
  }
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
    if (event.key === STORAGE_KEY) apply(computeMode());
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
