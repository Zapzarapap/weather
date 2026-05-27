import { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import RadarMap from './components/RadarMap';
import WeeklyForecast from './components/WeeklyForecast';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorCard from './components/ErrorCard';
import { useGeolocation } from './hooks/useGeolocation';
import { useWeather } from './hooks/useWeather';
import { getWeatherState } from './utils/weatherCodes';
import { getTheme } from './utils/backgroundTheme';

export default function App() {
  const { coords, error: geoError, loading: geoLoading, requestLocation, setManualCoords } = useGeolocation();
  const [forecastDays, setForecastDays] = useState(7);
  const { data: weather, loading: weatherLoading, error: weatherError, refetch } = useWeather(
    coords?.lat,
    coords?.lon,
    forecastDays
  );
  const [cityName, setCityName] = useState('');
  const [animate, setAnimate] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    setSearched(false);
    requestLocation();
  }, []);

  useEffect(() => {
    if (coords && !searched) {
      reverseGeocode(coords.lat, coords.lon);
    }
  }, [coords, searched]);

  useEffect(() => {
    setAnimate(true);
  }, [weather]);

  const reverseGeocode = useCallback(async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        const name =
          data.address?.suburb ||
          data.address?.neighbourhood ||
          data.address?.city_district ||
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.county ||
          data.display_name?.split(',')[0] ||
          'Current Location';
        setCityName(name);
      }
    } catch {
      setCityName('Current Location');
    }
  }, []);

  function handleSearch(lat, lon, name) {
    setSearched(true);
    setCityName(name);
    setManualCoords(lat, lon);
  }

  function handleLocate() {
    setSearched(false);
    requestLocation();
  }

  function handleToggleForecast(days) {
    setForecastDays(days);
  }

  const isNight = (() => {
    if (!weather) return false;
    const h = new Date().getHours();
    return h < 6 || h >= 20;
  })();

  const weatherBg = weather ? getWeatherState(weather.current.weather_code, false).bg : 'sunny';
  const theme = getTheme(weatherBg, isNight);

  const loading = geoLoading || (coords && weatherLoading && !weather);
  const error = geoError || weatherError;

  if (loading && !weather) {
    return (
      <div className="app" style={{ background: theme.gradient }}>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="app" style={{ background: theme.gradient }}>
      <div className="app-content">
        <SearchBar
          onSearch={handleSearch}
          onLocate={handleLocate}
          locating={geoLoading}
        />

        {error && !weather && (
          <ErrorCard message={error} onRetry={geoError ? requestLocation : refetch} />
        )}

        {error && weather && (
          <ErrorCard message={error} onRetry={refetch} />
        )}

        {weather && (
          <>
            <div className={`fade-section ${animate ? 'visible' : ''}`}>
              <CurrentWeather data={weather} cityName={cityName} />
            </div>
            <div className={`fade-section ${animate ? 'visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
              <HourlyForecast data={weather} />
            </div>
            <div className={`fade-section ${animate ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
              <WeeklyForecast data={weather} onToggleForecast={handleToggleForecast} />
            </div>
            <div className={`fade-section ${animate ? 'visible' : ''}`} style={{ transitionDelay: '0.3s' }}>
              <RadarMap lat={coords.lat} lon={coords.lon} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
