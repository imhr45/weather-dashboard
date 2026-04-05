import { useState } from "react";
import { fetchHistorical } from "../services/weatherApi";
import HourlyChart from "../components/HourlyChart";

const fmtTime = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return +(d.getHours() + d.getMinutes() / 60).toFixed(2);
};

const HistoricalWeather = ({ location }) => {
  const today = new Date().toISOString().split("T")[0];
  const monthAgo = new Date(Date.now() - 30 * 86400000)
    .toISOString()
    .split("T")[0];
  const [start, setStart] = useState(monthAgo);
  const [end, setEnd] = useState(today);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    if (!location) return;
    const diff = new Date(end) - new Date(start);
    if (diff > 2 * 365 * 86400000) {
      setError("Max range is 2 years.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchHistorical(
        location.latitude,
        location.longitude,
        start,
        end
      );
      setData(result);
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <label className="text-sm text-gray-500">From</label>
        <input
          type="date"
          value={start}
          max={today}
          onChange={(e) => setStart(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white"
        />
        <label className="text-sm text-gray-500">To</label>
        <input
          type="date"
          value={end}
          max={today}
          onChange={(e) => setEnd(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white"
        />
        <button
          onClick={load}
          className="border border-gray-300 rounded-lg px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          Load →
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {loading && (
        <p className="text-gray-400 text-sm">Loading historical data…</p>
      )}

      {data &&
        (() => {
          const d = data.wx.daily;
          const labels = d.time;

          const tempData = labels.map((t, i) => ({
            time: t,
            Mean: d.temperature_2m_mean?.[i] ?? null,
            Max: d.temperature_2m_max[i] ?? null,
            Min: d.temperature_2m_min[i] ?? null,
          }));

          const sunData = labels.map((t, i) => ({
            time: t,
            Sunrise: fmtTime(d.sunrise[i]),
            Sunset: fmtTime(d.sunset[i]),
          }));

          const precData = labels.map((t, i) => ({
            time: t,
            Precipitation: d.precipitation_sum[i] ?? 0,
          }));

          const windData = labels.map((t, i) => ({
            time: t,
            "Wind Speed": d.wind_speed_10m_max[i] ?? null,
            "Direction°": d.wind_direction_10m_dominant[i] ?? null,
          }));

          const pmData = data.aq?.daily
            ? labels.map((t, i) => ({
                time: t,
                PM10: data.aq.daily.pm10_mean?.[i] ?? null,
                "PM2.5": data.aq.daily.pm2_5_mean?.[i] ?? null,
              }))
            : null;

          return (
            <>
              <HourlyChart
                title="Temperature — Mean, Max, Min (°C)"
                data={tempData}
                dataKeys={["Mean", "Max", "Min"]}
                colors={["#378ADD", "#D85A30", "#1D9E75"]}
              />
              <HourlyChart
                title="Sunrise & Sunset (IST — decimal hours)"
                data={sunData}
                dataKeys={["Sunrise", "Sunset"]}
                colors={["#BA7517", "#D85A30"]}
              />
              <HourlyChart
                title="Precipitation Total (mm)"
                data={precData}
                dataKeys={["Precipitation"]}
                colors={["#378ADD"]}
                type="bar"
              />
              <HourlyChart
                title="Max Wind Speed (km/h) & Dominant Direction (°)"
                data={windData}
                dataKeys={["Wind Speed", "Direction°"]}
                colors={["#888780", "#378ADD"]}
              />
              {pmData && (
                <HourlyChart
                  title="PM10 & PM2.5 Trends (μg/m³)"
                  data={pmData}
                  dataKeys={["PM10", "PM2.5"]}
                  colors={["#378ADD", "#D85A30"]}
                />
              )}
            </>
          );
        })()}
    </div>
  );
};

export default HistoricalWeather;