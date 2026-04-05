# 🌤️ Weather Dashboard

> A production-grade, responsive weather intelligence platform built with ReactJS and the Open-Meteo API. Delivers real-time weather insights, air quality monitoring, and historical climate analysis — all from your browser.

🔗 **Live Demo:** (https://weather-dashboard-seven-sooty.vercel.app)  
📁 **Repository:** (https://github.com/imhr45/weather-dashboard)

---

## ✨ Features

### 📍 Auto Location Detection
- Automatically detects user's location via **browser GPS** on page load
- Reverse geocoding displays city and country name
- Graceful fallback to default coordinates if GPS is denied

### 🌡️ Page 1 — Current Weather & Hourly Forecast
- **Temperature** — Current, Minimum, Maximum with °C / °F toggle
- **Atmospheric** — Precipitation, Relative Humidity, UV Index
- **Sun Cycle** — Sunrise & Sunset times (IST)
- **Wind** — Current & Max Wind Speed, Precipitation Probability
- **Air Quality** — AQI, PM10, PM2.5, CO, CO₂, NO₂, SO₂
- **6 Interactive Hourly Charts:**
  - Temperature (with live °C ↔ °F toggle)
  - Relative Humidity
  - Precipitation
  - Visibility
  - Wind Speed at 10m
  - PM10 & PM2.5 combined

### 📅 Page 2 — Historical Analysis (Up to 2 Years)
- Custom date range selector with 2-year maximum validation
- **5 Historical Charts:**
  - Temperature — Mean, Max, Min trends
  - Sunrise & Sunset times (IST decimal hours)
  - Precipitation totals (bar chart)
  - Max Wind Speed & Dominant Wind Direction
  - PM10 & PM2.5 air quality trends

### 📊 Chart Features
- **Zoom** — Scroll wheel to zoom in/out on any chart
- **Pan** — Click and drag to navigate across time
- **Reset** — One-click zoom reset button on every chart
- **Tooltips** — Hover for precise data values
- **Horizontal Scrolling** — For dense datasets on mobile

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| ReactJS + Vite | Frontend framework & build tool |
| Tailwind CSS v4 | Utility-first responsive styling |
| Chart.js | Interactive data visualizations |
| chartjs-plugin-zoom | Zoom & pan functionality |
| Axios | API data fetching |
| Open-Meteo Forecast API | Real-time weather data |
| Open-Meteo Archive API | Historical weather data |
| Open-Meteo Air Quality API | Air quality & pollutant data |
| Nominatim (OpenStreetMap) | Reverse geocoding |
| Vercel | Deployment & hosting |

---

## 📁 Project Structure
src/
├── components/
│   ├── HourlyChart.jsx      # Reusable Chart.js chart with zoom/pan
│   ├── LocationBar.jsx      # GPS location display with reverse geocoding
│   ├── Navbar.jsx           # Page navigation tabs
│   └── WeatherCard.jsx      # Individual metric display card
│
├── hooks/
│   └── useWeather.js        # Custom hook for weather + AQ data fetching
│
├── pages/
│   ├── CurrentWeather.jsx   # Page 1 — Current conditions & hourly charts
│   └── HistoricalWeather.jsx # Page 2 — Historical date range analysis
│
├── services/
│   └── weatherApi.js        # All Open-Meteo API calls
│
├── utils/
│   └── location.js          # Browser GPS geolocation utility
│
├── App.jsx                  # Root component & page routing
└── main.jsx                 # React entry point
---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Installation
```bash
# Clone the repository
git clone https://github.com/imhr45/weather-dashboard.git

# Navigate to project directory
cd weather-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173]in your browser.

### Build for Production
```bash
npm run build
```

---

## 🌐 API Reference

All data is sourced from the **Open-Meteo API** — free, no API key required.

| API | Endpoint | Usage |
|---|---|---|
| Forecast | `api.open-meteo.com/v1/forecast` | Current & hourly weather |
| Archive | `archive-api.open-meteo.com/v1/archive` | Historical weather data |
| Air Quality | `air-quality-api.open-meteo.com/v1/air-quality` | Pollutants & AQI |

---

## 📱 Responsive Design

- Fully mobile-friendly layout using Tailwind CSS grid
- Charts adapt to screen size with horizontal scroll on small screens
- Touch support for pinch-to-zoom on mobile devices

---

## ⚡ Performance

- Built with **Vite** for fast HMR and optimized production builds
- Parallel API calls using `Promise.all()` for minimum load time
- GPS fallback ensures instant render even without location permission

---

## 📸 Screenshots

### Current Weather & Hourly Forecast
- Real-time weather cards with all metrics
- 6 interactive hourly charts with zoom functionality

### Historical Analysis
- Multi-line temperature trends over custom date ranges
- Daily precipitation bar charts
- Wind speed & direction combined chart

---

## 👨‍💻 Author

**Himanshu Ranjan** 

GitHub: [@imhr45](https://github.com/imhr45)

---