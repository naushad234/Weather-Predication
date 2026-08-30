import React from "react";
import { speedUnitLabel, windDirectionLabel } from "../utils/formatters";
import { useWeather } from "../context/WeatherContext";

function feelsDescriptor(actual, feelsLike) {
  const diff = feelsLike - actual;
  if (Math.abs(diff) < 1.5) return "About as expected outside";
  if (diff >= 1.5) return "A bit warmer than the air temp";
  return "A bit cooler than the air temp — humidity's a factor";
}

export default function FeelsLikeCard() {
  const { oneCall, units } = useWeather();
  const current = oneCall?.current;
  if (!current) return null;

  const speedUnit = speedUnitLabel(units);
  const circumference = 2 * Math.PI * 40;
  // Purely decorative fill — anchors around a comfortable midpoint.
  const pct = Math.min(1, Math.max(0.15, (current.feels_like + 10) / 50));

  return (
    <section className="card feelslike-card" aria-label="Feels like">
      <div className="feelslike-gauge-wrap">
        <svg viewBox="0 0 100 100" className="feelslike-gauge">
          <circle cx="50" cy="50" r="40" className="feelslike-track" />
          <circle
            cx="50"
            cy="50"
            r="40"
            className="feelslike-value"
            style={{ strokeDasharray: circumference, strokeDashoffset: circumference - pct * circumference }}
          />
        </svg>
        <svg viewBox="0 0 100 100" className="gauge-ticks" aria-hidden="true">
          {Array.from({ length: 30 }).map((_, i) => {
            const angle = (i / 30) * 360;
            return (
              <line
                key={i}
                x1="50" y1="6" x2="50" y2={i % 3 === 0 ? "11" : "9"}
                transform={`rotate(${angle} 50 50)`}
              />
            );
          })}
        </svg>
        <div className="feelslike-center">
          <span className="feelslike-plus" aria-hidden="true">+</span>
          <span className="feelslike-label">Feels Like</span>
          <span className="feelslike-value-num">{Math.round(current.feels_like)}°</span>
        </div>
      </div>

      <p className="feelslike-desc">{feelsDescriptor(current.temp, current.feels_like)}</p>

      <ul className="feelslike-stats">
        <li>
          <WindIcon />
          <div>
            <span className="fl-label">Wind Speed</span>
            <span className="fl-value">
              {Math.round(current.wind_speed)} {speedUnit}
              {current.wind_deg != null ? ` ${windDirectionLabel(current.wind_deg)}` : ""}
            </span>
          </div>
        </li>
        <li>
          <DropIcon />
          <div>
            <span className="fl-label">Humidity</span>
            <span className="fl-value">{current.humidity}%</span>
          </div>
        </li>
        <li>
          <EyeIcon />
          <div>
            <span className="fl-label">Visibility</span>
            <span className="fl-value">
              {current.visibility != null ? `${Math.round(current.visibility / 1000)} km` : "—"}
            </span>
          </div>
        </li>
      </ul>
    </section>
  );
}

function WindIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 8h10a3 3 0 1 0-3-3M3 16h13a3 3 0 1 1-3 3M3 12h16a2.5 2.5 0 1 0-2.5-2.5" strokeLinecap="round" />
    </svg>
  );
}
function DropIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" strokeLinejoin="round" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
