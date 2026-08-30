/** formatters.js — small, pure display-formatting helpers. */

export function formatTime(unixSeconds, timezoneOffsetSeconds, opts = {}) {
  if (unixSeconds == null) return "—";
  const date = new Date((unixSeconds + (timezoneOffsetSeconds ?? 0)) * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
    ...opts,
  });
}

export function formatHour(unixSeconds, timezoneOffsetSeconds) {
  if (unixSeconds == null) return "—";
  const date = new Date((unixSeconds + (timezoneOffsetSeconds ?? 0)) * 1000);
  return date.toLocaleTimeString("en-US", { hour: "numeric", timeZone: "UTC" });
}

export function formatDayName(unixSeconds, timezoneOffsetSeconds, index) {
  if (index === 0) return "Today";
  const date = new Date((unixSeconds + (timezoneOffsetSeconds ?? 0)) * 1000);
  return date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
}

export function formatFullDate(unixSeconds, timezoneOffsetSeconds) {
  const date = unixSeconds
    ? new Date((unixSeconds + (timezoneOffsetSeconds ?? 0)) * 1000)
    : new Date();
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: unixSeconds ? "UTC" : undefined,
  });
}

export function windDirectionLabel(deg) {
  if (deg == null) return "—";
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

export function speedUnitLabel(units) {
  return units === "imperial" ? "mph" : "m/s";
}

export function tempUnitSymbol(units) {
  return units === "imperial" ? "°F" : "°C";
}

/** EPA-style 1–5 scale used by OpenWeather's Air Pollution API. */
export function aqiLabel(aqi) {
  return { 1: "Good", 2: "Fair", 3: "Moderate", 4: "Poor", 5: "Very Poor" }[aqi] || "Unknown";
}

export function aqiColor(aqi) {
  return (
    { 1: "#4ade80", 2: "#a3e635", 3: "#facc15", 4: "#fb923c", 5: "#f87171" }[aqi] || "#94a3b8"
  );
}

export function aqiDescription(aqi) {
  return (
    {
      1: "Air quality is satisfactory and poses little or no risk.",
      2: "Air quality is acceptable for most people.",
      3: "Sensitive groups may experience minor effects.",
      4: "Everyone may begin to notice health effects.",
      5: "Health warnings of emergency conditions.",
    }[aqi] || "Air quality data is unavailable right now."
  );
}

export function relativeTime(msSinceUpdate) {
  const seconds = Math.round(msSinceUpdate / 1000);
  if (seconds < 45) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return `${hours} hr ago`;
}

export function locationLabel(place) {
  if (!place) return "";
  return [place.name, place.state, place.country].filter(Boolean).join(", ");
}
