import React from "react";
import { aqiColor, aqiDescription, aqiLabel } from "../utils/formatters";
import { useWeather } from "../context/WeatherContext";

export default function AqiCard({ compact = false, onSeeMore }) {
  const { airQuality } = useWeather();
  const aqi = airQuality?.list?.[0]?.main?.aqi;
  const components = airQuality?.list?.[0]?.components;

  const color = aqiColor(aqi);
  const pct = aqi ? (aqi / 5) * 100 : 0;
  const circumference = 2 * Math.PI * 42;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <section className="card aqi-card" aria-label="Air quality index">
      <h3 className="card-title">
        <LeafIcon /> Air Quality Index
      </h3>

      <div className="aqi-gauge-wrap">
        <svg viewBox="0 0 100 100" className="aqi-gauge">
          <circle cx="50" cy="50" r="42" className="aqi-gauge-track" />
          <circle
            cx="50"
            cy="50"
            r="42"
            style={{ stroke: color, strokeDasharray: circumference, strokeDashoffset: dashOffset }}
            className="aqi-gauge-value"
          />
        </svg>
        <svg viewBox="0 0 100 100" className="gauge-ticks" aria-hidden="true">
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = (i / 36) * 360;
            return (
              <line
                key={i}
                x1="50" y1="4" x2="50" y2={i % 3 === 0 ? "9" : "7"}
                transform={`rotate(${angle} 50 50)`}
              />
            );
          })}
        </svg>
        <div className="aqi-gauge-center">
          <span className="aqi-number">{aqi ?? "—"}</span>
          <span className="aqi-word" style={{ color }}>
            {aqi ? aqiLabel(aqi) : "Unavailable"}
          </span>
        </div>
      </div>

      <p className="aqi-description">{aqiDescription(aqi)}</p>

      {!compact && components && (
        <button type="button" className="see-more-link" onClick={onSeeMore}>
          See More <ChevronIcon />
        </button>
      )}

      {compact && components && (
        <dl className="pollutant-grid">
          <div>
            <dt>PM2.5</dt>
            <dd>{components.pm2_5?.toFixed(1)}</dd>
          </div>
          <div>
            <dt>PM10</dt>
            <dd>{components.pm10?.toFixed(1)}</dd>
          </div>
          <div>
            <dt>O₃</dt>
            <dd>{components.o3?.toFixed(1)}</dd>
          </div>
          <div>
            <dt>NO₂</dt>
            <dd>{components.no2?.toFixed(1)}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 4C10 4 4 10 4 18c8 0 14-6 14-14Z" strokeLinejoin="round" />
      <path d="M4 20 12 12" strokeLinecap="round" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
