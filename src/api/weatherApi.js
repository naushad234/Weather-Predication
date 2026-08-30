/**
 * weatherApi.js
 * -----------------------------------------------------------------------
 * All network calls to OpenWeatherMap live here. Every function returns
 * parsed JSON or throws a WeatherApiError with a message that's already
 * safe to show a user.
 * -----------------------------------------------------------------------
 */

const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY;

const GEO_URL = "https://api.openweathermap.org/geo/1.0";
const ONECALL_URL = "https://api.openweathermap.org/data/3.0/onecall";
const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const AIR_URL = "https://api.openweathermap.org/data/2.5/air_pollution";

export class WeatherApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "WeatherApiError";
    this.status = status;
  }
}

function assertApiKey() {
  if (!API_KEY) {
    throw new WeatherApiError(
      "Missing API key. Add REACT_APP_OPENWEATHER_KEY to your .env file and restart the dev server.",
      0
    );
  }
}

async function get(url, params = {}) {
  assertApiKey();
  const fullUrl = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) fullUrl.searchParams.set(key, value);
  });
  fullUrl.searchParams.set("appid", API_KEY);

  let response;
  try {
    response = await fetch(fullUrl.toString());
  } catch (networkErr) {
    throw new WeatherApiError("Network error — check your connection and try again.", 0);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      response.status === 404
        ? "We couldn't find that location. Try searching for a city or country."
        : response.status === 401
        ? "That API key was rejected. Confirm it in your .env file and that One Call 3.0 is enabled on your account."
        : response.status === 429
        ? "You've hit the API rate limit. Wait a moment and try again."
        : body.message || "The weather service didn't respond as expected.";
    throw new WeatherApiError(message, response.status);
  }

  return response.json();
}

/** Forward geocoding — turns a typed query into a list of place matches. */
export function searchLocations(query, limit = 5) {
  return get(`${GEO_URL}/direct`, { q: query, limit });
}

/** Reverse geocoding — turns coordinates into a human-readable place. */
export function reverseGeocode(lat, lon) {
  return get(`${GEO_URL}/reverse`, { lat, lon, limit: 1 });
}

/** Current + hourly (48h) + daily (8d) + alerts, in one call. */
export function getOneCall(lat, lon, units = "metric") {
  return get(ONECALL_URL, { lat, lon, units, exclude: "minutely" });
}

/**
 * Fallback current-conditions call using the free /weather endpoint.
 * Used if a project only has the basic (non–One Call 3.0) plan enabled.
 */
export function getCurrentWeather(lat, lon, units = "metric") {
  return get(CURRENT_URL, { lat, lon, units });
}

export function getAirQuality(lat, lon) {
  return get(AIR_URL, { lat, lon });
}

/** OpenWeather map-tile URL template for the precipitation radar layer. */
export function precipitationTileUrl() {
  return `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`;
}

export function cloudsTileUrl() {
  return `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`;
}

export function tempTileUrl() {
  return `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`;
}
