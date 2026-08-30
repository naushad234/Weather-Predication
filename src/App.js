import React, { useState } from "react";
import { WeatherProvider, useWeather } from "./context/WeatherContext";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import HeroWeatherCard from "./components/HeroWeatherCard";
import WeatherDetailsCard from "./components/WeatherDetailsCard";
import AqiCard from "./components/AqiCard";
import HourlyForecast from "./components/HourlyForecast";
import SevenDayForecast from "./components/SevenDayForecast";
import SunMoonCard from "./components/SunMoonCard";
import PrecipitationChart from "./components/PrecipitationChart";
import WeatherMap from "./components/WeatherMap";
import FeelsLikeCard from "./components/FeelsLikeCard";
import AlertsCard from "./components/AlertsCard";
import LocationsPanel from "./components/LocationsPanel";
import SettingsPanel from "./components/SettingsPanel";
import { DashboardSkeleton, ErrorState } from "./components/LoadingAndError";

function DashboardPage() {
  return (
    <div className="dashboard-grid">
      <div className="col-main">
        <HeroWeatherCard />
        <HourlyForecast hours={10} />
        <SevenDayForecast />
        <div className="row-3">
          <WeatherMap />
          <FeelsLikeCard />
          <AlertsCard />
        </div>
      </div>
      <div className="col-side">
        <AqiCard compact />
        <WeatherDetailsCard />
        <SunMoonCard />
        <PrecipitationChart />
      </div>
    </div>
  );
}

function TodayPage() {
  return (
    <div className="dashboard-grid">
      <div className="col-main">
        <HeroWeatherCard />
        <HourlyForecast hours={24} />
        <div className="row-3">
          <FeelsLikeCard />
          <SunMoonCard />
          <AlertsCard />
        </div>
      </div>
      <div className="col-side">
        <AqiCard compact />
        <WeatherDetailsCard />
        <PrecipitationChart />
      </div>
    </div>
  );
}

function ForecastPage() {
  return (
    <div className="dashboard-grid">
      <div className="col-main">
        <HourlyForecast hours={24} />
        <SevenDayForecast full />
        <PrecipitationChart />
      </div>
      <div className="col-side">
        <WeatherDetailsCard />
        <SunMoonCard />
      </div>
    </div>
  );
}

function MapsPage() {
  return (
    <div className="dashboard-grid dashboard-grid-single">
      <WeatherMap tall />
    </div>
  );
}

function AirQualityPage() {
  return (
    <div className="dashboard-grid">
      <div className="col-main">
        <AqiCard />
      </div>
      <div className="col-side">
        <WeatherDetailsCard />
      </div>
    </div>
  );
}

function AlertsPage() {
  return (
    <div className="dashboard-grid dashboard-grid-single">
      <AlertsCard full />
    </div>
  );
}

function LocationsPage() {
  return (
    <div className="dashboard-grid dashboard-grid-single">
      <LocationsPanel />
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="dashboard-grid dashboard-grid-single">
      <SettingsPanel />
    </div>
  );
}

const PAGES = {
  dashboard: DashboardPage,
  today: TodayPage,
  forecast: ForecastPage,
  maps: MapsPage,
  "air-quality": AirQualityPage,
  alerts: AlertsPage,
  locations: LocationsPage,
  settings: SettingsPage,
};

function AppShell() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { status, error, oneCall, place, selectPlace } = useWeather();

  const alertCount = oneCall?.alerts?.length ?? 0;
  const PageComponent = PAGES[activePage] ?? DashboardPage;

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onAddLocation={() => setActivePage("locations")}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="app-main">
        <TopNav
          onMenuClick={() => setSidebarOpen(true)}
          onOpenAlerts={() => setActivePage("alerts")}
          alertCount={alertCount}
        />

        <main className="app-content">
          {status === "loading" && <DashboardSkeleton />}

          {status === "error" && (
            <ErrorState message={error} onRetry={() => place && selectPlace(place, "search")} />
          )}

          {status === "ready" && <PageComponent />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <WeatherProvider>
      <AppShell />
    </WeatherProvider>
  );
}
