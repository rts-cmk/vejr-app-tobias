import { useState } from "react";
import "../styles/WeatherApp.css";
import Search from "./Search";
import WeatherDisplay from "./WeatherDisplay"
import WeatherForecast from "./WeatherForecast";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [forecast, setForecast] = useState([]);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const GEO_API_URL = import.meta.env.VITE_GEO_API_URL;
  const WEATHER_API_URL = import.meta.env.VITE_WEATHER_API_URL;
  const FORECAST_API_URL = import.meta.env.VITE_FORECAST_API_URL;
  
  const fetchWeather = async () => {
    try {
        setError("");
        setWeather(null);

        // Geo API
        const geoUrl = new URL(GEO_API_URL);
        geoUrl.search = new URLSearchParams({
            q: city,
            limit: 1,
            appid: API_KEY
        })
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.length) {
            setError("City not found");
            return;
        }

        const { lat, lon, name, country } = geoData[0];
        
        // Weather API
        const weatherUrl = new URL(WEATHER_API_URL);
        weatherUrl.search = new URLSearchParams({
            lat,
            lon,
            appid: API_KEY,
            units: "metric"
        })

        // Forecast API
        const forecastUrl = new URL(FORECAST_API_URL);
        forecastUrl.search = new URLSearchParams({
            lat,
            lon,
            appid: API_KEY,
            units: "metric"
        })

        // Fetch both at same time
        const [weatherRes, forecastRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl)
        ])

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        const daily = []
        const seenDates = new Set();

        for (let entry of forecastData.list) {
            const date = entry.dt_txt.split(" ")[0];
            const time = entry.dt_txt.split(" ")[1];

            if (time === "12:00:00" && !seenDates.has(date)) {
            daily.push({
                date,
                temp: entry.main.temp,
                icon: entry.weather[0].icon,
            });
            seenDates.add(date);
            }
        }

        // Only 5 days
        setForecast(daily.slice(0, 5));

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
            <WeatherForecast forecast={forecast} />
        </div>
    );
}