import { useEffect, useState } from "react";
import { fetchWeather, fetchAirQuality } from "../services/weatherApi";
import { getUserLocation } from "../utils/location";

const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const loc = await getUserLocation();
        setLocation(loc);
        const [wx, aq] = await Promise.all([
          fetchWeather(loc.latitude, loc.longitude),
          fetchAirQuality(loc.latitude, loc.longitude),
        ]);
        setWeather(wx);
        setAirQuality(aq);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { weather, airQuality, location, loading, error };
};

export default useWeather;