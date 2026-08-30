import React from "react";
import { tempUnitSymbol } from "../utils/formatters";
import { useWeather } from "../context/WeatherContext";

function uvLabel(uvi) {
  if (uvi == null) return { text: "—", tone: "" };
  if (uvi < 3) return { text: "Low", tone: "tone-good" };
  if (uvi < 6) return { text: "Moderate", tone: "tone-fair" };
  if (uvi < 8) return { text: "High", tone: "tone-poor" };
  return { text: "Very High", tone: "tone-severe" };
}

export default function WeatherDetailsCard() {
  const { oneCall, units } = useWeather();
  const current = oneCall?.current;
  const today = oneCall?.daily?.[0];
  if (!current) return null;

  const unitSymbol = tempUnitSymbol(units);
  const uv = uvLabel(current.uvi);

  const rows = [
    { icon: <GaugeIcon />, label: "Pressure", value: `${current.pressure} hPa` },
    {
      icon: <DropletIcon />,
      label: "Dew Point",
      value: current.dew_point != null ? `${Math.round(current.dew_point)}${unitSymbol}` : "—",
    },
    { icon: <SunIcon />, label: "UV Index", value: current.uvi != null ? `${Math.round(current.uvi)} ${uv.text}` : "—", tone: uv.tone },
    { icon: <CloudIcon />, label: "Cloud Cover", value: current.clouds != null ? `${current.clouds}%` : "—" },
    { icon: <RainIcon />, label: "Chance of Rain", value: today ? `${Math.round((today.pop ?? 0) * 100)}%` : "—" },
  ];

  return (
    <section className="card details-card" aria-label="Weather details">
      <h3 className="card-title">
        <ListIcon /> Weather Details
      </h3>
      <ul className="details-list">
        {rows.map((row) => (
          <li key={row.label}>
            <span className="details-icon">{row.icon}</span>
            <span className="details-label">{row.label}</span>
            <span className={`details-value ${row.tone || ""}`}>{row.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
    </svg>
  );
}
function GaugeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20a8 8 0 1 1 8-8" strokeLinecap="round" />
      <path d="M12 12 16 8" strokeLinecap="round" />
    </svg>
  );
}
function DropletIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" strokeLinejoin="round" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" strokeLinecap="round" />
    </svg>
  );
}
function CloudIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 18h10a4 4 0 0 0 .6-7.96A5.5 5.5 0 0 0 7.1 9.02 4 4 0 0 0 7 18Z" strokeLinejoin="round" />
    </svg>
  );
}
function RainIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 15h9a3.5 3.5 0 0 0 .5-6.96 5 5 0 0 0-9.7-1.7A3.5 3.5 0 0 0 7 15Z" />
      <path d="M8 19v1.5M12 19v1.5M16 19v1.5" strokeLinecap="round" />
    </svg>
  );
}
