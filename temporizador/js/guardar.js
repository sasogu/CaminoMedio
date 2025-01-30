function setCookie(name, value) {
    document.cookie = `${name}=${value};path=/;expires=Fri, 31 Dec 9999 23:59:59 GMT`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        if (cookie.startsWith(nameEQ)) {
            return cookie.substring(nameEQ.length);
        }
    }
    return null;
}

function saveSettings() {
    const brightnessSlider = document.getElementById("brightness-slider");
    const volumeSlider = document.getElementById("volume-slider");
    setCookie("screenBrightness", brightnessSlider.value);
    setCookie("soundVolume", volumeSlider.value);
    alert(`Configuraciones guardadas:\nBrillo: ${(brightnessSlider.value * 100).toFixed(0)}%\nVolumen: ${(volumeSlider.value * 100).toFixed(0)}%`);
}

function updateBrightnessDisplay() {
    const brightnessSlider = document.getElementById("brightness-slider");
    const brightnessValue = document.getElementById("brightness-value");
    brightnessValue.textContent = `${(brightnessSlider.value * 100).toFixed(0)}%`;
    document.body.style.opacity = brightnessSlider.value;
}

function updateVolumeDisplay() {
    const volumeSlider = document.getElementById("volume-slider");
    const volumeValue = document.getElementById("volume-value");
    const bellSound = document.getElementById("bell-sound");
    volumeValue.textContent = `${(volumeSlider.value * 100).toFixed(0)}%`;
    
    if (bellSound) {
        bellSound.volume = volumeSlider.value;
        bellSound.currentTime = 0; // Reinicia el audio para asegurarse de que suene en cada cambio
        bellSound.play().catch(error => console.error("Error al reproducir sonido:", error));
    }
}

window.onload = function() {
    const savedBrightness = getCookie("screenBrightness");
    const savedVolume = getCookie("soundVolume");
    
    if (savedBrightness) {
        const brightnessSlider = document.getElementById("brightness-slider");
        const brightnessValue = document.getElementById("brightness-value");
        brightnessSlider.value = savedBrightness;
        brightnessValue.textContent = `${(savedBrightness * 100).toFixed(0)}%`;
        document.body.style.opacity = savedBrightness;
    }
    
    if (savedVolume) {
        const volumeSlider = document.getElementById("volume-slider");
        const volumeValue = document.getElementById("volume-value");
        volumeSlider.value = savedVolume;
        volumeValue.textContent = `${(savedVolume * 100).toFixed(0)}%`;
    }
};