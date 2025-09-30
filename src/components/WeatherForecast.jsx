export default function WeatherForecast({ forecast }) {
    if (!forecast || forecast.length === 0) return null

    // Format date
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, { weekday: 'short' });
    }

    return (
        <div className="weather-forecast">
            <h2>5-Day Weather Forecast</h2>
            <div className="forecast-grid">
            {forecast.map((day, index) => ( 
                <div key={index} className="forecast-day"> 
                    <p>{formatDate(day.date)}</p> 
                    <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt="Weather icon" /> 
                    <p>{day.temp} °C</p> 
                </div> 
            ))}
            </div>
        </div>
    )
}