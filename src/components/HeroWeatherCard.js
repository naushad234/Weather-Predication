import React from "react";
import { formatFullDate, tempUnitSymbol } from "../utils/formatters";
import { iconUrl, THEME_EMOJI, THEME_GRADIENTS, weatherTheme } from "../utils/weatherVisuals";
import { useWeather } from "../context/WeatherContext";

export default function HeroWeatherCard() {
  const { place, oneCall, units, isFavorite, toggleFavorite } = useWeather();
  const current = oneCall?.current;
  const today = oneCall?.daily?.[0];
  if (!current) return null;

  const condition = current.weather?.[0];
  const theme = weatherTheme(condition?.id, condition?.icon);
  const unitSymbol = tempUnitSymbol(units);
  const speedUnit = units === "imperial" ? "mph" : "km/h";
  const windSpeed =
    units === "imperial" ? current.wind_speed : Math.round((current.wind_speed || 0) * 3.6);

  return (
    <section
      className="hero-card bezel bezel-corners-r"
      style={{ background: THEME_GRADIENTS[theme] }}
      aria-label="Current weather"
    >
      <div className="hero-card-overlay">
        <div className="hero-top">
          <div>
            <p className="hero-place">{place?.name}{place?.country ? `, ${place.country}` : ""}</p>
            <p className="hero-date">{formatFullDate(current.dt, oneCall.timezone_offset)}</p>
          </div>
          <div className="hero-actions">
            <button
              type="button"
              className={`icon-chip ${isFavorite(place) ? "is-active" : ""}`}
              onClick={() => place && toggleFavorite(place)}
              aria-label="Save to favorites"
              aria-pressed={isFavorite(place)}
            >
              <StarIcon filled={isFavorite(place)} />
            </button>
          </div>
        </div>

        <div className="hero-mid">
          <div className="hero-temp-block">
            <div className="hero-temp">
              <span>{Math.round(current.temp)}</span>
              <span className="hero-temp-unit">{unitSymbol.replace("°", "")}</span>
            </div>
            <p className="hero-condition">
              <span aria-hidden="true">{THEME_EMOJI[theme]}</span> {condition?.description ?? "—"}
            </p>
          </div>
          {condition?.icon && (
            <img className="hero-icon" src={iconUrl(condition.icon)} alt="" width={128} height={128} />
          )}
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-label">Feels Like</span>
            <span className="hero-stat-value">{Math.round(current.feels_like)}°</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-label">Humidity</span>
            <span className="hero-stat-value">{current.humidity}%</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-label">Wind</span>
            <span className="hero-stat-value">
              {windSpeed} {speedUnit === "km/h" ? "km/h" : speedUnit}
            </span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-label">Visibility</span>
            <span className="hero-stat-value">
              {current.visibility != null ? `${Math.round(current.visibility / 1000)} km` : "—"}
            </span>
          </div>
        </div>

        {today && (
          <p className="hero-minmax">
            H: {Math.round(today.temp.max)}° &nbsp;·&nbsp; L: {Math.round(today.temp.min)}°
          </p>
        )}
      </div>
    </section>
  );
}

function StarIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path
        d="m12 3 2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.9l-5.6 3.2 1.4-6.3L3 9.5l6.4-.6L12 3Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
