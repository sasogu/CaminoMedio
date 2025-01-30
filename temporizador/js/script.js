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

// Configuración inicial del Ensō
function initializeProgress() {
    progressCircle.style.strokeDasharray = `${circumference}`;
    progressCircle.style.strokeDashoffset = "0"; // Asegurar que el Ensō esté completo
    progressCircle.style.stroke = "url(#ensoGradient)"; // Aplicar gradiente Ensō
    progressCircle.style.strokeWidth = "10";
    progressCircle.style.strokeLinecap = "round";
    progressCircle.style.opacity = "0.9"; // Transparencia ligera
}

        // Cargar configuraciones guardadas al iniciar la página
        window.onload = function() {
            const savedTime = getCookie("defaultTime");
            const savedVolume = getCookie("soundVolume");

            if (savedTime) {
                document.getElementById("minutes").value = savedTime;
            }

            if (savedVolume) {
                const volume = parseFloat(savedVolume);
                const startSound = document.getElementById("start-sound");
                const endSound = document.getElementById("end-sound");

                startSound.volume = volume;
                endSound.volume = volume;
            }
        
 initializeProgress(); // Configurar el Ensō para que se muestre completo al inicio
 
 requestFullscreen(); // Solicitar pantalla completa
};

        let timer;
        let remainingTime = 0;
        let initialTime = 0;

        const progressCircle = document.querySelector('.progress-ring__circle');
        const radius = progressCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        progressCircle.style.strokeDasharray = `${circumference}`;
        progressCircle.style.strokeDashoffset = `${circumference}`;
        progressCircle.style.stroke = "url(#ensoGradient)"; // Aplicar gradiente Ensō
        progressCircle.style.strokeWidth = "10";
    progressCircle.style.strokeLinecap = "round";
    progressCircle.style.opacity = "0.9"; // Transparencia ligera

    const phrases = [   
            "La verdad última no es difícil de alcanzar, tan solo evita la atracción, el rechazo y la indiferencia.",
            "Cuando no hay apego ni rechazo. Se manifiesta su naturaleza luminosa.",
            "Uno es todo. Todo es uno.",
			"Si se crea la menor diferencia, un abismo separa la tierra del cielo.",
			"Para que la Realidad se declare ante los ojos, no hay que situarse a favor ni en contra de nada.",
			"La lucha entre el deseo y el rechazo, enferma el corazón.",
			"Perfecta como el espacio inmenso, a la Realidad nada le falta, nada le sobra.",
			"A causa del apego y el rechazo, se pierde la armonía con la Vía.",
			"No hay que correr detrás de los fenómenos, ni apegarse a la vacuidad.",
			"Cuando el corazón mora sereno en la Unidad, la dualidad desaparece espontáneamente.",
			"Cuando el movimiento cesa, regresa la calma, y de la calma surge de nuevo el movimiento.",
			"El corazón de la confianza es no-dos. No-dos es el corazón de la confianza."
        ];

// Función para obtener una frase aleatoria
        function getRandomPhrase() {
            return phrases[Math.floor(Math.random() * phrases.length)];
        }
// Función para actualizar el progreso
        function updateProgress() {
            const offset = circumference - (remainingTime / initialTime) * circumference;
            progressCircle.style.strokeDashoffset = offset;
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

// Ocultar los botones y mostrar "Detener"
            document.getElementById('start-button').classList.add('hidden');
            document.getElementById('save-button').classList.add('hidden');
            document.getElementById('stop-button').classList.remove('hidden');

            

            if (!timer) {
                timer = setInterval(updateTime, 1000);
            }

            document.getElementById('start-sound').play();

            document.getElementById('quote').textContent = "";
                  // Solicitar el Wake Lock
        requestWakeLock();
        }

// Función para detener el temporizador
        function stopTimer() {
            clearInterval(timer);
            timer = null;
            document.getElementById('time').textContent = "00:00";
            document.getElementById('minutes').value = "";
            remainingTime = 0;
            updateProgress();

 // Liberar el Wake Lock
    releaseWakeLock();

// Restaurar el Ensō completo
    progressCircle.style.strokeDashoffset = "0";

// Restaurar el logo, el título y los botones
            document.getElementById('logo').src = "multimedia/logoblanco.png";
            document.getElementById('title').classList.remove('hidden');
            document.getElementById('start-button').classList.remove('hidden');
            document.getElementById('save-button').classList.remove('hidden');
            document.getElementById('stop-button').classList.add('hidden');

// Mostrar nuevamente el input y cargar el tiempo guardado
    const minutesInput = document.getElementById('minutes');
    const savedTime = getCookie("defaultTime");
    if (savedTime) {
        minutesInput.value = savedTime; // Cargar tiempo guardado
    }
    minutesInput.classList.remove('hidden'); // Mostrar el input nuevamente


            const randomPhrase = getRandomPhrase();
            document.getElementById('quote').textContent = randomPhrase;
            alert(randomPhrase);
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
// Liberar el Wake Lock
                releaseWakeLock();

// Restaurar el Ensō completo
                progressCircle.style.strokeDashoffset = "0";

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

// Restaurar a la pantalla inicial
                document.getElementById('logo').src = "multimedia/logoblanco.png";
                document.getElementById('title').classList.remove('hidden');
                document.getElementById('start-button').classList.remove('hidden');
                document.getElementById('save-button').classList.remove('hidden');
                document.getElementById('stop-button').classList.add('hidden');
                document.getElementById('time').textContent = "00:00";
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

// Activar reducción de brillo progresiva y Wake Lock al iniciar el temporizador
document.getElementById("start-button").addEventListener("click", () => {
    changeBrightness(0.1); // Reduce brillo a 60%
});

// Restaurar brillo y liberar Wake Lock al detener el temporizador
document.getElementById("stop-button").addEventListener("click", () => {
    changeBrightness(1); // Restaura brillo al 100%
});

