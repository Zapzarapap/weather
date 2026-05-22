const weatherStates = {
  sunny: { label: 'Sonnig', bg: 'sunny' },
  clear: { label: 'Klar', bg: 'night' },
  partlyCloudy: { label: 'Teilweise bewölkt', bg: 'sunny' },
  cloudy: { label: 'Bewölkt', bg: 'cloudy' },
  overcast: { label: 'Bedeckt', bg: 'cloudy' },
  fog: { label: 'Neblig', bg: 'cloudy' },
  drizzle: { label: 'Nieselregen', bg: 'rain' },
  rain: { label: 'Regen', bg: 'rain' },
  heavyRain: { label: 'Starker Regen', bg: 'rain' },
  freezingRain: { label: 'Eisregen', bg: 'rain' },
  snow: { label: 'Schnee', bg: 'rain' },
  heavySnow: { label: 'Starker Schneefall', bg: 'rain' },
  thunderstorm: { label: 'Gewitter', bg: 'thunderstorm' },
  hail: { label: 'Hagel', bg: 'thunderstorm' },
};

export function getWeatherState(code, isNight = false) {
  switch (true) {
    case code === 0:
      return isNight ? weatherStates.clear : weatherStates.sunny;
    case code <= 2:
      return weatherStates.partlyCloudy;
    case code === 3:
      return weatherStates.overcast;
    case code >= 45 && code <= 48:
      return weatherStates.fog;
    case (code >= 51 && code <= 55):
      return weatherStates.drizzle;
    case (code >= 56 && code <= 57):
      return weatherStates.freezingRain;
    case (code >= 61 && code <= 65):
      return code >= 63 ? weatherStates.heavyRain : weatherStates.rain;
    case (code >= 66 && code <= 67):
      return weatherStates.freezingRain;
    case (code >= 71 && code <= 75):
      return code >= 73 ? weatherStates.heavySnow : weatherStates.snow;
    case code === 77:
      return weatherStates.snow;
    case (code >= 80 && code <= 82):
      return weatherStates.heavyRain;
    case (code >= 85 && code <= 86):
      return weatherStates.heavySnow;
    case code >= 95:
      return weatherStates.thunderstorm;
    default:
      return weatherStates.sunny;
  }
}

export function getWeatherIcon(code, isDay = true) {
  const icons = {
    0:  isDay ? 'meteocons:clear-day-fill' : 'meteocons:clear-night-fill',
    1:  isDay ? 'meteocons:partly-cloudy-day-fill' : 'meteocons:partly-cloudy-night-fill',
    2:  isDay ? 'meteocons:partly-cloudy-day-fill' : 'meteocons:partly-cloudy-night-fill',
    3:  isDay ? 'meteocons:overcast-day-fill' : 'meteocons:overcast-night-fill',
    45: isDay ? 'meteocons:fog-day-fill' : 'meteocons:fog-night-fill',
    48: isDay ? 'meteocons:fog-day-fill' : 'meteocons:fog-night-fill',
    51: 'meteocons:drizzle-fill',
    53: 'meteocons:drizzle-fill',
    55: 'meteocons:drizzle-fill',
    56: 'meteocons:sleet-fill',
    57: 'meteocons:sleet-fill',
    61: 'meteocons:rain-fill',
    63: 'meteocons:rain-fill',
    65: 'meteocons:extreme-rain-fill',
    66: 'meteocons:sleet-fill',
    67: 'meteocons:sleet-fill',
    71: 'meteocons:snow-fill',
    73: 'meteocons:snow-fill',
    75: 'meteocons:extreme-snow-fill',
    77: 'meteocons:snow-fill',
    80: 'meteocons:rain-fill',
    81: 'meteocons:rain-fill',
    82: 'meteocons:extreme-rain-fill',
    85: 'meteocons:snow-fill',
    86: 'meteocons:extreme-snow-fill',
    95: isDay ? 'meteocons:thunderstorms-day-fill' : 'meteocons:thunderstorms-night-fill',
    96: isDay ? 'meteocons:thunderstorms-day-extreme-fill' : 'meteocons:thunderstorms-night-extreme-fill',
    99: isDay ? 'meteocons:thunderstorms-day-extreme-fill' : 'meteocons:thunderstorms-night-extreme-fill',
  };
  return icons[code] ?? 'meteocons:not-available-fill';
}

export function getCombinedIcon(codes) {
  if (!codes || codes.length === 0) return 'meteocons:not-available-fill';

  const has = {
    thunderstorm: codes.some(c => c >= 95),
    snow: codes.some(c => (c >= 71 && c <= 77) || (c >= 85 && c <= 86)),
    sleet: codes.some(c => (c >= 56 && c <= 57) || (c >= 66 && c <= 67)),
    rain: codes.some(c => (c >= 61 && c <= 65) || (c >= 80 && c <= 82)),
    drizzle: codes.some(c => c >= 51 && c <= 55),
    fog: codes.some(c => c === 45 || c === 48),
    clear: codes.some(c => c === 0),
    partlyCloudy: codes.some(c => c === 1 || c === 2),
    overcast: codes.some(c => c === 3),
  };

  const hasSun = has.clear || has.partlyCloudy;
  const prefix = has.overcast && !hasSun ? 'overcast-day' : 'partly-cloudy-day';

  if (has.thunderstorm) {
    if (has.snow) {
      if (has.overcast) return 'meteocons:thunderstorms-day-overcast-snow-fill';
      return 'meteocons:thunderstorms-day-snow-fill';
    }
    if (has.overcast) return 'meteocons:thunderstorms-day-overcast-fill';
    if (has.rain || has.drizzle) return 'meteocons:thunderstorms-day-extreme-fill';
    return 'meteocons:thunderstorms-day-fill';
  }

  if (has.snow) return `meteocons:${prefix}-snow-fill`;
  if (has.sleet) return `meteocons:${prefix}-sleet-fill`;
  if (has.rain) return `meteocons:${prefix}-rain-fill`;
  if (has.drizzle) return `meteocons:${prefix}-drizzle-fill`;

  if (has.fog) {
    if (hasSun) return 'meteocons:fog-day-fill';
    return 'meteocons:fog-fill';
  }

  if (has.overcast && hasSun) return 'meteocons:partly-cloudy-day-fill';
  if (has.overcast) return 'meteocons:overcast-day-fill';
  if (has.partlyCloudy) return 'meteocons:partly-cloudy-day-fill';
  if (has.clear) return 'meteocons:clear-day-fill';

  return 'meteocons:not-available-fill';
}
