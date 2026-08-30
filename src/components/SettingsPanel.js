import React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useWeather } from "../context/WeatherContext";

export default function SettingsPanel() {
  const { units, changeUnits, favorites, geoStatus } = useWeather();
  const [notifications, setNotifications] = useLocalStorage("skycast:notifications", true);
  const [refreshInterval, setRefreshInterval] = useLocalStorage("skycast:refreshInterval", "30");

  return (
    <section className="card settings-panel" aria-label="Settings">
      <h3 className="card-title">Settings</h3>

      <div className="settings-group">
        <p className="settings-group-title">Units</p>
        <div className="settings-row">
          <span>Temperature</span>
          <div className="unit-toggle" role="group" aria-label="Temperature units">
            <button type="button" className={units === "metric" ? "is-active" : ""} onClick={() => changeUnits("metric")}>
              °C
            </button>
            <button type="button" className={units === "imperial" ? "is-active" : ""} onClick={() => changeUnits("imperial")}>
              °F
            </button>
          </div>
        </div>
        <div className="settings-row">
          <span>Wind Speed</span>
          <span className="settings-static-value">{units === "imperial" ? "mph" : "km/h · m/s"}</span>
        </div>
      </div>

      <div className="settings-group">
        <p className="settings-group-title">Location</p>
        <div className="settings-row">
          <span>Permission status</span>
          <span className={`settings-static-value ${geoStatus === "denied" ? "tone-severe" : ""}`}>
            {{
              idle: "Not requested",
              locating: "Requesting…",
              success: "Granted",
              denied: "Denied",
              unsupported: "Unsupported",
              error: "Error",
            }[geoStatus] ?? geoStatus}
          </span>
        </div>
        <div className="settings-row">
          <span>Saved locations</span>
          <span className="settings-static-value">{favorites.length}</span>
        </div>
      </div>

      <div className="settings-group">
        <p className="settings-group-title">Notifications</p>
        <div className="settings-row">
          <span>Severe weather alerts</span>
          <button
            type="button"
            className={`toggle-switch ${notifications ? "is-on" : ""}`}
            role="switch"
            aria-checked={notifications}
            onClick={() => setNotifications((v) => !v)}
          >
            <span />
          </button>
        </div>
      </div>

      <div className="settings-group">
        <p className="settings-group-title">Data</p>
        <div className="settings-row">
          <span>Auto-refresh</span>
          <select
            className="settings-select"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(e.target.value)}
          >
            <option value="15">Every 15 minutes</option>
            <option value="30">Every 30 minutes</option>
            <option value="60">Every hour</option>
            <option value="off">Manual only</option>
          </select>
        </div>
      </div>

      <p className="settings-footnote">Preferences are saved to this browser automatically.</p>
    </section>
  );
}
