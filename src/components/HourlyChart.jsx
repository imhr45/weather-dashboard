import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(...registerables, zoomPlugin);

const HourlyChart = ({ data, dataKeys, colors, type = "line", title }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data?.length) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const labels = data.map((d) => d.time);

    const datasets = dataKeys.map((key, i) => ({
      label: key,
      data: data.map((d) => d[key] ?? null),
      backgroundColor:
        type === "bar"
          ? (colors?.[i] || "#378ADD") + "99"
          : "transparent",
      borderColor: colors?.[i] || "#378ADD",
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 0,
      borderRadius: type === "bar" ? 3 : undefined,
    }));

    chartRef.current = new Chart(canvasRef.current, {
      type,
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            display: dataKeys.length > 1,
            position: "bottom",
            labels: { boxWidth: 12, font: { size: 12 } },
          },
          tooltip: { enabled: true },
          zoom: {
            limits: {
              x: { min: "original", max: "original" },
            },
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: true },
              mode: "x",
            },
            pan: {
              enabled: true,
              mode: "x",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              font: { size: 11 },
              color: "#999",
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 12,
            },
            grid: { display: false },
          },
          y: {
            beginAtZero: false,
            ticks: { font: { size: 11 }, color: "#999" },
            grid: { color: "rgba(0,0,0,0.05)" },
          },
        },
      },
    });

    setTimeout(() => chartRef.current?.resetZoom(), 0);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data, dataKeys, colors, type]);

  const resetZoom = () => chartRef.current?.resetZoom();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <button
          onClick={resetZoom}
          className="text-xs text-gray-400 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50"
        >
          Reset zoom
        </button>
      </div>
      <p className="text-xs text-gray-400 mb-3">
        Scroll to zoom · Drag to pan
      </p>
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 600, height: 220 }}>
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
};

export default HourlyChart;