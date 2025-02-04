function saveSettings() {
    const brightnessSlider = document.getElementById("brightness-slider");
    const volumeSlider = document.getElementById("volume-slider");
    const defaultTimeInput = document.getElementById("default-time");

    if (brightnessSlider && volumeSlider && defaultTimeInput) {
        localStorage.setItem("screenBrightness", brightnessSlider.value);
        localStorage.setItem("soundVolume", volumeSlider.value);
        localStorage.setItem("defaultTime", defaultTimeInput.value);

        alert(`Configuraciones guardadas:\nBrillo: ${(brightnessSlider.value * 100).toFixed(0)}%\nVolumen: ${(volumeSlider.value * 100).toFixed(0)}%\nTiempo: ${defaultTimeInput.value}`);
    } else {
        console.error("Uno o más elementos no se encontraron en el DOM.");
    }
}

function updateBrightnessDisplay() {
    const brightnessSlider = document.getElementById("brightness-slider");
    const brightnessValue = document.getElementById("brightness-value");
    if (brightnessSlider && brightnessValue) {
        brightnessValue.textContent = `${(brightnessSlider.value * 100).toFixed(0)}%`;
        document.body.style.opacity = brightnessSlider.value;
    } else {
        console.error("Elementos de brillo no se encontraron en el DOM.");
    }
}

function updateVolumeDisplay() {
    const volumeSlider = document.getElementById("volume-slider");
    const volumeValue = document.getElementById("volume-value");
    if (volumeSlider && volumeValue) {
        volumeValue.textContent = `${(volumeSlider.value * 100).toFixed(0)}%`;
    } else {
        console.error("Elementos de volumen no se encontraron en el DOM.");
    }
}

window.onload = function() {
    const savedBrightness = localStorage.getItem("screenBrightness");
    const savedVolume = localStorage.getItem("soundVolume");
    const savedTime = localStorage.getItem("defaultTime");

    if (savedBrightness !== null) {
        const brightnessSlider = document.getElementById("brightness-slider");
        const brightnessValue = document.getElementById("brightness-value");

        if (brightnessSlider) {
            brightnessSlider.value = savedBrightness;
        }

        if (brightnessValue) {
            brightnessValue.textContent = `${(savedBrightness * 100).toFixed(0)}%`;
        }

        document.body.style.opacity = savedBrightness; 
    }

    if (savedVolume !== null) {
        const volumeSlider = document.getElementById("volume-slider");
        const volumeValue = document.getElementById("volume-value");

        if (volumeSlider) {
            volumeSlider.value = savedVolume;
        }

        if (volumeValue) {
            volumeValue.textContent = `${(savedVolume * 100).toFixed(0)}%`;
        }
    }

    if (savedTime !== null) {
        const timeInput = document.getElementById("default-time");
        const minutesInput = document.getElementById("minutes");
        
        if (timeInput) timeInput.value = savedTime;
        if (minutesInput) minutesInput.value = savedTime;
    }
};