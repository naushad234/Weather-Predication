import React from "react";
import SearchBar from "./SearchBar";
import { locationLabel } from "../utils/formatters";
import { useWeather } from "../context/WeatherContext";

export default function LocationsPanel() {
  const { favorites, toggleFavorite, selectPlace, place, useMyLocation, geoStatus } = useWeather();

  return (
    <section className="card locations-panel" aria-label="Favorite locations">
      <h3 className="card-title">Favorite Locations</h3>
      <p className="panel-subtitle">Save the places you check often for one-tap switching.</p>

      <SearchBar
        onSelect={(p) => selectPlace(p, "search")}
        onUseMyLocation={useMyLocation}
        geoStatus={geoStatus}
      />

      {favorites.length === 0 ? (
        <div className="empty-note locations-empty">
          No saved locations yet. Search above, or tap the star on the current-weather card to save it.
        </div>
      ) : (
        <ul className="locations-list">
          {favorites.map((fav) => {
            const isCurrent = place && place.name === fav.name && place.country === fav.country;
            return (
              <li key={`${fav.name}-${fav.country}`} className={isCurrent ? "is-current" : ""}>
                <button type="button" className="location-select" onClick={() => selectPlace(fav, "search")}>
                  <PinIcon />
                  <span>{locationLabel(fav)}</span>
                  {isCurrent && <span className="current-badge">Current</span>}
                </button>
                <button
                  type="button"
                  className="location-remove"
                  onClick={() => toggleFavorite(fav)}
                  aria-label={`Remove ${locationLabel(fav)}`}
                >
                  <TrashIcon />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
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
function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7m2 0-.7 12.1A2 2 0 0 1 14.3 21H9.7a2 2 0 0 1-2-1.9L7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
