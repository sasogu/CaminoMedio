/*!
* Start Bootstrap - Grayscale v7.0.6 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

//Forzar instalación y actualización del Service Worker
    // Si el navegador soporta Service Workers
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js').then(registration => {
                console.log('SW registrado:', registration);
    
                // Si ya hay un nuevo SW esperando
                if (registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                }
    
                registration.addEventListener('updatefound', () => {
                    const newSW = registration.installing;
                    newSW.addEventListener('statechange', () => {
                        if (newSW.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                newSW.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                            }
                        }
                    });
                });
            }).catch(error => {
                console.error('Error registrando el SW:', error);
            });
    
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('Nuevo SW activado');
            });
        });
    }
    
    
    

    // Solicitar permiso para notificaciones push
    // if ('Notification' in window && Notification.permission !== 'granted') {
     //    Notification.requestPermission().then(permission => {
     //        if (permission === 'granted') {
      //           console.log("Permiso para notificaciones concedido.");
     //        }
      //   });
     //}
    
    // Mostrar notificación push para instalar

    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
    
        const installButton = document.createElement('button');
        installButton.textContent = "Instalar Aplicación";
        installButton.style.cssText = "position: fixed; bottom: 20px; right: 20px; background-color: #76c7c0; padding: 10px; border: none; cursor: pointer;";
        
        document.body.appendChild(installButton);
    
        installButton.addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(choiceResult => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Usuario instaló la aplicación');
                }
                installButton.remove();
            });
        });
    });
    
});

