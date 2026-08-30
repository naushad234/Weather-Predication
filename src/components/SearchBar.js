import React, { useEffect, useRef, useState } from "react";
import { searchLocations, WeatherApiError } from "../api/weatherApi";
import { useDebounce } from "../hooks/useDebounce";

export default function SearchBar({ onSelect, onUseMyLocation, geoStatus }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [searchError, setSearchError] = useState("");
  const containerRef = useRef(null);
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    let cancelled = false;
    setIsSearching(true);
    setSearchError("");
    searchLocations(trimmed, 6)
      .then((data) => {
        if (cancelled) return;
        setResults(data || []);
        setIsOpen(true);
        setHighlighted(-1);
      })
      .catch((err) => {
        if (cancelled) return;
        setResults([]);
        setSearchError(err instanceof WeatherApiError ? err.message : "Search failed.");
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const commitSelection = (place) => {
    onSelect({
      name: place.name,
      state: place.state,
      country: place.country,
      lat: place.lat,
      lon: place.lon,
    });
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (!isOpen || results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((prev) => (prev + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((prev) => (prev - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const chosen = results[highlighted] ?? results[0];
      if (chosen) commitSelection(chosen);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="search-bar" ref={containerRef}>
      <SearchIcon />
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search location..."
        aria-label="Search for a city, state, or country"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        aria-controls="search-results-listbox"
        role="combobox"
      />
      <button
        type="button"
        className={`locate-chip ${geoStatus === "locating" ? "is-busy" : ""}`}
        onClick={onUseMyLocation}
        title="Use my current location"
        aria-label="Use my current location"
      >
        <LocateIcon />
      </button>

      {isOpen && (
        <div className="search-panel" id="search-results-listbox" role="listbox">
          {isSearching && <div className="search-status">Searching…</div>}
          {!isSearching && searchError && <div className="search-status search-status-error">{searchError}</div>}
          {!isSearching && !searchError && results.length === 0 && debouncedQuery.trim().length >= 2 && (
            <div className="search-status">No matches. Try a different spelling.</div>
          )}
          {!isSearching &&
            results.map((place, index) => (
              <button
                type="button"
                key={`${place.lat}-${place.lon}`}
                className={`search-result ${index === highlighted ? "is-highlighted" : ""}`}
                role="option"
                aria-selected={index === highlighted}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => commitSelection(place)}
              >
                <PinDot />
                <span className="search-result-text">
                  <strong>{place.name}</strong>
                  <small>{[place.state, place.country].filter(Boolean).join(", ")}</small>
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
function LocateIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
    </svg>
  );
}
function PinDot() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2" />
    </svg>
  );
}
