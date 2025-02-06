import { phrases } from './phrases.js';

// Función para obtener valores desde localStorage
function getLocalStorageItem(key) {
    return localStorage.getItem(key) || null;
}

// Wake Lock API
let wakeLock = null;

async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake Lock activado.');
        wakeLock.addEventListener('release', () => {
            console.log('Wake Lock liberado automáticamente.');
        });
    } catch (err) {
        console.error('Error al activar Wake Lock:', err);
    }
}

function releaseWakeLock() {
    if (wakeLock !== null) {
        wakeLock.release();
        wakeLock = null;
        console.log('Wake Lock liberado manualmente.');
    }
}



// Configuración inicial del Ensō
function initializeProgress() {
    const progressCircle = document.querySelector('.progress-ring__circle');
    if (!progressCircle) return;
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    progressCircle.style.strokeDasharray = `${circumference}`;
    progressCircle.style.strokeDashoffset = "0";
    progressCircle.style.stroke = "url(#ensoGradient)";
    progressCircle.style.strokeWidth = "10";
    progressCircle.style.strokeLinecap = "round";
    progressCircle.style.opacity = "0.9";
}

// Llamar a la función al iniciar la aplicación
window.onload = function () {
    const savedVolume = getLocalStorageItem("soundVolume") || "0.5";
    const savedBrightness = getLocalStorageItem("screenBrightness") || "1";
    const savedTime = getLocalStorageItem("defaultTime");
    
    document.getElementById('start-sound').volume = parseFloat(savedVolume);
    document.getElementById('end-sound').volume = parseFloat(savedVolume);
    document.body.style.opacity = savedBrightness;
    
    if (savedTime) {
        document.getElementById("minutes").value = savedTime;
    }
    
    initializeProgress();
   
    
    // Asegurar que el botón de inicio funcione correctamente
    const startButton = document.getElementById("start-button");
    if (startButton) {
        startButton.addEventListener("click", startTimer);
    }

        const stopButton = document.getElementById("stop-button");
    if (stopButton) {
        stopButton.addEventListener("click", stopTimer);
    }
   
};


let timer;
let remainingTime = 0;
let initialTime = 0;

function getRandomPhrase() {
    return phrases[Math.floor(Math.random() * phrases.length)];
}

function playSound(soundElement) {
    if (!soundElement) return;
    const savedVolume = getLocalStorageItem("soundVolume") || "0.5";
    soundElement.volume = parseFloat(savedVolume);
    soundElement.play().catch(error => {
        console.error("Error al reproducir sonido:", error);
    });
}
// Función para actualizar el progreso
function updateProgress() {
    const progressCircle = document.querySelector('.progress-ring__circle');
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (remainingTime / initialTime) * circumference;
    progressCircle.style.strokeDashoffset = offset;
}

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
        playSound(document.getElementById('end-sound'));
        setTimeout(() => {
            const randomPhrase = getRandomPhrase();
            document.getElementById('quote').textContent = randomPhrase;
            alert(randomPhrase);
        }, 500);
        releaseWakeLock();
        initializeProgress();
    }
}

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
   

    if (!timer) {
        timer = setInterval(updateTime, 1000);
    }
    playSound(document.getElementById('start-sound'));
    requestWakeLock();
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    remainingTime = 0;
    document.getElementById('time').textContent = "00:00";
    releaseWakeLock();
    initializeProgress();
    document.getElementById('logo').src = "multimedia/logoblanco.png";
    document.getElementById('title').classList.remove('hidden');
    document.getElementById('minutes').classList.remove('hidden');
    document.getElementById('start-button').classList.remove('hidden');
    document.getElementById('save-button').classList.remove('hidden');
    document.getElementById('stop-button').classList.add('hidden');
    document.getElementById('caminomedio-button').classList.remove('hidden');
    document.getElementById('time').textContent = "00:00";
};