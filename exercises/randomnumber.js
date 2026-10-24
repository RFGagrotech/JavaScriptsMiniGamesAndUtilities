// Selección de un número aleatorio 0-100
export function randomNumber() {
    const app = document.querySelector("#app");

    app.innerHTML = `
        <h1>Elegir número al azar</h1>

        <p id="pantalla"></p>

        <button id="number">Random number</button>
    `;

    const pantalla = document.getElementById("pantalla");
    const number = document.getElementById("number");

    function setNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    number.addEventListener("click", () => {
        pantalla.textContent = setNumber(0, 100);
    });
}