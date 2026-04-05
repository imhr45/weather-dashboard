const WeatherCard = ({ title, value, unit, sub, highlight }) => {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"}`}>
      <p className="text-xs text-gray-500 mb-1">{title}</p>
      <p className={`text-2xl font-medium ${highlight ? "text-blue-700" : "text-gray-900"}`}>
        {value}
        {unit && <span className="text-sm text-gray-400 ml-1">{unit}</span>}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
};

export default WeatherCard;