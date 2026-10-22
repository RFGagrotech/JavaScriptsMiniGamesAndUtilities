export function calculator() {
    const app = document.querySelector("#app");

    app.innerHTML = `
    <h1>Calculator</h1>

    <input type="text" id="pantalla" disabled>

    <br>

    <button class="numero" data-value="7">7</button>
    <button class="numero" data-value="8">8</button>
    <button class="numero" data-value="9">9</button>

    <br>

    <button class="numero" data-value="4">4</button>
    <button class="numero" data-value="5">5</button>
    <button class="numero" data-value="6">6</button>

    <br>

    <button class="numero" data-value="1">1</button>
    <button class="numero" data-value="2">2</button>
    <button class="numero" data-value="3">3</button>

    <br>

    <button class="numero" data-value="0">0</button>
    <button id="sumar">+</button>
    <button id="restar">-</button>
    <button id="igual">=</button>
    <button id="limpiar">C</button>
    `;

    const pantalla = document.getElementById("pantalla");
    const botonesNumeros = document.querySelectorAll(".numero");

    const btnSumar = document.getElementById("sumar");
    const btnRestar = document.getElementById("restar");
    const btnIgual = document.getElementById("igual");
    const btnLimpiar = document.getElementById("limpiar");

    let numeroAnterior = null;
    let operador = null;

    let operaciones = [];
    let numeroActual = "";

    botonesNumeros.forEach((boton) => {
        boton.addEventListener("click", () => {
            numeroActual += boton.dataset.value;
            pantalla.value = numeroActual;
        });
    });

    btnIgual.addEventListener("click", () => {
    if (numeroActual === "") return;

    operaciones.push(Number(numeroActual));

    let resultado = operaciones[0];

    for (let i = 1; i < operaciones.length; i += 2) {
      const operador = operaciones[i];
      const numero = operaciones[i + 1];

      if (operador === "+") {
        resultado += numero;
      } else if (operador === "-") {
        resultado -= numero;
      }
    }

    pantalla.value = resultado;

    operaciones = [];
    numeroActual = String(resultado);
    });

    btnLimpiar.addEventListener("click", () => {
        pantalla.value = "";
        numeroAnterior = null;
        operador = null;
    });
}

    function guardarOperacion(simbolo) {
        if (numeroActual === "") return;

        operaciones.push(Number(numeroActual));
        operaciones.push(simbolo);

        numeroActual = "";

        btnSumar.addEventListener("click", () => guardarOperacion("+"));
        btnRestar.addEventListener("click", () => guardarOperacion("-")); //Hay que añadir X y /
    }