import axios from "axios";

const WX_BASE = "https://api.open-meteo.com/v1/forecast";
const AQ_BASE = "https://air-quality-api.open-meteo.com/v1/air-quality";

export const fetchWeather = async (lat, lon) => {
  const res = await axios.get(WX_BASE, {
    params: {
      latitude: lat,
      longitude: lon,
      daily: "temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max",
      hourly: "temperature_2m,relative_humidity_2m,precipitation_probability,visibility,wind_speed_10m,precipitation",
      current: "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation",
      timezone: "auto",
      past_days: 7,
      forecast_days: 7,
    },
  });
  return res.data;
};

export const fetchAirQuality = async (lat, lon) => {
  const res = await axios.get(AQ_BASE, {
    params: {
      latitude: lat,
      longitude: lon,
      hourly: "pm10,pm2_5,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide,european_aqi",
      timezone: "auto",
      past_days: 7,
      forecast_days: 7,
    },
  });
  return res.data;
};

export const fetchHistorical = async (lat, lon, startDate, endDate) => {
  const [wxRes, aqRes] = await Promise.all([
    axios.get("https://archive-api.open-meteo.com/v1/archive", {
      params: {
        latitude: lat,
        longitude: lon,
        start_date: startDate,
        end_date: endDate,
        daily: "temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant",
        timezone: "auto",
      },
    }),
    axios.get(AQ_BASE, {
      params: {
        latitude: lat,
        longitude: lon,
        start_date: startDate,
        end_date: endDate,
        daily: "pm10_mean,pm2_5_mean",
      },
    }).catch(() => null),
  ]);
  return { wx: wxRes.data, aq: aqRes?.data || null };
};