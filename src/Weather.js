import React, { useState } from "react";

const API_KEY = "5d2ee91830303688797184d27d21a07d";

export const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWindStrength = (speed) => {
    if (speed < 1) return "No wind";
    if (speed < 5) return "Weak wind";
    if (speed < 10) return "Medium wind";
    return "Strong wind";
  };

  const fetchWeather = async () => {
    if (!city) return alert("Please enter a city name.");

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod !== 200) {
        setError("City not found! Please enter a valid city.");
        setWeatherInfo(null);
        return;
      }

      const windStrength = getWindStrength(data.wind.speed);
      const weatherData = {
        name: data.name,
        country: data.sys.country,
        temp: data.main.temp,
        description: data.weather[0].description,
        wind: windStrength,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      };

      setWeatherInfo(weatherData);
    } catch (error) {
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Weather Check</h2>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
      />
      <button onClick={fetchWeather} disabled={loading}>
        {loading ? "Loading..." : "Get Weather"}
      </button>

      {error && <p>{error}</p>}

      {weatherInfo && (
        <div id="weather-info">
          <h3>
            {weatherInfo.name}, {weatherInfo.country}
          </h3>
          <p>Temperature: {weatherInfo.temp}°C</p>
          <p>Weather: {weatherInfo.description}</p>
          <p>Wind: {weatherInfo.wind}</p>
          <img src={weatherInfo.icon} alt="Weather Icon" />
        </div>
      )}
    </div>
  );
};
