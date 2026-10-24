
export function render() {
  const app = document.querySelector("#app");
  // 1. ESTRUCTURA HTML
  app.innerHTML = `
    <section class="validation-app">
      <h1>Validación de formularios</h1>
      <p>Completa los campos para registrarte.</p>

      <form id="validation-form" novalidate>

        <div class="form-field">
          <label for="name">Nombre completo</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Tu nombre"
            autocomplete="name"
            maxlength="100"
            aria-describedby="name-error"
          >
          <small id="name-error" class="field-error"></small>
        </div>

        <div class="form-field">
          <label for="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="ejemplo@correo.com"
            autocomplete="email"
            aria-describedby="email-error"
          >
          <small id="email-error" class="field-error"></small>
        </div>

        <div class="form-field">
          <label for="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Introduce una contraseña"
            autocomplete="new-password"
            aria-describedby="password-error"
          >
          <small id="password-error" class="field-error"></small>
          <p class="form-help">
            Mínimo 8 caracteres, una mayúscula,
            una minúscula y un número.
          </p>
        </div>

        <div class="form-field">
          <label for="confirmPassword">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            autocomplete="new-password"
            aria-describedby="confirmPassword-error"
          >
          <small
            id="confirmPassword-error"
            class="field-error"
          ></small>
        </div>

        <div class="form-field">
          <label class="checkbox-label">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              aria-describedby="terms-error"
            >
            Acepto los términos y condiciones
          </label>
          <small id="terms-error" class="field-error"></small>
        </div>

        <button type="submit">Registrarse</button>

        <p id="form-status" role="status"></p>
      </form>
    </section>

    <style>
      .validation-app {
        max-width: 500px;
        margin: 2rem auto;
      }

      .validation-app .form-field {
        margin-bottom: 1.25rem;
      }

      .validation-app label {
        display: block;
        margin-bottom: 6px;
        font-weight: 600;
      }

      .validation-app input:not([type="checkbox"]) {
        display: block;
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
        border: 2px solid #cbd5e1;
        border-radius: 8px;
        font-size: 1rem;
      }

      .validation-app input.invalid {
        border-color: #dc2626;
      }

      .validation-app input.valid {
        border-color: #16a34a;
      }

      .validation-app .field-error {
        display: block;
        margin-top: 5px;
        color: #dc2626;
        font-size: 0.85rem;
      }

      .validation-app .form-help {
        color: #64748b;
        font-size: 0.8rem;
      }

      .validation-app .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: normal;
      }

      .validation-app button {
        width: 100%;
        padding: 12px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
      }

      .validation-app button:hover {
        background: #1d4ed8;
      }

      #form-status {
        margin-top: 1rem;
        font-weight: bold;
      }
    </style>
  `;

  // 2. SELECCIONAR ELEMENTOS DEL DOM
  const form = app.querySelector("#validation-form");
  const status = app.querySelector("#form-status");

  const fields = {
    name: app.querySelector("#name"),
    email: app.querySelector("#email"),
    password: app.querySelector("#password"),
    confirmPassword: app.querySelector("#confirmPassword"),
    terms: app.querySelector("#terms")
  };

  // Guardar los campos que ya han sido visitados
  const touched = new Set();

  // 3. VALIDAR EL NOMBRE
  function validateName() {
    const value = fields.name.value.trim();

    if (!value) {
      return "El nombre es obligatorio.";
    }

    if (value.length < 3) {
      return "Introduce al menos 3 caracteres.";
    }

    return "";
  }

  // 4. VALIDAR EL CORREO ELECTRÓNICO
  function validateEmail() {
    const value = fields.email.value.trim();

    if (!value) {
      return "El correo electrónico es obligatorio.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      return "Introduce un correo electrónico válido.";
    }

    return "";
  }

  // 5. VALIDAR LA CONTRASEÑA
  function validatePassword() {
    const value = fields.password.value;

    if (!value) {
      return "La contraseña es obligatoria.";
    }

    if (value.length < 8) {
      return "Debe tener al menos 8 caracteres.";
    }

    if (!/[A-Z]/.test(value)) {
      return "Debe contener una mayúscula.";
    }

    if (!/[a-z]/.test(value)) {
      return "Debe contener una minúscula.";
    }

    if (!/[0-9]/.test(value)) {
      return "Debe contener un número.";
    }

    return "";
  }

  // 6. COMPROBAR LAS DOS CONTRASEÑAS
  function validateConfirmPassword() {
    const password = fields.password.value;
    const confirm = fields.confirmPassword.value;

    if (!confirm) {
      return "Debes confirmar la contraseña.";
    }

    if (password !== confirm) {
      return "Las contraseñas no coinciden.";
    }

    return "";
  }

  // 7. VALIDAR LOS TÉRMINOS
  function validateTerms() {
    if (!fields.terms.checked) {
      return "Debes aceptar las condiciones.";
    }

    return "";
  }

  // 8. AGRUPAR TODAS LAS VALIDACIONES
  const validators = {
    name: validateName,
    email: validateEmail,
    password: validatePassword,
    confirmPassword: validateConfirmPassword,
    terms: validateTerms
  };

  // 9. MOSTRAR ERROR O ÉXITO EN CADA CAMPO
  function showFieldStatus(name, error) {
    const input = fields[name];
    const errorElement = app.querySelector(
      `#${name}-error`
    );

    const isValid = error === "";

    errorElement.textContent = error;

    input.classList.toggle("invalid", !isValid);
    input.classList.toggle("valid", isValid);

    input.setAttribute(
      "aria-invalid",
      String(!isValid)
    );
  }

  // 10. VALIDAR UN CAMPO CONCRETO
  function validateField(name) {
    const error = validators[name]();

    showFieldStatus(name, error);

    return error === "";
  }

  // 11. VALIDAR EL FORMULARIO COMPLETO
  function validateForm() {
    let valid = true;

    for (const name of Object.keys(fields)) {
      touched.add(name);

      if (!validateField(name)) {
        valid = false;
      }
    }

    return valid;
  }

  // 12. VALIDACIÓN EN TIEMPO REAL
  form.addEventListener("input", event => {
    const name = event.target.name;

    if (!Object.hasOwn(fields, name)) return;

    // Validar mientras se corrige un campo visitado
    if (touched.has(name)) {
      validateField(name);
    }

    // Actualizar confirmación si cambia la contraseña
    if (
      name === "password" &&
      touched.has("confirmPassword")
    ) {
      validateField("confirmPassword");
    }

    status.textContent = "";
  });

  // 13. VALIDAR AL ABANDONAR UN CAMPO
  form.addEventListener("focusout", event => {
    const name = event.target.name;

    if (!Object.hasOwn(fields, name)) return;

    touched.add(name);
    validateField(name);
  });

  // 14. VALIDAR CAMBIOS EN EL CHECKBOX
  form.addEventListener("change", event => {
    if (event.target.name === "terms") {
      touched.add("terms");
      validateField("terms");
    }
  });

  // 15. ENVÍO DEL FORMULARIO
  form.addEventListener("submit", event => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      status.textContent =
        "Corrige los errores antes de continuar.";

      // Enfocar el primer campo incorrecto
      const firstInvalid = form.querySelector(".invalid");

      firstInvalid?.focus();
      return;
    }

    // Formulario correcto
    status.textContent =
      "Formulario validado correctamente. " +
      "No se han enviado datos.";

    // Reiniciar formulario
    form.reset();
    touched.clear();

    // Limpiar estados visuales
    Object.keys(fields).forEach(name => {
      const input = fields[name];

      input.classList.remove("valid", "invalid");
      input.removeAttribute("aria-invalid");

      app.querySelector(
        `#${name}-error`
      ).textContent = "";
    });
  });
}
