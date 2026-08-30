import React from "react";
import SearchBar from "./SearchBar";
import { locationLabel, relativeTime } from "../utils/formatters";
import { useWeather } from "../context/WeatherContext";

export default function TopNav({ onMenuClick, onOpenAlerts, alertCount }) {
  const { place, units, changeUnits, selectPlace, useMyLocation, geoStatus, lastUpdated } = useWeather();

  return (
    <header className="top-nav">
      <button type="button" className="menu-btn" onClick={onMenuClick} aria-label="Open navigation menu">
        <MenuIcon />
      </button>

      <SearchBar onSelect={(p) => selectPlace(p, "search")} onUseMyLocation={useMyLocation} geoStatus={geoStatus} />

      <div className="top-nav-right">
        <div className="current-place" title={place ? locationLabel(place) : ""}>
          <PinIcon />
          <div>
            <p className="current-place-name">{place ? locationLabel(place) : "Locating…"}</p>
            <p className="current-place-status">
              <span className="status-dot" aria-hidden="true" />
              {lastUpdated ? `Updated ${relativeTime(Date.now() - lastUpdated)}` : "Detecting location"}
            </p>
          </div>
        </div>

        <div className="unit-toggle" role="group" aria-label="Temperature units">
          <button type="button" className={units === "metric" ? "is-active" : ""} onClick={() => changeUnits("metric")}>
            °C
          </button>
          <button type="button" className={units === "imperial" ? "is-active" : ""} onClick={() => changeUnits("imperial")}>
            °F
          </button>
        </div>

        <button type="button" className="icon-btn" onClick={onOpenAlerts} aria-label="View alerts">
          <BellIcon />
          {alertCount > 0 && <span className="notif-dot" />}
        </button>

        <button type="button" className="icon-btn" aria-label="User profile">
          <UserIcon />
        </button>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.2" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z" strokeLinejoin="round" />
      <path d="M10 19a2 2 0 0 0 4 0" strokeLinecap="round" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8.5" r="3.2" />
      <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" strokeLinecap="round" />
    </svg>
  );
}
