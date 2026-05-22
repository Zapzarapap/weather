import { useState, useCallback } from 'react';

export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolokalisierung wird von deinem Browser nicht unterstützt.');
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Standortzugriff verweigert. Bitte suche eine Stadt.'
            : 'Standort konnte nicht ermittelt werden.'
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const setManualCoords = useCallback((lat, lon) => {
    setCoords({ lat, lon });
    setError(null);
  }, []);

  return { coords, error, loading, requestLocation, setManualCoords };
}
