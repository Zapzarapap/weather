import L from 'leaflet';
import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Circle } from 'react-leaflet';

const OWM_KEY = '8f1955375428c6dd0e3e3112f43881ab';

function MapUpdater({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lon != null) map.setView([lat, lon], Math.min(map.getZoom() || 11, 13));
  }, [lat, lon, map]);
  return null;
}

function LocationMarker({ lat, lon }) {
  if (lat == null || lon == null) return null;
  return <Circle center={[lat, lon]} radius={500} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.3, weight: 2 }} />;
}

function OWMLayer() {
  const map = useMap();
  useEffect(() => {
    const layer = L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=' + OWM_KEY, {
      opacity: 0.7, attribution: '© OpenWeatherMap',
    });
    layer.addTo(map);
    return () => map.removeLayer(layer);
  }, [map]);
  return null;
}

export default function RadarMap({ lat, lon }) {
  return (
    <div className="radar-section">
      <h3 className="section-title">Regenradar</h3>
      <div className="radar-map-wrapper">
        <MapContainer center={[lat, lon]} zoom={Math.min(13, lat ? 11 : 8)} className="radar-map" zoomControl={true} scrollWheelZoom={true} maxZoom={13}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <OWMLayer />
          <MapUpdater lat={lat} lon={lon} />
          <LocationMarker lat={lat} lon={lon} />
        </MapContainer>
      </div>
      <div className="radar-attribution">© OpenWeatherMap</div>
    </div>
  );
}
