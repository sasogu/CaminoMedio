
function setCookie(name, value) {
    document.cookie = `${name}=${value};path=/;expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    console.log(`Cookie guardada: ${name}=${value}`);
}

function saveSettings() {
    const defaultTimeInput = document.getElementById("default-time");
    const volumeSlider = document.getElementById("volume-slider");
    setCookie("screenBrightness", brightnessSlider.value);
    setCookie("soundVolume", volumeSlider.value);
    alert(`Configuraciones guardadas:\nBrillo: ${(brightnessSlider.value * 100).toFixed(0)}%\nVolumen: ${(volumeSlider.value * 100).toFixed(0)}%`);
}

    if (defaultTimeInput.value) {
        setCookie("defaultTime", defaultTimeInput.value);
        setCookie("soundVolume", volumeSlider.value);
        alert(`Configuraciones guardadas:\nTiempo: ${defaultTimeInput.value} minutos\nVolumen: ${(volumeSlider.value * 100).toFixed(0)}%`);
    } else {
        alert("Por favor, introduce un tiempo válido antes de guardar.");
    }
}

function updateVolumeDisplay() {
    const volumeSlider = document.getElementById("volume-slider");
    const volumeValue = document.getElementById("volume-value");
    volumeValue.textContent = `${(volumeSlider.value * 100).toFixed(0)}%`;
}

// Cargar configuraciones guardadas al abrir la página
window.onload = function() {
    const cookies = document.cookie.split("; ");

    const timeCookie = cookies.find(row => row.startsWith("defaultTime="));
    if (timeCookie) {
        const savedTime = timeCookie.split("=")[1];
        document.getElementById("default-time").value = savedTime;
        console.log(`Tiempo cargado: ${savedTime}`);
    }

    const volumeCookie = cookies.find(row => row.startsWith("soundVolume="));
    if (volumeCookie) {
        const savedVolume = volumeCookie.split("=")[1];
        const volumeSlider = document.getElementById("volume-slider");
        const volumeValue = document.getElementById("volume-value");

        volumeSlider.value = savedVolume;
        volumeValue.textContent = `${(savedVolume * 100).toFixed(0)}%`;
        console.log(`Volumen cargado: ${savedVolume}`);
    }
};
