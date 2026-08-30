import React, { useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { cloudsTileUrl, precipitationTileUrl, tempTileUrl } from "../api/weatherApi";
import { useWeather } from "../context/WeatherContext";

// Leaflet's default marker icons reference image files that don't survive
// bundling; rebuild the icon from CDN URLs instead of local asset imports.
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LAYERS = {
  precipitation: { label: "Precipitation", url: precipitationTileUrl },
  clouds: { label: "Clouds", url: cloudsTileUrl },
  temp: { label: "Temperature", url: tempTileUrl },
};

function Recenter({ lat, lon }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView([lat, lon], map.getZoom());
  }, [lat, lon, map]);
  return null;
}

export default function WeatherMap({ tall = false }) {
  const { place } = useWeather();
  const [layer, setLayer] = useState("precipitation");
  if (!place) return null;

  return (
    <section className={`card map-card ${tall ? "map-card-tall" : ""}`} aria-label="Weather radar">
      <div className="card-title-row">
        <h3 className="card-title">Weather Radar</h3>
        <div className="layer-switch" role="group" aria-label="Map layer">
          {Object.entries(LAYERS).map(([key, cfg]) => (
            <button
              key={key}
              type="button"
              className={layer === key ? "is-active" : ""}
              onClick={() => setLayer(key)}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      <div className="map-frame bezel bezel-corners-r">
        <MapContainer
          center={[place.lat, place.lon]}
          zoom={7}
          scrollWheelZoom={false}
          className="leaflet-container-custom"
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <TileLayer url={LAYERS[layer].url()} opacity={0.75} />
          <Marker position={[place.lat, place.lon]} icon={markerIcon} />
          <Recenter lat={place.lat} lon={place.lon} />
        </MapContainer>
      </div>

      <div className="map-legend">
        <span>Light</span>
        <span className="legend-gradient" aria-hidden="true" />
        <span>Heavy</span>
      </div>
    </section>
  );
}
