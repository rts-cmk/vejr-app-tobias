import { useState } from "react";
import "../styles/WeatherApp.css";
import Search from "./Search";
import WeatherDisplay from "./WeatherDisplay"

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
    <div className="weather_app">
        <h1>Weather App</h1>
        <Search 
            city={city}
            onCityChange={setCity}
            onSearch={fetchWeather}
        />
        <WeatherDisplay weather={weather} error={error} />
    </div>
  );
}