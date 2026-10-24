
export function render(app) {

  // 1. ESTRUCTURA HTML
  app.innerHTML = `
    <section class="memory-game">
      <h1>Juego de memoria</h1>
      <p>Encuentra las 8 parejas de cartas.</p>

      <div class="memory-info">
        <p>Intentos: <strong id="attempts">0</strong></p>
        <p>Parejas: <strong id="pairs">0 / 8</strong></p>
        <button id="restart" type="button">
          Reiniciar partida
        </button>
      </div>

      <div id="memory-board" class="memory-board"></div>

      <p id="memory-status" role="status"></p>
    </section>

    <style>             
      .memory-game {
        max-width: 650px;
        margin: 2rem auto;
        text-align: center;
      }

      .memory-info {
        display: flex;
        align-items: center;
        justify-content: space-around;
        gap: 1rem;
        flex-wrap: wrap;
        margin: 1.5rem 0;
      }

      .memory-board {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
      }

      .memory-card {
        aspect-ratio: 1;
        border: 2px solid #b0b8c5;
        border-radius: 12px;
        background: #e2e8f0;
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        cursor: pointer;
      }

      .memory-card.revealed {
        background: #bfdbfe;
      }

      .memory-card.matched {
        background: #bbf7d0;
        border-color: #22c55e;
        cursor: default;
      }

      .memory-card:focus-visible {
        outline: 3px solid #2563eb;
        outline-offset: 2px;
      }

      #memory-status {
        margin-top: 1.5rem;
        font-weight: bold;
      }
    </style>
  `;                    //Parte de style deberia de meterla en styles(scss)

  // 2. SELECCIONAR ELEMENTOS DEL DOM
  const board = app.querySelector("#memory-board");
  const attemptsText = app.querySelector("#attempts");
  const pairsText = app.querySelector("#pairs");
  const status = app.querySelector("#memory-status");
  const restartButton = app.querySelector("#restart");

  // 3. DATOS Y ESTADO DEL JUEGO
  const symbols = [
    "🍎", "🍇", "🍋", "🍉",
    "🍓", "🍒", "🍑", "🥝"
  ];

  let cards = [];
  let firstIndex = null;
  let attempts = 0;
  let pairs = 0;
  let locked = false;
  let timeoutId = null;

  // 4. MEZCLAR LAS CARTAS (FISHER-YATES)
  function shuffle(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] =
        [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  // 5. ACTUALIZAR LOS CONTADORES
  function updateStats() {
    attemptsText.textContent = attempts;
    pairsText.textContent = `${pairs} / ${symbols.length}`;
  }

  // 6. ACTUALIZAR UNA CARTA EN EL DOM
  function updateCard(index) {
    const card = cards[index];
    const button = board.children[index];

    const visible = card.revealed || card.matched;

    button.textContent = visible ? card.symbol : "❔";

    button.classList.toggle("revealed", card.revealed);
    button.classList.toggle("matched", card.matched);

    button.disabled = card.matched;

    button.setAttribute(
      "aria-label",
      visible
        ? `Carta ${index + 1}: ${card.symbol}`
        : `Carta ${index + 1}: oculta`
    );
  }

  // 7. COMPROBAR LA CARTA SELECCIONADA
  function selectCard(index) {
    const card = cards[index];

    // Impedir seleccionar cartas no disponibles
    if (locked || card.matched || card.revealed) {
      return;
    }

    // Mostrar la carta seleccionada
    card.revealed = true;
    updateCard(index);

    // Primera carta de la pareja
    if (firstIndex === null) {
      firstIndex = index;
      status.textContent = "Selecciona otra carta.";
      return;
    }

    // Segunda carta: contar intento
    const first = firstIndex;
    firstIndex = null;
    attempts++;

    // Comparar los símbolos
    if (cards[first].symbol === card.symbol) {

      cards[first].matched = true;
      card.matched = true;

      pairs++;

      updateCard(first);
      updateCard(index);

      status.textContent = "¡Pareja encontrada!";

      // Comprobar victoria
      if (pairs === symbols.length) {
        status.textContent =
          `¡Enhorabuena! Has ganado en ${attempts} intentos.`;
      }

    } else {

      // Bloquear temporalmente el tablero
      locked = true;
      status.textContent = "Las cartas no coinciden.";

      // Ocultar las cartas después de 1 segundo
      timeoutId = setTimeout(() => {
        cards[first].revealed = false;
        card.revealed = false;

        updateCard(first);
        updateCard(index);

        locked = false;
        timeoutId = null;
        status.textContent = "Sigue buscando parejas.";
      }, 1000);
    }

    updateStats();
  }

  // 8. CREAR UNA NUEVA PARTIDA
  function newGame() {

    // Cancelar una ocultación pendiente
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    firstIndex = null;
    attempts = 0;
    pairs = 0;
    locked = false;

    // Duplicar símbolos y mezclarlos
    const shuffled = shuffle([...symbols, ...symbols]);

    cards = shuffled.map(symbol => ({
      symbol,
      revealed: false,
      matched: false
    }));

    // Limpiar el tablero anterior
    board.replaceChildren();

    // Generar los botones de las cartas
    cards.forEach((card, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "memory-card";
      button.dataset.index = index;

      board.appendChild(button);
      updateCard(index);
    });

    updateStats();
    status.textContent = "¡Comienza la partida!";
  }

  // 9. EVENTOS DEL JUEGO

  // Detectar clics sobre las cartas
  board.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-index]");

    if (!button) return;

    const index = Number(button.dataset.index);
    selectCard(index);
  });

  // Reiniciar mediante el botón
  restartButton.addEventListener("click", newGame);

  // 10. INICIAR EL JUEGO
  newGame();
}
