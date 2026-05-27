import { useState, useEffect, useCallback } from 'react';

const CURRENT_PARAMS = 'current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m,surface_pressure,uv_index';

const HOURLY_PARAMS = 'hourly=temperature_2m,weather_code,wind_speed_10m,wind_gusts_10m,precipitation_probability,precipitation,snowfall,direct_radiation';

const DAILY_PARAMS = 'daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_mean,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,sunrise,sunset,sunshine_duration,precipitation_sum,snowfall_sum';

const BASE_PARAMS = `${CURRENT_PARAMS}&${HOURLY_PARAMS}&${DAILY_PARAMS}&timezone=auto`;

async function fetchCurrentData(base) {
  try {
    const res = await fetch(`${base}&${CURRENT_PARAMS}&forecast_days=1&models=best_match&timezone=auto`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.current;
  } catch {
    return null;
  }
}

function mergeHourly(icon, ecmwf, hrs) {
  const merged = { time: icon.time.concat(ecmwf.time.slice(hrs)) };
  for (const key of Object.keys(icon)) {
    if (key !== 'time') {
      merged[key] = icon[key].concat(ecmwf[key].slice(hrs));
    }
  }
  return merged;
}

function mergeDaily(icon, ecmwf, days) {
  const merged = { time: icon.time.concat(ecmwf.time.slice(days)) };
  for (const key of Object.keys(icon)) {
    if (key !== 'time') {
      merged[key] = icon[key].concat(ecmwf[key].slice(days));
    }
  }
  return merged;
}

export function useWeather(lat, lon, forecastDays = 7) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async () => {
    if (lat == null || lon == null) return;
    setLoading(true);
    setError(null);
    try {
      const base = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`;

      if (forecastDays > 7) {
        const [iconRes, ecmwfRes] = await Promise.all([
          fetch(`${base}&${BASE_PARAMS}&forecast_days=7&models=icon_seamless`),
          fetch(`${base}&${BASE_PARAMS}&forecast_days=${forecastDays}&models=ecmwf_ifs025`),
        ]);

        if (!iconRes.ok && !ecmwfRes.ok) {
          throw new Error('Weather data unavailable');
        }

        if (!iconRes.ok) {
          const result = await ecmwfRes.json();
          const uvCurrent = await fetchCurrentData(base);
          if (uvCurrent) result.current = uvCurrent;
          setData(result);
        } else {
          const iconData = await iconRes.json();
          if (!ecmwfRes.ok) {
            const uvCurrent = await fetchCurrentData(base);
            if (uvCurrent) iconData.current = uvCurrent;
            setData(iconData);
          } else {
            const ecmwfData = await ecmwfRes.json();
            const hrs = iconData.hourly.time.length;
            const days = iconData.daily.time.length;
            const result = {
              ...iconData,
              hourly: mergeHourly(iconData.hourly, ecmwfData.hourly, hrs),
              daily: mergeDaily(iconData.daily, ecmwfData.daily, days),
            };
            const uvCurrent = await fetchCurrentData(base);
            if (uvCurrent) result.current = uvCurrent;
            setData(result);
          }
        }
      } else {
        const url = `${base}&${BASE_PARAMS}&forecast_days=${forecastDays}&models=icon_seamless`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather data unavailable');
        const result = await res.json();
        const uvCurrent = await fetchCurrentData(base);
        if (uvCurrent) result.current = uvCurrent;
        setData(result);
      }
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
