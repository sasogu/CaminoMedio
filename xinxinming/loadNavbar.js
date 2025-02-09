document.addEventListener("DOMContentLoaded", function() {
    fetch("navbar.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar navbar.html");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
        })
        .catch(error => {
            console.error("Error al cargar el contenido del navbar:", error);
        });
});