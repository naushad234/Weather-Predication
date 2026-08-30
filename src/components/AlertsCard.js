import React, { useState } from "react";
import { formatFullDate } from "../utils/formatters";
import { useWeather } from "../context/WeatherContext";

function severityFromEvent(event = "") {
  const lower = event.toLowerCase();
  if (lower.includes("warning") || lower.includes("severe")) return "severe";
  if (lower.includes("watch") || lower.includes("advisory")) return "warning";
  return "info";
}

export default function AlertsCard({ full = false }) {
  const { oneCall } = useWeather();
  const alerts = oneCall?.alerts ?? [];
  const [index, setIndex] = useState(0);

  if (alerts.length === 0) {
    return (
      <section className="card alerts-card" aria-label="Weather alerts">
        <h3 className="card-title">Weather Alerts</h3>
        <div className="no-alerts">
          <ShieldCheckIcon />
          <p>No active weather alerts</p>
          <span>You're all clear for now — we'll notify you if that changes.</span>
        </div>
      </section>
    );
  }

  const visibleAlerts = full ? alerts : [alerts[index]];

  return (
    <section className="card alerts-card" aria-label="Weather alerts">
      <div className="card-title-row">
        <h3 className="card-title">Weather Alerts</h3>
        {!full && alerts.length > 1 && <span className="alert-count">{index + 1} / {alerts.length}</span>}
      </div>

      {visibleAlerts.map((alert, i) => {
        const severity = severityFromEvent(alert.event);
        return (
          <div className={`alert-item severity-${severity}`} key={`${alert.event}-${i}`}>
            <WarningIcon />
            <div>
              <p className="alert-title">{alert.event}</p>
              <p className="alert-desc">{alert.description?.slice(0, 220) ?? "Details unavailable."}</p>
              <p className="alert-valid">
                Valid until {formatFullDate(alert.end)}
              </p>
            </div>
          </div>
        );
      })}

      {!full && alerts.length > 1 && (
        <div className="alert-pager">
          <button type="button" onClick={() => setIndex((i) => (i - 1 + alerts.length) % alerts.length)} aria-label="Previous alert">
            <ChevronLeft />
          </button>
          <div className="alert-dots">
            {alerts.map((_, i) => (
              <span key={i} className={i === index ? "is-active" : ""} />
            ))}
          </div>
          <button type="button" onClick={() => setIndex((i) => (i + 1) % alerts.length)} aria-label="Next alert">
            <ChevronRight />
          </button>
        </div>
      )}
    </section>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 2 20h20L12 3Z" strokeLinejoin="round" />
      <path d="M12 10v4M12 17.5h.01" strokeLinecap="round" />
    </svg>
  );
}
function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3 4 6v6c0 5 3.5 7.8 8 9 4.5-1.2 8-4 8-9V6l-8-3Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
