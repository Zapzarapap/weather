const themes = {
  sunny: {
    gradient: 'linear-gradient(180deg, #4a90d9 0%, #87ceeb 40%, #b8d4f0 70%, #e8f0f8 100%)',
    cardBg: 'rgba(255, 255, 255, 0.15)',
    textColor: '#1a2634',
    accentColor: '#2d6db5',
  },
  cloudy: {
    gradient: 'linear-gradient(180deg, #6b7b8d 0%, #8fa3b5 30%, #b0c4d0 60%, #d0dce5 100%)',
    cardBg: 'rgba(255, 255, 255, 0.12)',
    textColor: '#1a2634',
    accentColor: '#5a6b7a',
  },
  rain: {
    gradient: 'linear-gradient(180deg, #2c3e50 0%, #4a5f73 30%, #6b8096 60%, #8fa8b8 100%)',
    cardBg: 'rgba(255, 255, 255, 0.10)',
    textColor: '#e8edf2',
    accentColor: '#7fa8c9',
  },
  thunderstorm: {
    gradient: 'linear-gradient(180deg, #1a1a2e 0%, #2d2d4a 25%, #3a2a4a 50%, #4a3a5a 75%, #5a4a6a 100%)',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#e8e0f0',
    accentColor: '#8b7ac9',
  },
  night: {
    gradient: 'linear-gradient(180deg, #0a0e1a 0%, #0f1a2e 30%, #1a2a45 60%, #2a3a55 100%)',
    cardBg: 'rgba(255, 255, 255, 0.06)',
    textColor: '#c8d8e8',
    accentColor: '#4a7aaa',
  },
};

export function getTheme(weatherBgKey, isNight) {
  if (isNight && weatherBgKey === 'sunny') return themes.night;
  return themes[weatherBgKey] || themes.sunny;
}
