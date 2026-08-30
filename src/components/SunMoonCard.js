import React from "react";
import { formatTime } from "../utils/formatters";
import { useWeather } from "../context/WeatherContext";

const MOON_PHASE_LABELS = [
  "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
  "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent",
];

function moonPhaseLabel(phase) {
  if (phase == null) return "—";
  const index = Math.round(phase * 8) % 8;
  return MOON_PHASE_LABELS[index];
}

export default function SunMoonCard() {
  const { oneCall } = useWeather();
  const current = oneCall?.current;
  const today = oneCall?.daily?.[0];
  if (!current) return null;

  const sunrise = current.sunrise ?? today?.sunrise;
  const sunset = current.sunset ?? today?.sunset;
  const nowUtc = Math.floor(Date.now() / 1000);
  const dayLength = sunrise && sunset ? sunset - sunrise : 0;
  const progress = dayLength > 0 ? Math.min(1, Math.max(0, (nowUtc - sunrise) / dayLength)) : 0;

  // Point along a simple semicircular arc (viewBox 0..220 x, 0..100 y).
  const arcX = 10 + progress * 200;
  const arcY = 90 - Math.sin(progress * Math.PI) * 78;

  return (
    <section className="card sunmoon-card" aria-label="Sunrise, sunset, and moon">
      <div className="sunmoon-row">
        <div className="sunmoon-item">
          <SunSmallIcon />
          <div>
            <p className="sunmoon-label">Sunrise</p>
            <p className="sunmoon-value">{sunrise ? formatTime(sunrise, oneCall.timezone_offset) : "—"}</p>
          </div>
        </div>

        <svg viewBox="0 0 220 100" className="sun-arc" preserveAspectRatio="none" aria-hidden="true">
          <path d="M10 90 Q110 -10 210 90" className="sun-arc-track" />
          <path
            d="M10 90 Q110 -10 210 90"
            className="sun-arc-progress"
            style={{
              strokeDasharray: 260,
              strokeDashoffset: 260 - progress * 260,
            }}
          />
          {sunrise && sunset && <circle cx={arcX} cy={arcY} r="6" className="sun-arc-dot" />}
        </svg>

        <div className="sunmoon-item sunmoon-item-right">
          <div>
            <p className="sunmoon-label">Sunset</p>
            <p className="sunmoon-value">{sunset ? formatTime(sunset, oneCall.timezone_offset) : "—"}</p>
          </div>
          <SunsetIcon />
        </div>
      </div>

      <div className="sunmoon-row sunmoon-row-moon">
        <div className="sunmoon-item">
          <MoonIcon />
          <div>
            <p className="sunmoon-label">Moonrise</p>
            <p className="sunmoon-value">{today?.moonrise ? formatTime(today.moonrise, oneCall.timezone_offset) : "—"}</p>
          </div>
        </div>
        <div className="sunmoon-item sunmoon-item-right">
          <div>
            <p className="sunmoon-label">Moonset</p>
            <p className="sunmoon-value">{today?.moonset ? formatTime(today.moonset, oneCall.timezone_offset) : "—"}</p>
          </div>
          <MoonIcon />
        </div>
      </div>
      {today?.moon_phase != null && <p className="moon-phase-label">{moonPhaseLabel(today.moon_phase)}</p>}
    </section>
  );
}

function SunSmallIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f4a259" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" strokeLinecap="round" />
    </svg>
  );
}
function SunsetIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#e8615c" strokeWidth="1.8">
      <path d="M17 18a5 5 0 0 0-10 0" strokeLinecap="round" />
      <path d="M2 18h20M12 2v6M4.5 8 6 9.5M19.5 8 18 9.5" strokeLinecap="round" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#93a5c9" strokeWidth="1.8">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" strokeLinejoin="round" />
    </svg>
  );
}
