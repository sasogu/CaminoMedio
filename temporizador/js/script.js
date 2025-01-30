import { phrases } from './phrases.js';

// Función para obtener cookies
function getCookie(name) {
    const nameEQ = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Wake Lock API
let wakeLock = null;

// Función para solicitar el Wake Lock
async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake Lock activado.');

        // Manejo de liberación automática del Wake Lock (opcional)
        wakeLock.addEventListener('release', () => {
            console.log('Wake Lock liberado automáticamente.');
        });
    } catch (err) {
        console.error('Error al activar Wake Lock:', err);
    }
}

// Función para liberar el Wake Lock
function releaseWakeLock() {
    if (wakeLock !== null) {
        wakeLock.release();
        wakeLock = null;
        console.log('Wake Lock liberado manualmente.');
    }
}

// Función para cambiar el brillo de forma progresiva
function changeBrightness(targetBrightness, duration = 6000) {
    const stepTime = 50; // Intervalo de actualización (50ms)
    const steps = duration / stepTime; // Número de pasos
    let currentBrightness = parseFloat(getComputedStyle(document.body).filter.match(/brightness\((.*?)\)/)?.[1]) || 1;
    const stepChange = (targetBrightness - currentBrightness) / steps;

    let step = 0;
    const interval = setInterval(() => {
        currentBrightness += stepChange;
        document.body.style.filter = `brightness(${currentBrightness})`;

        step++;
        if (step >= steps) {
            clearInterval(interval);
        }
    }, stepTime);
}

// Configuración inicial del Ensō
function initializeProgress() {
    const progressCircle = document.querySelector('.progress-ring__circle');
    if (!progressCircle) {
        console.error('Elemento .progress-ring__circle no encontrado');
        return;
    }
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    progressCircle.style.strokeDasharray = `${circumference}`;
    progressCircle.style.strokeDashoffset = "0"; // Mostrarlo completamente desde el inicio
    progressCircle.style.stroke = "url(#ensoGradient)"; // Aplicar gradiente Ensō
    progressCircle.style.strokeWidth = "10";
    progressCircle.style.strokeLinecap = "round";
    progressCircle.style.opacity = "0.9"; // Transparencia ligera
}


// Función para solicitar pantalla completa
function requestFullscreen() {
    const body = document.body;
    if (body.requestFullscreen) {
        body.requestFullscreen();
    } else if (body.mozRequestFullScreen) { // Soporte para Firefox
        body.mozRequestFullScreen();
    } else if (body.webkitRequestFullscreen) { // Soporte para navegadores Webkit (Safari, etc.)
        body.webkitRequestFullscreen();
    } else if (body.msRequestFullscreen) { // Soporte para IE/Edge
        body.msRequestFullscreen();
    }
}

// Cargar configuraciones guardadas al iniciar la página
window.onload = function() {
    const savedTime = getCookie("defaultTime");
    const savedVolume = getCookie("soundVolume");
    const savedBrightness = getCookie("screenBrightness");

    if (savedTime) {
        document.getElementById("minutes").value = savedTime;
    }

    if (savedVolume) {
        const volume = parseFloat(savedVolume);
        const startSound = document.getElementById("start-sound");
        startSound.volume = volume;
    }

    if (savedBrightness) {
        document.body.style.opacity = savedBrightness;
    }

    initializeProgress(); // Configurar el Ensō para que se muestre completo al inicio
    requestFullscreen(); // Solicitar pantalla completa
};

let timer;
let remainingTime = 0;
let initialTime = 0;

// Función para obtener una frase aleatoria
function getRandomPhrase() {
    return phrases[Math.floor(Math.random() * phrases.length)];
}

// Función para actualizar el progreso
function updateProgress() {
    const progressCircle = document.querySelector('.progress-ring__circle');
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (remainingTime / initialTime) * circumference;
    progressCircle.style.strokeDashoffset = offset;
}

// Función para actualizar el tiempo
function updateTime() {
    if (remainingTime > 0) {
        remainingTime--;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        document.getElementById('time').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        updateProgress();
    } else {
        clearInterval(timer);
        timer = null;

        const endSound = document.getElementById('end-sound');

        try {
            endSound.play().then(() => {
                // Mostrar el mensaje después de que el sonido comience a reproducirse
                setTimeout(() => {
                    const randomPhrase = getRandomPhrase();
                    document.getElementById('quote').textContent = randomPhrase;
                    alert(randomPhrase);
                }, 500); // Retraso de 500ms para dar tiempo al sonido a empezar
            }).catch(error => {
                console.error("Error al reproducir el sonido de finalización:", error);
            });
        } catch (error) {
            console.error("Error general al intentar reproducir el sonido:", error);
        }

        // Restaurar brillo y liberar Wake Lock al detener el temporizador
        changeBrightness(1); // Restaura brillo al 100%
        releaseWakeLock(); // Liberar el Wake Lock

        // Restaurar el Ensō completo
        initializeProgress(); // Asegurarse de que el Ensō se restaure

        // Restaurar el logo, el título y los botones
        document.getElementById('logo').src = "multimedia/logoblanco.png";
        document.getElementById('title').classList.remove('hidden');
        document.getElementById('start-button').classList.remove('hidden');
        document.getElementById('save-button').classList.remove('hidden');
        document.getElementById('stop-button').classList.add('hidden');
        document.getElementById('caminomedio-button').classList.add('hidden');

        // Mostrar nuevamente el input y cargar el tiempo guardado
        const minutesInput = document.getElementById('minutes');
        const savedTime = getCookie("defaultTime");
        if (savedTime) {
            minutesInput.value = savedTime; // Cargar tiempo guardado
        }
        minutesInput.classList.remove('hidden'); // Mostrar el input nuevamente
    }
}

// Función para iniciar el temporizador
function startTimer() {
    const minutesInput = document.getElementById('minutes');
    if (!remainingTime && minutesInput.value) {
        remainingTime = parseInt(minutesInput.value) * 60;
        initialTime = remainingTime;
    }

    if (!remainingTime) {
        alert("Por favor, introduce el tiempo en minutos.");
        return;
    }

    // Cambiar el logo y ocultar el título
    document.getElementById('logo').src = "multimedia/logopeque.png";
    document.getElementById('title').classList.add('hidden');
    document.getElementById('minutes').classList.add('hidden');


    // Ocultar los botones y mostrar "Detener"
    document.getElementById('start-button').classList.add('hidden');
    document.getElementById('save-button').classList.add('hidden');
    document.getElementById('stop-button').classList.remove('hidden');
    document.getElementById('caminomedio-button').classList.add('hidden');

    // Iniciar el temporizador
    if (!timer) {
        timer = setInterval(updateTime, 1000);
    }

    document.getElementById('start-sound').play();
    document.getElementById('quote').textContent = "";
    requestWakeLock(); // Solicitar el Wake Lock
    requestFullscreen(); // Solicitar pantalla completa
}

// Función para restaurar la pantalla inicial
function restoreInitialScreen() {
    // Restaurar el logo, el título y los botones
    document.getElementById('logo').src = "multimedia/logoblanco.png";
    document.getElementById('title').classList.remove('hidden');
    document.getElementById('minutes').classList.remove('hidden');
    document.getElementById('start-button').classList.remove('hidden');
    document.getElementById('save-button').classList.remove('hidden');
    document.getElementById('stop-button').classList.add('hidden');
    document.getElementById('caminomedio-button').classList.remove('hidden');
    document.getElementById('time').textContent = "00:00";
    initializeProgress(); // Asegurarse de que el Ensō se restaure
    releaseWakeLock(); // Liberar el Wake Lock
}

// Función para detener el temporizador
function stopTimer() {
    clearInterval(timer);
    timer = null;
    remainingTime = 0;
    updateProgress();
    restoreInitialScreen();
}

// Activar reducción de brillo progresiva, Wake Lock y pantalla completa al iniciar el temporizador
document.getElementById("start-button").addEventListener("click", () => {
    changeBrightness(0.1); // Reduce brillo a 60%
    requestWakeLock(); // Mantener pantalla encendida
    startTimer(); // Iniciar el temporizador
});

// Restaurar brillo y liberar Wake Lock al detener el temporizador
document.getElementById("stop-button").addEventListener("click", () => {
    changeBrightness(1); // Restaura brillo al 100%
    stopTimer(); // Detener el temporizador y restaurar la pantalla inicial
});
