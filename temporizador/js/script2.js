document.addEventListener("DOMContentLoaded", function() {
    const body = document.body;
    const startButton = document.getElementById("start-button");
    const stopButton = document.getElementById("stop-button");
    let timer;
    let remainingTime = 0;
    let initialTime = 0;

    function switchToDarkMode() {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
    }

    function switchToLightMode() {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
    }

    function startTimer() {
        const minutesInput = document.getElementById("minutes");
        if (!remainingTime && minutesInput.value) {
            remainingTime = parseInt(minutesInput.value) * 60;
            initialTime = remainingTime;
        }
        if (!remainingTime) {
            alert("Por favor, introduce el tiempo en minutos.");
            return;
        }
        switchToDarkMode();
        startButton.classList.add("hidden");
        stopButton.classList.remove("hidden");
        timer = setInterval(updateTime, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
        timer = null;
        remainingTime = 0;
        document.getElementById("time").textContent = "00:00";
        switchToLightMode();
        startButton.classList.remove("hidden");
        stopButton.classList.add("hidden");
    }

    function updateTime() {
        if (remainingTime > 0) {
            remainingTime--;
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            document.getElementById("time").textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            stopTimer();
        }
    }

    startButton.addEventListener("click", startTimer);
    stopButton.addEventListener("click", stopTimer);
});
