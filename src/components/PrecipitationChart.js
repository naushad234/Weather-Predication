import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
} from "chart.js";
import { formatHour } from "../utils/formatters";
import { useWeather } from "../context/WeatherContext";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function PrecipitationChart() {
  const { oneCall } = useWeather();
  const hourly = useMemo(() => oneCall?.hourly?.slice(0, 8) ?? [], [oneCall]);

  const chartData = useMemo(
    () => ({
      labels: hourly.map((h, i) => (i === 0 ? "Now" : formatHour(h.dt, oneCall.timezone_offset))),
      datasets: [
        {
          data: hourly.map((h) => Math.round((h.pop ?? 0) * 100)),
          backgroundColor: "rgba(43, 212, 195, 0.75)",
          hoverBackgroundColor: "#2bd4c3",
          borderRadius: 6,
          maxBarThickness: 28,
        },
      ],
    }),
    [hourly, oneCall]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: { label: (ctx) => `${ctx.parsed.y}% chance of rain` },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#93a6b5", font: { family: "IBM Plex Mono", size: 11 } },
        },
        y: {
          display: false,
          suggestedMax: 100,
          beginAtZero: true,
        },
      },
    }),
    []
  );

  const currentPop = hourly[0] ? Math.round((hourly[0].pop ?? 0) * 100) : null;

  return (
    <section className="card precip-card" aria-label="Precipitation">
      <h3 className="card-title">Precipitation</h3>
      {hourly.length === 0 ? (
        <p className="empty-note">Precipitation data isn't available for this location right now.</p>
      ) : (
        <div className="precip-body">
          <div className="precip-headline">
            <span className="precip-dot" />
            <span className="precip-figure">{currentPop}%</span>
            <span className="precip-caption">Chance of Rain</span>
          </div>
          <div className="precip-chart-wrap">
            <Bar data={chartData} options={options} />
          </div>
        </div>
      )}
    </section>
  );
}
