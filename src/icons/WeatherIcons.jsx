import { Icon } from '@iconify/react';
import { getWeatherIcon, getCombinedIcon } from '../utils/weatherCodes';

export function WeatherIcon({ code, codes, isDay = true, size = 48 }) {
  const icon = codes ? getCombinedIcon(codes) : getWeatherIcon(code, isDay);
  return <Icon icon={icon} width={size} height={size} />;
}

export function PrecipitationIcon({ level, type = 'rain', size = 20 }) {
  if (!level || level < 1 || level > 3) return null;
  const icons = {
    rain: ['', 'meteocons:drizzle-fill', 'meteocons:rain-fill', 'meteocons:extreme-rain-fill'],
    snow: ['', 'meteocons:snow-fill', 'meteocons:snow-fill', 'meteocons:extreme-snow-fill'],
  };
  return <Icon icon={icons[type][level]} width={size} height={size} />;
}

export function WindIcon({ size = 16 }) {
  return (
    <span style={{ display: 'inline-flex', filter: 'brightness(0)' }}>
      <Icon icon="meteocons:wind-fill" width={size} height={size} />
    </span>
  );
}

export function SunriseIcon({ size = 18 }) {
  return <Icon icon="meteocons:sunrise-fill" width={size} height={size} />;
}

export function SunsetIcon({ size = 18 }) {
  return <Icon icon="meteocons:sunset-fill" width={size} height={size} />;
}

export function HumidityIcon({ size = 16 }) {
  return <Icon icon="meteocons:humidity-fill" width={size} height={size} />;
}

export function UVIcon({ index, size = 16 }) {
  const level = Math.max(1, Math.min(11, Math.round(index || 0)));
  return <Icon icon={`meteocons:uv-index-${level}-fill`} width={size} height={size} />;
}

export function RaindropIcon({ size = 20 }) {
  return <Icon icon="meteocons:raindrop-fill" width={size} height={size} />;
}

export function SunIcon({ size = 14 }) {
  return <Icon icon="meteocons:clear-day-fill" width={size} height={size} />;
}


