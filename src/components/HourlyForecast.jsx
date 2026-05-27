import { getWeatherState } from '../utils/weatherCodes';
import { WeatherIcon, WindIcon, RaindropIcon } from '../icons/WeatherIcons';

export default function HourlyForecast({ data }) {
  if (!data) return null;

  const hourly = data.hourly;
  const utcOffset = data.utc_offset_seconds ?? 0;
  const now = new Date();
  const localNow = new Date(now.getTime() + utcOffset * 1000);
  const currentLocHour = localNow.getUTCHours();
  const times = hourly.time;

  const startIdx = times.findIndex((t) => {
    const h = parseInt(t.slice(11, 13), 10);
    return h >= currentLocHour;
  });

  const items = [];
  const count = 24;
  for (let i = 0; i < count; i++) {
    const idx = (startIdx >= 0 ? startIdx : 0) + i;
    if (idx >= hourly.time.length) break;
    const t = times[idx];
    const h = parseInt(t.slice(11, 13), 10);
    const code = hourly.weather_code[idx];
    const hIsNight = h < 6 || h >= 20;
    const state = getWeatherState(code, hIsNight);
    const temp = Math.round(hourly.temperature_2m[idx]);
    const wind = Math.round(hourly.wind_speed_10m[idx]);
    const gust = hourly.wind_gusts_10m ? Math.round(hourly.wind_gusts_10m[idx]) : null;
    const precip = hourly.precipitation[idx] ?? 0;
    const snowfall = hourly.snowfall?.[idx] ?? 0;
    const hasSnow = snowfall > 0.1;
    const precipValue = hasSnow ? snowfall : precip;
    const precipType = hasSnow ? 'snow' : 'rain';

    items.push({
      time: `${h}:00`,
      code,
      isDay: !hIsNight,
      temp,
      wind,
      gust,
      precipValue,
      precipType,
      state,
      key: idx,
    });
  }

  return (
    <div className="hourly-section">
      <h3 className="section-title">Stündliche Vorhersage</h3>
      <div className="hourly-scroll">
        {items.map((item) => (
          <div key={item.key} className="hourly-card glass">
            <span className="hourly-time">{item.time}</span>
            <span className="hourly-icon">
              <WeatherIcon code={item.code} isDay={item.isDay} size={56} />
            </span>
            <span className="hourly-temp">{item.temp}°</span>
            {item.precipValue > 0 && (
              <span className="hourly-precip">
                <RaindropIcon size={32} />
                {item.precipType === 'snow'
                  ? `${item.precipValue.toFixed(1)}cm`
                  : `${item.precipValue.toFixed(1)}mm³`}
              </span>
            )}
            <span className="hourly-wind"><WindIcon size={21} /> {item.wind}{item.gust ? `-${item.gust}` : ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
