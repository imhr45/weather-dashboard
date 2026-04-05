import { useEffect, useState } from "react";

const LocationBar = ({ location }) => {
  const [cityName, setCityName] = useState("Detecting location...");

  useEffect(() => {
    if (!location) return;
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`
    )
      .then((r) => r.json())
      .then((data) => {
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.county ||
          "Your Location";
        const country = data.address.country_code?.toUpperCase() || "";
        setCityName(`${city}, ${country}`);
      })
      .catch(() => setCityName("Your Location"));
  }, [location]);

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-2 flex items-center gap-2 text-sm text-gray-500">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="10" r="3" />
        <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 14 8 14s8-8.75 8-14a8 8 0 0 0-8-8z" />
      </svg>
      <span className="font-medium text-gray-800">{cityName}</span>
      {location && (
        <span className="text-gray-400 text-xs">
          ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
        </span>
      )}
    </div>
  );
};

export default LocationBar;