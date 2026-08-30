# SkyCast — Weather Dashboard

A premium, data-driven weather dashboard: automatic geolocation, live search
with autocomplete, hourly and 7-day forecasts, air quality, an interactive
radar map, sunrise/sunset visualization, precipitation charting, weather
alerts, saved locations, and a settings panel — built with React and the
OpenWeatherMap API.

## Folder structure

Logic is split into focused modules (API, hooks, state, components), per
usual React project conventions. Styling is intentionally kept to a single
file, `src/styles.css`, imported once — no CSS Modules or per-component
stylesheets to jump between.

```
skycast/
│
├── public/
│   └── index.html            # shell, fonts, Leaflet CSS
│
├── src/
│   ├── App.js                  # layout shell + page routing
│   ├── index.js                 # React entry point
│   ├── styles.css                # the one stylesheet for the whole app
│   │
│   ├── api/
│   │   └── weatherApi.js          # every OpenWeatherMap call lives here
│   │
│   ├── context/
│   │   └── WeatherContext.js       # location, units, weather data, favorites
│   │
│   ├── hooks/
│   │   ├── useGeolocation.js        # wraps navigator.geolocation
│   │   ├── useDebounce.js           # debounces the search input
│   │   └── useLocalStorage.js       # persisted state (units, favorites, settings)
│   │
│   ├── utils/
│   │   ├── formatters.js            # time/temperature/AQI display helpers
│   │   └── weatherVisuals.js        # icon URLs + hero background themes
│   │
│   └── components/
│       ├── Sidebar.js               ├── SunMoonCard.js
│       ├── TopNav.js                ├── PrecipitationChart.js
│       ├── SearchBar.js             ├── WeatherMap.js
│       ├── HeroWeatherCard.js       ├── FeelsLikeCard.js
│       ├── WeatherDetailsCard.js    ├── AlertsCard.js
│       ├── AqiCard.js               ├── LocationsPanel.js
│       ├── HourlyForecast.js        ├── SettingsPanel.js
│       └── SevenDayForecast.js      └── LoadingAndError.js
│
├── .env                       # holds your API key (not committed)
├── .gitignore
├── package.json
└── README.md
```

## Setup

1. **Get an API key** at [openweathermap.org/api](https://openweathermap.org/api).
   This app uses several OpenWeather products under one key:
   - **One Call API 3.0** (current + hourly + daily + alerts) — has its own
     free tier (1,000 calls/day) but must be **separately subscribed to** in
     your OpenWeather account, even with a free plan.
   - **Geocoding API** (search autocomplete + reverse geocoding) — included
     with any key.
   - **Air Pollution API** (AQI) — included with any key.
   - **Map tiles** (precipitation/clouds/temperature layers) — included with
     any key.

   If One Call 3.0 isn't enabled, the app automatically falls back to the
   free `/weather` endpoint for current conditions (hourly/daily/alerts just
   won't be available until you enable it).

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Add your key** to `.env`:

   ```
   REACT_APP_OPENWEATHER_KEY=your_actual_key_here
   ```

   Restart the dev server after editing `.env`.

4. **Run it:**

   ```bash
   npm start
   ```

5. **Build for production:**

   ```bash
   npm run build
   ```

## How it works

- **Location flow.** On load, the app requests the browser's geolocation. If
  granted, it reverse-geocodes the coordinates to a place name and fetches
  weather immediately — no manual search required. If denied or unsupported,
  it falls back to a default city and lets the person search.
- **Search.** `SearchBar` debounces input (350ms) before calling the
  Geocoding API, so typing doesn't spam requests. Arrow keys, Enter, and
  click/hover all work for selecting a result.
- **State.** `WeatherContext` is the single source of truth — current place,
  units, the One Call payload, air quality, favorites, and status. Every
  card reads from it via `useWeather()`, so switching location or units
  re-renders the whole dashboard consistently.
- **Persistence.** Units, favorite locations, and settings are saved to
  `localStorage` via `useLocalStorage`, so preferences survive a refresh.
- **Map.** Built with `react-leaflet` on a dark CARTO basemap, with a
  switchable OpenWeatherMap tile overlay (precipitation/clouds/temperature) —
  a real radar layer, not a static image.
- **Resilience.** Every API call is wrapped so failures produce a readable
  message instead of a blank or broken screen; the dashboard shows skeleton
  cards while loading and a retry-capable error state on failure.

## Notes

- Keeping the API key entirely client-side (via `REACT_APP_*`) is standard
  for Create React App and fine for personal/demo use, but it is visible in
  the shipped bundle. For a production deployment handling real traffic,
  proxy these calls through a small backend so the key never reaches the
  browser.
- The 7-day forecast and hourly data depend on One Call 3.0 being enabled;
  see the setup notes above if you only see current conditions.
