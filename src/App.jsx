import { useState } from "react";
import Navbar from "./components/Navbar";
import LocationBar from "./components/LocationBar";
import CurrentWeather from "./pages/CurrentWeather";
import HistoricalWeather from "./pages/HistoricalWeather";
import useWeather from "./hooks/useWeather";

function App() {
  const [activePage, setActivePage] = useState("current");
  const { weather, airQuality, location, loading, error } = useWeather();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <LocationBar location={location} />
      {loading && <p className="text-center text-gray-400 mt-20 text-sm">Fetching weather data…</p>}
      {error && <p className="text-center text-red-400 mt-20 text-sm">Failed to load weather.</p>}
      {!loading && !error && (
        <>
          {activePage === "current" && <CurrentWeather weather={weather} airQuality={airQuality} />}
          {activePage === "historical" && <HistoricalWeather location={location} />}
        </>
      )}
    </div>
  );
}

export default App;