import { useState } from "react";
import WeatherCard from "../components/WeatherCard";
import HourlyChart from "../components/HourlyChart";

const fmtTime = (iso) => {
  if (!iso) return "--";
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toF = (c) => Math.round((c * 9) / 5 + 32);

const getHourlyForDate = (hourly, dateStr) =>
  hourly.time
    .map((t, i) => (t.startsWith(dateStr) ? i : -1))
    .filter((i) => i >= 0);

const CurrentWeather = ({ weather, airQuality }) => {
  const [tempUnit, setTempUnit] = useState("C");
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  if (!weather) return null;

  const { daily, current, hourly } = weather;
  const dayIdx = daily.time.indexOf(selectedDate);

  if (dayIdx < 0)
    return <p className="p-6 text-gray-500">No data for selected date.</p>;

  const fmt = (v) =>
    v === null || v === undefined
      ? "--"
      : tempUnit === "C"
      ? Math.round(v) + "°C"
      : toF(v) + "°F";

  const maxT = daily.temperature_2m_max[dayIdx];
  const minT = daily.temperature_2m_min[dayIdx];
  const uvi = daily.uv_index_max[dayIdx];
  const windMax = daily.wind_speed_10m_max[dayIdx];
  const precMax = daily.precipitation_probability_max[dayIdx];

  const hourIdxs = getHourlyForDate(hourly, selectedDate);
  const hrs = hourIdxs.map((i) => hourly.time[i].slice(11, 16));

  const hTemp = hourIdxs.map((i) =>
    tempUnit === "C"
      ? hourly.temperature_2m[i]
      : toF(hourly.temperature_2m[i])
  );
  const hHum = hourIdxs.map((i) => hourly.relative_humidity_2m[i]);
  const hPrec = hourIdxs.map((i) => hourly.precipitation[i]);
  const hVis = hourIdxs.map((i) =>
    +(hourly.visibility[i] / 1000).toFixed(1)
  );
  const hWind = hourIdxs.map((i) => hourly.wind_speed_10m[i]);

  const makeData = (keys, values) =>
    hrs.map((t, i) => ({
      time: t,
      ...Object.fromEntries(keys.map((k, j) => [k, values[j][i]])),
    }));

  let aqHourIdxs = [],
    aqPM10 = [],
    aqPM25 = [],
    curAQI = null,
    curPM10 = null,
    curPM25 = null,
    curCO = null,
    curCO2 = null,
    curNO2 = null,
    curSO2 = null;

  if (airQuality) {
    aqHourIdxs = getHourlyForDate(airQuality.hourly, selectedDate);
    aqPM10 = aqHourIdxs.map((i) => airQuality.hourly.pm10[i]);
    aqPM25 = aqHourIdxs.map((i) => airQuality.hourly.pm2_5[i]);
    const nowH = new Date().getHours();
    const ci =
      aqHourIdxs.find(
        (i) => parseInt(airQuality.hourly.time[i].slice(11, 13)) === nowH
      ) ?? aqHourIdxs[0];
    curAQI = airQuality.hourly.european_aqi?.[ci];
    curPM10 = airQuality.hourly.pm10?.[ci];
    curPM25 = airQuality.hourly.pm2_5?.[ci];
    curCO = airQuality.hourly.carbon_monoxide?.[ci];
    curCO2 = airQuality.hourly.carbon_dioxide?.[ci];
    curNO2 = airQuality.hourly.nitrogen_dioxide?.[ci];
    curSO2 = airQuality.hourly.sulphur_dioxide?.[ci];
  }

  const aqiLabel = (v) =>
    v <= 50
      ? "Good"
      : v <= 100
      ? "Moderate"
      : v <= 150
      ? "Sensitive"
      : "Unhealthy";

  return (
    <div className="p-4 md:p-6">
      {/* Date + Unit Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <label className="text-sm text-gray-500">Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white"
        />
        <button
          onClick={() => setTempUnit(tempUnit === "C" ? "F" : "C")}
          className="border border-gray-300 rounded-full px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          Switch to °{tempUnit === "C" ? "F" : "C"}
        </button>
      </div>

      {/* Current Conditions */}
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
        Current Conditions
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        <WeatherCard
          title="Temperature"
          value={fmt(current.temperature_2m)}
          sub={`↓ ${fmt(minT)} · ↑ ${fmt(maxT)}`}
          highlight
        />
        <WeatherCard
          title="Humidity"
          value={current.relative_humidity_2m}
          unit="%"
        />
        <WeatherCard
          title="Precipitation"
          value={current.precipitation}
          unit="mm"
          sub={`Probability Max: ${precMax}%`}
        />
        <WeatherCard
          title="UV Index"
          value={uvi ?? "--"}
          sub={
            uvi <= 2
              ? "Low"
              : uvi <= 5
              ? "Moderate"
              : uvi <= 7
              ? "High"
              : "Very High"
          }
        />
        <WeatherCard
          title="Max Wind Speed"
          value={Math.round(windMax)}
          unit="km/h"
          sub={`Current: ${Math.round(current.wind_speed_10m)} km/h`}
        />
        <WeatherCard
          title="Sunrise"
          value={fmtTime(daily.sunrise[dayIdx])}
          sub={`Sunset ${fmtTime(daily.sunset[dayIdx])}`}
        />
        {curAQI !== null && (
          <WeatherCard
            title="Air Quality Index"
            value={Math.round(curAQI)}
            sub={aqiLabel(curAQI)}
          />
        )}
      </div>

      {/* Air Quality Metrics */}
      {airQuality && (
        <>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
            Air Quality Metrics
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {[
              ["PM10", curPM10, "μg/m³"],
              ["PM2.5", curPM25, "μg/m³"],
              ["CO", curCO, "μg/m³"],
              ["CO2", curCO2, "ppm"],
              ["NO₂", curNO2, "μg/m³"],
              ["SO₂", curSO2, "μg/m³"],
            ].map(([label, val, unit]) => (
              <div
                key={label}
                className="bg-gray-50 rounded-xl p-3 border border-gray-100"
              >
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-lg font-medium mt-1">
                  {val !== null && val !== undefined
                    ? Math.round(val)
                    : "--"}{" "}
                  <span className="text-xs text-gray-400">{unit}</span>
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Hourly Charts */}
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
        Hourly Forecast
      </p>
      <HourlyChart
        title={`Temperature (°${tempUnit})`}
        data={makeData(["Temperature"], [hTemp])}
        dataKeys={["Temperature"]}
        colors={["#378ADD"]}
      />
      <HourlyChart
        title="Relative Humidity (%)"
        data={makeData(["Humidity"], [hHum])}
        dataKeys={["Humidity"]}
        colors={["#1D9E75"]}
      />
      <HourlyChart
        title="Precipitation (mm)"
        data={makeData(["Precipitation"], [hPrec])}
        dataKeys={["Precipitation"]}
        colors={["#378ADD"]}
        type="bar"
      />
      <HourlyChart
        title="Visibility (km)"
        data={makeData(["Visibility"], [hVis])}
        dataKeys={["Visibility"]}
        colors={["#BA7517"]}
      />
      <HourlyChart
        title="Wind Speed at 10m (km/h)"
        data={makeData(["Wind"], [hWind])}
        dataKeys={["Wind"]}
        colors={["#888780"]}
      />
      {airQuality && aqHourIdxs.length > 0 && (
        <HourlyChart
          title="PM10 & PM2.5 (μg/m³)"
          data={hrs.map((t, i) => ({
            time: t,
            PM10: aqPM10[i],
            "PM2.5": aqPM25[i],
          }))}
          dataKeys={["PM10", "PM2.5"]}
          colors={["#378ADD", "#D85A30"]}
        />
      )}
    </div>
  );
};

export default CurrentWeather;