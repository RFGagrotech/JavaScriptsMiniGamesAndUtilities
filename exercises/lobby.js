export function renderLobby() {
    const app = document.querySelector("#app");

    app.innerHTML = `
    <h1>Welcome to the JSproject</h1>

    <h2>Counter</h2>
    <p id="counter">0</p>

    <button id="increase">+</button>
    <button id="decrease">-</button>
    <button id="reset">Reset</button>

    <hr>

    <h2>Change backgroundColor</h2>
    <button class="btn" id="change">Change color</button>
  `;
    
  counter();
  changeColor();
}

//Ejercicio contador
function counter() {
    let count = 0;

    const countValue = document.getElementById("counter");

    const btnIncrease = document.getElementById("increase");
    const btnDecrease = document.getElementById("decrease");
    const btnReset = document.getElementById("reset");

    btnIncrease.addEventListener("click", () => {
        count++;
        countValue.textContent = count;
    });

    btnDecrease.addEventListener("click", () => {
        count--;
        countValue.textContent = count;
    })

    btnReset.addEventListener("click", () => {
        count = 0;
        countValue.textContent = count;
    })
}

function changeColor() {
    const change = document.getElementById("change");

    change.addEventListener("click", () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);

        const r1 = Math.floor(Math.random() * 256);
        const g1 = Math.floor(Math.random() * 256);
        const b1 = Math.floor(Math.random() * 256);

        document.body.style.background = `
        linear-gradient( 
        135deg, 
        rgb(${r}, ${g}, ${b}), 
        rgb(${r1}, ${g1}, ${b1}))`;    
    });
}