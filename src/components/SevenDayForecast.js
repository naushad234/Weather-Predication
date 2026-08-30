import React, { useState } from "react";
import { formatDayName } from "../utils/formatters";
import { iconUrl } from "../utils/weatherVisuals";
import { useWeather } from "../context/WeatherContext";

export default function SevenDayForecast({ full = false, onViewFull }) {
  const { oneCall } = useWeather();
  const [selected, setSelected] = useState(0);
  const days = oneCall?.daily?.slice(0, full ? 8 : 7) ?? [];

  return (
    <section className="card week-card" aria-label="7-day forecast">
      <div className="card-title-row">
        <h3 className="card-title">7-Day Forecast</h3>
        {!full && (
          <button type="button" className="see-more-link" onClick={onViewFull}>
            View Full Forecast <ChevronIcon />
          </button>
        )}
      </div>
      {days.length === 0 ? (
        <p className="empty-note">Daily forecast isn't available for this location right now.</p>
      ) : (
        <ol className="week-list">
          {days.map((day, index) => (
            <li key={day.dt}>
              <button
                type="button"
                className={`week-item ${index === selected ? "is-selected" : ""}`}
                onClick={() => setSelected(index)}
              >
                <span className="week-day">{formatDayName(day.dt, oneCall.timezone_offset, index)}</span>
                {day.weather?.[0]?.icon && (
                  <img src={iconUrl(day.weather[0].icon, 2)} alt={day.weather[0].description} width={34} height={34} />
                )}
                <span className="week-temps">
                  <strong>{Math.round(day.temp.max)}°</strong>
                  <small>{Math.round(day.temp.min)}°</small>
                </span>
                {full && <span className="week-pop">{Math.round((day.pop ?? 0) * 100)}% rain</span>}
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
