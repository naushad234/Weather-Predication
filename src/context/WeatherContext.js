import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  getAirQuality,
  getCurrentWeather,
  getOneCall,
  reverseGeocode,
  WeatherApiError,
} from "../api/weatherApi";
import { useGeolocation } from "../hooks/useGeolocation";
import { useLocalStorage } from "../hooks/useLocalStorage";

const WeatherContext = createContext(null);

const DEFAULT_PLACE = { name: "Vijayawada", state: "Andhra Pradesh", country: "IN", lat: 16.5062, lon: 80.648 };

export function WeatherProvider({ children }) {
  const [units, setUnits] = useLocalStorage("skycast:units", "metric");
  const [favorites, setFavorites] = useLocalStorage("skycast:favorites", []);
  const [place, setPlace] = useState(null);
  const [oneCall, setOneCall] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");
  const [locationSource, setLocationSource] = useState("default"); // default | geolocation | search
  const [lastUpdated, setLastUpdated] = useState(null);

  const geo = useGeolocation();

  const loadWeather = useCallback(async (targetPlace, unitSystem, source) => {
    setStatus("loading");
    setError("");
    try {
      const [weatherData, airData] = await Promise.all([
        getOneCall(targetPlace.lat, targetPlace.lon, unitSystem).catch(async (err) => {
          // Fall back to the basic current-weather endpoint if One Call 3.0
          // isn't enabled on this account, so the app still works.
          if (err instanceof WeatherApiError && err.status === 401) {
            const basic = await getCurrentWeather(targetPlace.lat, targetPlace.lon, unitSystem);
            return {
              current: {
                dt: basic.dt,
                temp: basic.main.temp,
                feels_like: basic.main.feels_like,
                humidity: basic.main.humidity,
                pressure: basic.main.pressure,
                visibility: basic.visibility,
                uvi: null,
                dew_point: null,
                clouds: basic.clouds?.all,
                wind_speed: basic.wind?.speed,
                wind_deg: basic.wind?.deg,
                weather: basic.weather,
                sunrise: basic.sys?.sunrise,
                sunset: basic.sys?.sunset,
              },
              hourly: [],
              daily: [
                {
                  dt: basic.dt,
                  temp: { min: basic.main.temp_min, max: basic.main.temp_max },
                  weather: basic.weather,
                  pop: 0,
                },
              ],
              alerts: [],
              timezone_offset: basic.timezone ?? 0,
              _fallback: true,
            };
          }
          throw err;
        }),
        getAirQuality(targetPlace.lat, targetPlace.lon).catch(() => null),
      ]);

      setOneCall(weatherData);
      setAirQuality(airData);
      setPlace(targetPlace);
      setLocationSource(source);
      setLastUpdated(Date.now());
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof WeatherApiError ? err.message : "Something went wrong while fetching the weather."
      );
    }
  }, []);

  const selectPlace = useCallback(
    (nextPlace, source = "search") => {
      loadWeather(nextPlace, units, source);
    },
    [loadWeather, units]
  );

  const useMyLocation = useCallback(async () => {
    const coords = await geo.locate();
    if (!coords) return false;
    try {
      const results = await reverseGeocode(coords.lat, coords.lon);
      const match = results?.[0];
      const resolvedPlace = match
        ? { name: match.name, state: match.state, country: match.country, lat: coords.lat, lon: coords.lon }
        : { name: "Current location", state: "", country: "", lat: coords.lat, lon: coords.lon };
      await loadWeather(resolvedPlace, units, "geolocation");
      return true;
    } catch {
      await loadWeather(
        { name: "Current location", state: "", country: "", lat: coords.lat, lon: coords.lon },
        units,
        "geolocation"
      );
      return true;
    }
  }, [geo, loadWeather, units]);

  const changeUnits = useCallback(
    (nextUnits) => {
      setUnits(nextUnits);
      if (place) loadWeather(place, nextUnits, locationSource);
    },
    [place, locationSource, loadWeather, setUnits]
  );

  // Initial load: try geolocation first; fall back to a default city.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const coords = await geo.locate();
      if (cancelled) return;
      if (coords) {
        try {
          const results = await reverseGeocode(coords.lat, coords.lon);
          const match = results?.[0];
          const resolvedPlace = match
            ? { name: match.name, state: match.state, country: match.country, lat: coords.lat, lon: coords.lon }
            : { ...DEFAULT_PLACE, lat: coords.lat, lon: coords.lon };
          if (!cancelled) await loadWeather(resolvedPlace, units, "geolocation");
          return;
        } catch {
          if (!cancelled) await loadWeather({ ...DEFAULT_PLACE, lat: coords.lat, lon: coords.lon }, units, "geolocation");
          return;
        }
      }
      if (!cancelled) await loadWeather(DEFAULT_PLACE, units, "default");
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFavorite = useCallback(
    (targetPlace) => {
      setFavorites((prev) => {
        const key = (p) => `${p.name}|${p.country}`;
        const exists = prev.some((f) => key(f) === key(targetPlace));
        return exists ? prev.filter((f) => key(f) !== key(targetPlace)) : [...prev, targetPlace];
      });
    },
    [setFavorites]
  );

  const isFavorite = useCallback(
    (targetPlace) => {
      if (!targetPlace) return false;
      return favorites.some((f) => f.name === targetPlace.name && f.country === targetPlace.country);
    },
    [favorites]
  );

  const value = useMemo(
    () => ({
      units,
      changeUnits,
      place,
      oneCall,
      airQuality,
      status,
      error,
      lastUpdated,
      locationSource,
      geoStatus: geo.status,
      selectPlace,
      useMyLocation,
      favorites,
      toggleFavorite,
      isFavorite,
    }),
    [
      units,
      changeUnits,
      place,
      oneCall,
      airQuality,
      status,
      error,
      lastUpdated,
      locationSource,
      geo.status,
      selectPlace,
      useMyLocation,
      favorites,
      toggleFavorite,
      isFavorite,
    ]
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather must be used within a WeatherProvider");
  return ctx;
}
