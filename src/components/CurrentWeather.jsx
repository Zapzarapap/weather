import { getWeatherState } from '../utils/weatherCodes';
import { WeatherIcon, WindIcon, UVIcon, SunriseIcon, SunsetIcon, RaindropIcon } from '../icons/WeatherIcons';

export default function CurrentWeather({ data, cityName }) {
  if (!data) return null;

  const current = data.current;
  const daily = data.daily;
  const hourly = data.hourly;
  const h = new Date().getHours();
  const isNight = h < 6 || h >= 20;
  const state = getWeatherState(current.weather_code, isNight);

  const utcOffset = data.utc_offset_seconds ?? 0;
  const now = new Date();
  const localNow = new Date(now.getTime() + utcOffset * 1000);
  const currentLocHour = localNow.getUTCHours();
  const currentIdx = hourly.time.findIndex(t => parseInt(t.slice(11, 13), 10) >= currentLocHour);
  const precipMm = hourly.precipitation?.[currentIdx] ?? 0;
  const snowfallCm = hourly.snowfall?.[currentIdx] ?? 0;
  const hasSnow = snowfallCm > 0.1;
  const precipValue = hasSnow ? snowfallCm : precipMm;
  const precipType = hasSnow ? 'snow' : 'rain';

  const sunrise = daily?.sunrise?.[0]?.slice(11, 16) || null;
  const sunset = daily?.sunset?.[0]?.slice(11, 16) || null;
  const uv = current.uv_index;
  const wind = Math.round(current.wind_speed_10m);
  const gust = current.wind_gusts_10m ? Math.round(current.wind_gusts_10m) : null;

  return (
    <div className="current-weather glass">
      <div className="current-main">
        <span className="current-icon">
          <WeatherIcon code={current.weather_code} isDay={!isNight} size={96} />
        </span>
        <div className="current-temps">
          <span className="current-temp">{Math.round(current.temperature_2m)}°</span>
          <span className="current-feels">
            Gefühlt {Math.round(current.apparent_temperature)}°
          </span>
        </div>
        <div className="current-quick">
          {uv != null && (
            <span className="quick-item">
              <UVIcon index={uv} size={48} />
            </span>
          )}
        </div>
      </div>
      <div className="current-info">
        <h2 className="city-name">{cityName || 'Aktueller Standort'}</h2>
        <div className="condition-row">
          <p className="condition-label">{state.label}</p>
        </div>
      </div>
      <div className="current-details-grid">
        <span className="detail-item">
          <WindIcon size={48} /> {wind}{gust ? `-${gust}` : ''}
        </span>
        <span className="detail-item detail-humidity">
          <RaindropIcon size={48} /> <span>{current.relative_humidity_2m}%</span>
        </span>
        {sunrise && (
          <span className="detail-item">
            <SunriseIcon size={48} /> {sunrise}
          </span>
        )}
        {sunset && (
          <span className="detail-item">
            <SunsetIcon size={48} /> {sunset}
          </span>
        )}
        {precipValue > 0 && (
          <span className="detail-item">
            <RaindropIcon size={24} />
            {precipType === 'snow'
              ? `${snowfallCm.toFixed(1)} cm`
              : `${precipMm.toFixed(1)} mm`}
          </span>
        )}
      </div>
    </div>
  );
}
