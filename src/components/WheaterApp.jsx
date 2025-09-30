import { useState } from "react";
import "../styles/WeatherApp.css";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_API_KEY;
  
  const fetchWeather = async () => {
    try {
      setError("");
      setWeather(null);

      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoRes.json();
      if (!geoData.length) {
        setError("City not found");
        return;
      }
      const { lat, lon, name, country } = geoData[0];

      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        city: name,
        country,
        temp: weatherData.main.temp,
        wind: weatherData.wind.speed,
        icon: weatherData.weather[0].icon,
        lon,
        lat,
      });
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="weather-app">
      <h1>Weather App</h1>
      <div className="search-container">
        <div className="search-input">
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
            />
        </div>
        <button onClick={fetchWeather}>Search</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div className="weather-result">
          <h2>
            {weather.city}, {weather.country}
          </h2>
          <p>Temp: {weather.temp} °C</p>
          <p>Wind: {weather.wind} m/s </p>
          <p>
            Cordinates: {weather.lat}, {weather.lon}
          </p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt="Weather icon"
          />
        </div>
      )}
    </div>
  );
}