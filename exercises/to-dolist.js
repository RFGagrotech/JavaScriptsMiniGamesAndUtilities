export function render() {
  const app = document.querySelector("#app");
  // 1. ESTRUCTURA HTML
  app.innerHTML = `
    <section class="todo-app">
      <h1>Lista de tareas</h1>
      <p>Organiza tus tareas pendientes.</p>

      <form id="todo-form">
        <input
          id="todo-input"
          type="text"
          placeholder="Escribe una nueva tarea..."
          maxlength="120"
          required
        >
        <button type="submit">Añadir</button>
      </form>

      <div class="todo-toolbar">
        <p id="todo-stats"></p>

        <div id="todo-filters">
          <button type="button" data-filter="all">
            Todas
          </button>
          <button type="button" data-filter="pending">
            Pendientes
          </button>
          <button type="button" data-filter="completed">
            Completadas
          </button>
        </div>
      </div>

      <ul id="todo-list"></ul>

      <p id="todo-empty"></p>

      <button id="clear-completed" type="button">
        Eliminar completadas
      </button>

      <p id="todo-message" role="status"></p>
    </section>
  `;

  // 2. SELECCIONAR ELEMENTOS DEL DOM
  const form = app.querySelector("#todo-form");
  const input = app.querySelector("#todo-input");
  const list = app.querySelector("#todo-list");
  const stats = app.querySelector("#todo-stats");
  const empty = app.querySelector("#todo-empty");
  const message = app.querySelector("#todo-message");
  const filters = app.querySelector("#todo-filters");
  const clearButton = app.querySelector("#clear-completed");

  // 3. ESTADO DE LA APLICACIÓN
  const STORAGE_KEY = "javascript-todo-list";

  let tasks = loadTasks();
  let currentFilter = "all";
  let editingId = null;

  // 4. CARGAR TAREAS DESDE LOCALSTORAGE
  function loadTasks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) return [];

      const data = JSON.parse(saved);

      if (!Array.isArray(data)) return [];

      return data.filter(task =>
        typeof task.id === "string" &&
        typeof task.text === "string" &&
        typeof task.completed === "boolean"
      );

    } catch (error) {
      console.error("Error al cargar tareas:", error);
      return [];
    }
  }

  // 5. GUARDAR TAREAS EN LOCALSTORAGE
  function saveTasks() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
      );
      return true;

    } catch (error) {
      console.error("Error al guardar tareas:", error);
      return false;
    }
  }

  // 6. CREAR BOTONES REUTILIZABLES
  function createButton(text, action) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = text;
    button.dataset.action = action;

    return button;
  }

  // 7. MOSTRAR LAS TAREAS EN EL DOM
  function showTasks() {

    // Filtrar las tareas según la selección
    const visibleTasks = tasks.filter(task => {
      if (currentFilter === "pending") {
        return !task.completed;
      }

      if (currentFilter === "completed") {
        return task.completed;
      }

      return true;
    });

    // Vaciar la lista anterior
    list.replaceChildren();

    // Crear cada tarea
    visibleTasks.forEach(task => {
      const li = document.createElement("li");

      li.className = "todo-item";
      li.dataset.id = task.id;

      if (task.completed) {
        li.classList.add("completed");
      }

      // Si estamos editando esta tarea
      if (editingId === task.id) {
        const editForm = document.createElement("form");
        editForm.className = "todo-edit-form";

        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.className = "todo-edit-input";
        editInput.value = task.text;
        editInput.maxLength = 120;
        editInput.required = true;

        const saveButton = document.createElement("button");
        saveButton.type = "submit";
        saveButton.textContent = "Guardar";

        const cancelButton = createButton(
          "Cancelar", "cancel"
        );

        editForm.append(
          editInput,
          saveButton,
          cancelButton
        );

        li.appendChild(editForm);

      } else {

        // Checkbox para completar la tarea
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "todo-checkbox";
        checkbox.checked = task.completed;
        checkbox.id = `todo-${task.id}`;

        // Texto de la tarea
        const label = document.createElement("label");
        label.className = "todo-text";
        label.htmlFor = checkbox.id;
        label.textContent = task.text;

        // Botones de edición y eliminación
        const actions = document.createElement("div");
        actions.className = "todo-actions";

        const editButton = createButton(
          "Editar", "edit"
        );

        const deleteButton = createButton(
          "Eliminar", "delete"
        );

        actions.append(editButton, deleteButton);

        li.append(checkbox, label, actions);
      }

      list.appendChild(li);
    });

    // Actualizar contadores
    const completed = tasks.filter(
      task => task.completed
    ).length;

    const pending = tasks.length - completed;

    stats.textContent =
      `${pending} pendientes · ${completed} completadas`;

    // Mostrar mensaje si no hay tareas
    empty.textContent = visibleTasks.length === 0
      ? "No hay tareas para mostrar."
      : "";

    // Activar filtro seleccionado
    filters.querySelectorAll("button").forEach(button => {
      const active =
        button.dataset.filter === currentFilter;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    clearButton.disabled = completed === 0;
  }

  // 8. ACTUALIZAR CAMBIOS
  function update(messageText) {
    const saved = saveTasks();

    showTasks();

    message.textContent = saved
      ? messageText
      : "Los cambios no se pudieron guardar en el navegador.";
  }

  // 9. AÑADIR UNA NUEVA TAREA
  form.addEventListener("submit", event => {
    event.preventDefault();

    const text = input.value.trim();

    if (!text) return;

    const newTask = {
      id: crypto.randomUUID(),
      text: text,
      completed: false
    };

    tasks.unshift(newTask);

    form.reset();
    update("Tarea añadida correctamente.");

    input.focus();
  });

  // 10. COMPLETAR O DESMARCAR TAREAS
  list.addEventListener("change", event => {
    if (!event.target.matches(".todo-checkbox")) {
      return;
    }

    const li = event.target.closest("li[data-id]");
    const task = tasks.find(t => t.id === li.dataset.id);

    if (!task) return;

    task.completed = event.target.checked;

    update(
      task.completed
        ? "Tarea completada."
        : "Tarea marcada como pendiente."
    );
  });

  // 11. EDITAR, CANCELAR O ELIMINAR
  list.addEventListener("click", event => {
    const button = event.target.closest(
      "button[data-action]"
    );

    if (!button) return;

    const li = button.closest("li[data-id]");
    const id = li.dataset.id;
    const action = button.dataset.action;

    if (action === "edit") {
      editingId = id;
      showTasks();

      list.querySelector(".todo-edit-input")?.focus();
    }

    if (action === "cancel") {
      editingId = null;
      showTasks();
    }

    if (action === "delete") {
      tasks = tasks.filter(task => task.id !== id);

      editingId = null;
      update("Tarea eliminada.");
    }
  });

  // 12. GUARDAR UNA TAREA EDITADA
  list.addEventListener("submit", event => {
    if (!event.target.matches(".todo-edit-form")) {
      return;
    }

    event.preventDefault();

    const li = event.target.closest("li[data-id]");
    const editInput = event.target.querySelector("input");
    const newText = editInput.value.trim();

    if (!newText) return;

    const task = tasks.find(
      task => task.id === li.dataset.id
    );

    if (!task) return;

    task.text = newText;
    editingId = null;

    update("Tarea actualizada correctamente.");
  });

  // 13. FILTRAR TAREAS
  filters.addEventListener("click", event => {
    const button = event.target.closest(
      "button[data-filter]"
    );

    if (!button) return;

    currentFilter = button.dataset.filter;
    editingId = null;

    showTasks();
  });

  // 14. ELIMINAR TODAS LAS COMPLETADAS
  clearButton.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);

    editingId = null;

    update("Tareas completadas eliminadas.");
  });

  // 15. MOSTRAR LAS TAREAS AL INICIAR
  showTasks();
}
