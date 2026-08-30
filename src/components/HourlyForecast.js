import React from "react";
import { formatHour } from "../utils/formatters";
import { iconUrl } from "../utils/weatherVisuals";
import { useWeather } from "../context/WeatherContext";

export default function HourlyForecast({ hours = 24 }) {
  const { oneCall } = useWeather();
  const hourly = oneCall?.hourly?.slice(0, hours) ?? [];

  return (
    <section className="card hourly-card" aria-label="Hourly forecast">
      <h3 className="card-title">Today's Forecast</h3>
      {hourly.length === 0 ? (
        <p className="empty-note">Hourly data isn't available for this location right now.</p>
      ) : (
        <ol className="hourly-list">
          {hourly.map((hour, index) => (
            <li key={hour.dt} className={`hourly-item ${index === 0 ? "is-now" : ""}`}>
              <span className="hourly-time">{index === 0 ? "Now" : formatHour(hour.dt, oneCall.timezone_offset)}</span>
              {hour.weather?.[0]?.icon && (
                <img src={iconUrl(hour.weather[0].icon, 2)} alt={hour.weather[0].description} width={36} height={36} />
              )}
              <span className="hourly-temp">{Math.round(hour.temp)}°</span>
              {hour.pop > 0 && <span className="hourly-pop">{Math.round(hour.pop * 100)}%</span>}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
