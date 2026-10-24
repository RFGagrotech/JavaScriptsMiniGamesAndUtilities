export function render(app) {
  app.innerHTML = `
    <section class="weather">
      <h1>Consulta meteorológica</h1>

      <form id="weather-form">
        <input
          id="city"
          type="text"
          placeholder="Introduce una localidad"
          value="Icod de los Vinos"
          required
        >
        <button type="submit">Buscar</button>
      </form>

      <div id="weather-result"></div>
    </section>
  `;

  const form = app.querySelector("#weather-form");
  const input = app.querySelector("#city");
  const result = app.querySelector("#weather-result");

  // 1. Buscar las coordenadas de una localidad
  async function getCoordinates(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error al buscar la localidad");
    }

    const data = await response.json();

    if (!data.results?.length) {
      throw new Error("Localidad no encontrada");
    }

    return data.results[0];
  }

  // 2. Consultar los datos meteorológicos
  async function getWeather(latitude, longitude) {
    const params = new URLSearchParams({
      latitude,
      longitude,
      current: "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
      daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      timezone: "auto",
      forecast_days: 3,
    });

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params}`
    );

    if (!response.ok) {
      throw new Error("Error al consultar el tiempo");
    }

    return await response.json();
  }

  // 3. Traducir el código meteorológico
  function getDescription(code) {
    if (code === 0) return "Despejado";
    if (code <= 2) return "Poco nuboso";
    if (code === 3) return "Nublado";
    if (code <= 48) return "Niebla";
    if (code <= 67) return "Lluvia o llovizna";
    if (code <= 77) return "Nieve";
    if (code <= 82) return "Chubascos";
    if (code <= 86) return "Chubascos de nieve";
    if (code >= 95) return "Tormenta";

    return "Sin descripción";
  }

  // 4. Mostrar los datos en el DOM
  function showWeather(location, data) {
    const current = data.current;
    const daily = data.daily;

    result.replaceChildren();

    const title = document.createElement("h2");
    title.textContent = `${location.name}, ${location.country}`;

    const conditions = document.createElement("p");
    conditions.textContent = getDescription(current.weather_code);

    const temperature = document.createElement("p");
    temperature.textContent =
      `Temperatura: ${current.temperature_2m} °C`;

    const humidity = document.createElement("p");
    humidity.textContent =
      `Humedad: ${current.relative_humidity_2m} %`;

    const wind = document.createElement("p");
    wind.textContent =
      `Viento: ${current.wind_speed_10m} km/h`;

    const subtitle = document.createElement("h3");
    subtitle.textContent = "Previsión de 3 días";

    const list = document.createElement("ul");

    daily.time.forEach((date, index) => {
      const item = document.createElement("li");

      item.textContent = `
        ${date}:
        Máx. ${daily.temperature_2m_max[index]} °C /
        Mín. ${daily.temperature_2m_min[index]} °C /
        Lluvia ${daily.precipitation_probability_max[index] ?? "N/D"} %
      `;

      list.appendChild(item);
    });

    result.append(
      title,
      conditions,
      temperature,
      humidity,
      wind,
      subtitle,
      list
    );
  }

  // 5. Ejecutar la búsqueda completa
  async function searchWeather(city) {
    result.textContent = "Consultando datos...";

    try {
      const location = await getCoordinates(city);

      const data = await getWeather(
        location.latitude,
        location.longitude
      );

      showWeather(location, data);

    } catch (error) {
      result.textContent = error.message;
      console.error(error);
    }
  }

  // 6. Evento del formulario
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const city = input.value.trim();

    if (city) {
      searchWeather(city);
    }
  });

  // Primera consulta al abrir el ejercicio
  searchWeather(input.value.trim());
}
