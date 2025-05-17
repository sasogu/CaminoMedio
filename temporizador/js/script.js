import { phrases } from './phrases.js';

import { registrarFin } from './estadisticas.js';
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
    
  

        // Mostrar el tiempo guardado en el campo y en el círculo
        if (savedTime) {
            document.getElementById("minutes").value = savedTime;
            const formattedTime = `${savedTime.toString().padStart(2, '0')}:00`;
            document.getElementById("time").textContent = formattedTime;
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

        // Cambiar el fondo del div a blanco
        const backgroundDiv = document.querySelector('.background-white');
        if (backgroundDiv) {
            backgroundDiv.style.backgroundColor = "#ffffff"; // Cambiar a blanco
        }

        playSound(document.getElementById('end-sound'));

        // Guardar el tiempo en las estadísticas
        registrarFin(initialTime);

        setTimeout(() => {
            const randomPhrase = getRandomPhrase();
            
            // Mostrar frase y enlace en el HTML
            const quoteElement = document.getElementById('quote');
            quoteElement.innerHTML = `${randomPhrase.text} <br> <a href="${randomPhrase.link}" target="_blank">Ver más</a>`;
            
            // Seguir mostrando la frase en el alert (opcional)
            alert(randomPhrase.text);

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
    document.getElementById('estadisticas-button').classList.add('hidden');

    // Ocultar los botones de sumar y restar tiempo
    document.getElementById('increase-time').classList.add('hidden');
    document.getElementById('decrease-time').classList.add('hidden');


    if (!timer) {
        timer = setInterval(updateTime, 1000);
    }
    playSound(document.getElementById('start-sound'));

    // Precargar el sonido final en silencio
    const endSound = document.getElementById('end-sound');
    endSound.volume = 0;
    endSound.play().then(() => {
        endSound.pause();
        endSound.currentTime = 0;
        endSound.volume = parseFloat(getLocalStorageItem("soundVolume") || "0.5");
    }).catch(error => {
        console.error("Error al precargar sonido:", error);
    });

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
    document.getElementById('estadisticas-button').classList.remove('hidden');
    document.getElementById('time').textContent = "00:00";

    // Mostrar los botones de sumar y restar tiempo
    document.getElementById('increase-time').classList.remove('hidden');
    document.getElementById('decrease-time').classList.remove('hidden');


    // Restaurar el color original del div
    const backgroundDiv = document.querySelector('.background-white');
    if (backgroundDiv) {
        backgroundDiv.style.backgroundColor = ""; // Restaurar al color predeterminado
    }
};

function adjustTime(amount) {
    const minutesInput = document.getElementById('minutes');
    let currentMinutes = parseInt(minutesInput.value) || 0; // Si está vacío, usar 0
    currentMinutes += amount;

    // Asegurarse de que el valor esté dentro de los límites (1 a 60 minutos)
    if (currentMinutes < 1) {
        currentMinutes = 1;
    } else if (currentMinutes > 60) {
        currentMinutes = 60;
    }

    minutesInput.value = currentMinutes;

    // Actualizar el tiempo mostrado en el temporizador
    const timeDisplay = document.getElementById('time');
    const formattedTime = `${currentMinutes.toString().padStart(2, '0')}:00`;
    timeDisplay.textContent = formattedTime;
}

// Hacer que la función esté disponible globalmente
window.adjustTime = adjustTime;

// Obtener referencias a los elementos
const inputMinutes = document.getElementById('minutes');
const timeDisplay = document.getElementById('time');

// Actualizar el contenido de #time cuando el usuario introduce un valor
inputMinutes.addEventListener('input', () => {
    const minutes = parseInt(inputMinutes.value, 10) || 0; // Asegurarse de que sea un número
    const formattedTime = `${minutes.toString().padStart(2, '0')}:00`; // Formatear como MM:SS
    timeDisplay.textContent = formattedTime; // Actualizar el contenido de #time
});

// Iniciar el temporizador al presionar Enter
inputMinutes.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { // Verificar si la tecla presionada es Enter
        startTimer(); // Llamar a la función para iniciar el temporizador
    }
});