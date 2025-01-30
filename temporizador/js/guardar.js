function setCookie(name, value) {
    document.cookie = `${name}=${value};path=/;expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    console.log(`Cookie set: ${name}=${value}`);
}

function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        if (cookie.startsWith(nameEQ)) {
            console.log(`Cookie found: ${cookie}`);
            return cookie.substring(nameEQ.length);
        }
    }
    console.log(`Cookie not found: ${name}`);
    return null;
}

function saveSettings() {
    const brightnessSlider = document.getElementById("brightness-slider");
    const volumeSlider = document.getElementById("volume-slider");
    const defaultTimeInput = document.getElementById("default-time");

    setCookie("screenBrightness", brightnessSlider.value);
    setCookie("soundVolume", volumeSlider.value);
    setCookie("defaultTime", defaultTimeInput.value);

    alert(`Configuraciones guardadas:\nBrillo: ${(brightnessSlider.value * 100).toFixed(0)}%\nVolumen: ${(volumeSlider.value * 100).toFixed(0)}%\nTiempo: ${defaultTimeInput.value}`);
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
    volumeValue.textContent = `${(volumeSlider.value * 100).toFixed(0)}%`;
}

window.onload = function() {
    const savedBrightness = getCookie("screenBrightness");
    const savedVolume = getCookie("soundVolume");
    const savedTime = getCookie("defaultTime");

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

    if (savedTime) {
        const defaultTimeInput = document.getElementById("default-time");
        defaultTimeInput.value = savedTime;
        console.log(`Tiempo cargado: ${savedTime}`);
    }
};