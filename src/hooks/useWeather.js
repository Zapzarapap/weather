import { useState, useEffect, useCallback } from 'react';

export function useWeather(lat, lon, forecastDays = 7) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async () => {
    if (lat == null || lon == null) return;
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m,surface_pressure,uv_index&hourly=temperature_2m,weather_code,wind_speed_10m,wind_gusts_10m,precipitation_probability,precipitation,snowfall,direct_radiation&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_mean,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,sunrise,sunset,precipitation_sum,snowfall_sum&forecast_days=${forecastDays}&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather data unavailable');
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [lat, lon, forecastDays]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { data, loading, error, refetch: fetchWeather };
}
