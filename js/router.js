/* =========================================
   ROUTER - SISTEMA DE NAVEGACIÓN POR HASH
   Permite cargar distintos ejercicios
   sin recargar completamente la página.
========================================= */
// Importamos el objeto "excercises" desde exercises.js.
// Este objeto relaciona cada ruta con una función de carga.
import { excercises } from "./exercises.js";
// Contador global para identificar cada navegación.
// Permite descartar cargas antiguas si cambiamos de ruta rápidamente.
let navigationId = 0;
// Exportamos la función router para utilizarla en otros archivos.
// "async" indica que la función devuelve una Promise.
export async function router() {
    // Seleccionamos el elemento HTML con id="app".
    // Será el contenedor donde mostraremos los ejercicios.
    const app = document.querySelector("#app");
    // Obtenemos la ruta indicada después del símbolo "#".
    // slice(1) elimina el "#".
    // Si no existe una ruta, utilizamos "/" como valor predeterminado.
    const path = location.hash.slice(1) || "/";
    // Buscamos en "excercises" la función de carga
    // correspondiente a la ruta actual.
    const loadExcercise = excercises[path];
    // Incrementamos el contador global en 1.
    // Guardamos su valor para identificar esta navegación.
    const currentId = ++navigationId;
    // Si no encontramos una función asociada a la ruta...
    if (!loadExcercise) {
        // Mostramos el contenido predeterminado en #app.
        // innerHTML interpreta las etiquetas como HTML.
        app.innerHTML = `
            <h1 class="title">Elige un Minijuego/utilidad para probarla</h1>
            <p>Don't be shy</p>
            <button class="btn" id="change">Change background</button>
            <br></br>
            <p id="counter"></p>
            <button class="btn" id="plus">+</button>
            <button class="btn" id="minus">-</button>
            <button class="btn" id="reset">Reset</button>
        `;
        // Finalizamos la ejecución del router.
        // No intentamos cargar ningún ejercicio.
        return;
    }
    // Mostramos un mensaje temporal mientras carga el ejercicio.
    // textContent introduce texto sin interpretarlo como HTML.
    app.textContent = "Cargando ejercicio...Espanglish 😂";
    // Intentamos cargar y ejecutar el ejercicio.
    // Si ocurre un error, pasaremos al bloque catch.
    try {
        // Ejecutamos la función de carga del ejercicio.
        // await espera su resultado, que debe ser una
        // función encargada de renderizar el ejercicio.
        const render = await loadExcercise();
        // Comprobamos si esta navegación sigue siendo la actual.
        // Si el usuario ya cambió de ruta, dejamos de ejecutarla.
        if (currentId !== navigationId) return;
        // Eliminamos todos los elementos hijos de #app.
        // Dejamos el contenedor vacío para el nuevo ejercicio.
        app.replaceChildren();
        // Ejecutamos la función render y le pasamos #app.
        // await espera si render devuelve una Promise.
        await render(app);
    // Capturamos errores durante la carga o ejecución.
    } catch (error) {
        // Si ya existe otra navegación, ignoramos este error.
        // Evitamos mostrar errores de ejercicios anteriores.
        if (currentId !== navigationId) return;
        // Mostramos el error detallado en la consola.
        console.error(error);
        // Informamos al usuario mediante un mensaje en #app.
        app.textContent = "Error al cargar el ejercicio.";
    }
}
