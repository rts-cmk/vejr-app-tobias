export default function WeatherDisplay({ weather, error}){
    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!weather) {
        return null;
    }

    return (
        <div className="weather-result"> 
            <h2> {weather.city}, {weather.country} </h2> 
            <p>Temp: {weather.temp} °C</p> <p>Wind: {weather.wind} m/s </p> 
            <p> Coordinates: {weather.lat}, {weather.lon} </p> 
            <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="Weather icon" /> 
        </div>
    )
}