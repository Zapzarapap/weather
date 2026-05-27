import { useState, useEffect } from 'react';
import { WeatherIcon, WindIcon, RaindropIcon, SunIcon } from '../icons/WeatherIcons';

const DAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

function collectDaytimeCodes(hourly, dateStr) {
  const codes = [];
  for (let i = 0; i < hourly.time.length; i++) {
    const t = hourly.time[i];
    if (t.startsWith(dateStr)) {
      const h = parseInt(t.slice(11, 13), 10);
      if (h >= 6 && h <= 22) {
        codes.push(hourly.weather_code[i]);
      }
    }
  }
  return codes;
}

function getMostFrequentCode(codes) {
  if (!codes || codes.length === 0) return null;
  const freq = {};
  let max = 0, best = codes[0];
  for (const c of codes) {
    freq[c] = (freq[c] || 0) + 1;
    if (freq[c] > max) { max = freq[c]; best = c; }
  }
  return best;
}

export default function WeeklyForecast({ data, onToggleForecast }) {
  if (!data) return null;

  const daily = data.daily;
  const [showAll, setShowAll] = useState(false);
  const daysToShow = showAll ? daily.time.length : Math.min(7, daily.time.length);
  const title = showAll ? '14-Tage Vorhersage' : '7-Tage Vorhersage';

  function handleToggle() {
    const next = !showAll;
    setShowAll(next);
    onToggleForecast(next ? 14 : 7);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll('.weekly-grid animate, .weekly-grid animateTransform, .weekly-grid animateMotion').forEach(el => {
        el.setAttribute('repeatCount', 'indefinite');
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [data, showAll]);

  return (
    <div className="weekly-section">
      <div className="weekly-header">
        <h3 className="section-title">{title}</h3>
        <button className="forecast-toggle" onClick={handleToggle}>
          {showAll ? '7 Tage' : '14 Tage'}
        </button>
      </div>
      <div className="weekly-grid">
        {daily.time.slice(0, daysToShow).map((date, i) => {
          const dayName = DAYS[new Date(date).getDay()];
          const daytimeCodes = data.hourly ? collectDaytimeCodes(data.hourly, date) : [];
          const precipSum = daily.precipitation_sum?.[i] ?? 0;
          const snowfallSum = daily.snowfall_sum?.[i] ?? 0;
          const hasSnow = snowfallSum > 0;
          const precipValue = hasSnow ? snowfallSum : precipSum;
          const hasPrecipInCodes = daytimeCodes.some(c => (c >= 51 && c <= 67) || c >= 80);
          const enrichedCodes = (!hasPrecipInCodes && precipSum > 0 && !hasSnow)
            ? [...daytimeCodes, precipSum > 5 ? 63 : 61]
            : daytimeCodes;
          const hasCodes = enrichedCodes.length > 0;
          const hasSun = enrichedCodes.some(c => c === 0 || c === 1);
          const hasPrecip = enrichedCodes.some(c => c >= 51);
          const useCombined = hasCodes && hasSun && hasPrecip;
          const high = Math.round(daily.temperature_2m_max[i]);
          const low = Math.round(daily.temperature_2m_min[i]);
          const sunshineDuration = daily.sunshine_duration?.[i];
          const sunshineHours = sunshineDuration != null ? Math.round(sunshineDuration / 3600) : 0;
          const wind = daily.wind_speed_10m_max ? Math.round(daily.wind_speed_10m_max[i]) : null;
          const gust = daily.wind_gusts_10m_max ? Math.round(daily.wind_gusts_10m_max[i]) : null;

          return (
            <div key={i} className="weekly-card glass">
              <span className="weekly-day">{dayName}</span>
              <span className="weekly-icon">
                {useCombined ? (
                  <WeatherIcon codes={enrichedCodes} isDay={true} size={56} />
                ) : (
                  <WeatherIcon code={hasCodes ? getMostFrequentCode(enrichedCodes) : daily.weather_code[i]} isDay={true} size={56} />
                )}
              </span>
              <div className="weekly-temps">
                <span className="weekly-high">{high}°</span>
                <span className="weekly-low">{low}°</span>
                {sunshineHours >= 0 && (
                  <span className="weekly-sunshine"><SunIcon size={28} /> {sunshineHours}h</span>
                )}
              </div>
              <div className="weekly-detail">
                {precipValue > 0 && (
                  <span className="weekly-precip">
                    {hasSnow ? `${snowfallSum.toFixed(1)}cm` : <><span className="detail-icon-wrap"><RaindropIcon size={36} /></span> {precipSum.toFixed(1)}mm³</>}
                  </span>
                )}
                {wind > 0 && (
                  <span className="weekly-wind">
                    <span className="detail-icon-wrap"><WindIcon size={22} /></span> {wind}{gust ? `-${gust}` : ''}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
