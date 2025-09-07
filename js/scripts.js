/*!
* Start Bootstrap - Grayscale v7.0.6 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', () => {
  // Asegurar color de la barra del sistema según tema
  (function ensureThemeColor(){
    try {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      function setThemeColor(){
        const dark = mq.matches;
        let tag = document.querySelector('meta[name="theme-color"]');
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('name','theme-color');
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', dark ? '#0b0b0c' : '#ffffff');
      }
      setThemeColor();
      if (mq.addEventListener) mq.addEventListener('change', setThemeColor); else mq.addListener(setThemeColor);
    } catch(_) {}
  })();
  // Navbar helpers: sólo si existe navbar en la página
  const mainNav = document.querySelector('#mainNav');
  if (mainNav) {
    const navbarShrink = () => {
      if (window.scrollY === 0) mainNav.classList.remove('navbar-shrink');
      else mainNav.classList.add('navbar-shrink');
    };
    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    if (window.bootstrap && typeof window.bootstrap.ScrollSpy === 'function') {
      new window.bootstrap.ScrollSpy(document.body, { target: '#mainNav', rootMargin: '0px 0px -40%' });
    }

    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
      const items = Array.from(document.querySelectorAll('#navbarNavDropdown .nav-link'));
      items.forEach((item) => {
        item.addEventListener('click', () => {
          const isDropdownToggle = item.classList.contains('dropdown-toggle') || item.getAttribute('data-bs-toggle') === 'dropdown';
          if (isDropdownToggle) return;
          if (window.getComputedStyle(navbarToggler).display !== 'none') navbarToggler.click();
        });
      });
    }
  }

  // Registrar Service Worker y pedir versión para el footer si existe #sw-version
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Intentar registrar el SW desde varias rutas relativas
      (async function registerSW() {
        const candidates = ['./service-worker.js', '../service-worker.js', '../../service-worker.js'];
        let reg = null;
        for (const url of candidates) {
          try {
            reg = await navigator.serviceWorker.register(url);
            break;
          } catch (e) {
            // intenta siguiente
          }
        }
        if (!reg) { console.error('No se pudo registrar el Service Worker desde rutas relativas.'); return; }
          // Forzar activación cuando haya actualización disponible
          reg.onupdatefound = function () {
            const nw = reg.installing;
            if (!nw) return;
            nw.onstatechange = function () {
              if (nw.state === 'installed' && navigator.serviceWorker.controller) {
                nw.postMessage({ type: 'CHECK_UPDATE' });
              }
            };
          };

          // Colocar versión en el footer
          function attachVersionListener() {
            navigator.serviceWorker.addEventListener('message', (e) => {
              if (e.data && e.data.type === 'VERSION') {
                const el = document.getElementById('sw-version');
                if (el) el.textContent = e.data.value;
              }
            });
          }
          attachVersionListener();

          function requestVersion() {
            const ctl = navigator.serviceWorker.controller || reg.active || reg.waiting || reg.installing;
            if (ctl && typeof ctl.postMessage === 'function') ctl.postMessage({ type: 'GET_VERSION' });
          }
          if (navigator.serviceWorker.controller) requestVersion();
          else {
            navigator.serviceWorker.ready.then(requestVersion);
            navigator.serviceWorker.addEventListener('controllerchange', requestVersion);
          }
      })().catch((err) => console.error('SW register error:', err));
    });
  }

  // Botón de instalación PWA (con caducidad 15 días) + avisos
  (function () {
    let deferredPrompt = null;
    const DISMISS_KEY = 'pwaInstallDismissedAt';
    const DISMISS_MS = 15 * 24 * 60 * 60 * 1000;

    // Migración de clave antigua si existiera
    if (localStorage.getItem('pwaInstallDismissed') === '1' && !localStorage.getItem(DISMISS_KEY)) {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
      localStorage.removeItem('pwaInstallDismissed');
    }

    // Si ya existe el botón en el DOM, reutilizarlo; si no, crearlo
    let btn = document.getElementById('install-pwa');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'install-pwa';
      btn.style.display = 'none';
      btn.innerHTML = '<i class="fas fa-download" aria-hidden="true"></i> Instalar aplicación';
      document.body.appendChild(btn);
    }

    const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const dismissedRecently = () => {
      const ts = parseInt(localStorage.getItem(DISMISS_KEY) || '0', 10);
      return ts && (Date.now() - ts) < DISMISS_MS;
    };
    const setDismissedNow = () => localStorage.setItem(DISMISS_KEY, String(Date.now()));
    const showBtn = () => { if (!isStandalone() && !dismissedRecently()) btn.style.display = 'inline-flex'; };
    const hideBtn = () => { btn.style.display = 'none'; };

    // Aviso minimalista
    function showToast(message) {
      try {
        const id = 'app-toast';
        let t = document.getElementById(id);
        if (!t) {
          t = document.createElement('div');
          t.id = id;
          t.setAttribute('role', 'status');
          t.setAttribute('aria-live', 'polite');
          t.style.cssText = 'position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:#111;color:#fff;padding:10px 14px;border-radius:999px;box-shadow:0 6px 18px rgba(0,0,0,.18);z-index:10001;opacity:0;transition:opacity .2s ease;max-width:90%;text-align:center;';
          document.body.appendChild(t);
        }
        t.textContent = message;
        requestAnimationFrame(() => { t.style.opacity = '1'; });
        setTimeout(() => { t.style.opacity = '0'; setTimeout(() => { t.remove(); }, 250); }, 3500);
      } catch (_) {}
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      showBtn();
    });
    window.addEventListener('appinstalled', () => { hideBtn(); setDismissedNow(); showToast('Aplicación instalada correctamente.'); });
    btn.addEventListener('click', async () => {
      if (!deferredPrompt) {
        // Guía para navegadores sin beforeinstallprompt (p.ej., iOS Safari)
        showToast('Para instalar: usa “Compartir → Añadir a pantalla de inicio”.');
        hideBtn();
        setDismissedNow();
        return;
      }
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice; // { outcome: 'accepted' | 'dismissed' }
        if (choice && choice.outcome === 'accepted') {
          showToast('Aplicación instalada correctamente.');
        } else {
          showToast('Instalación cancelada.');
        }
      } catch (_) {
        showToast('No se pudo completar la instalación.');
      } finally {
        hideBtn();
        setDismissedNow();
        deferredPrompt = null;
      }
    });
    // Fallback por si no llega el evento en algunos navegadores
    if (!isStandalone() && !dismissedRecently()) setTimeout(showBtn, 1200);
  })();
});
