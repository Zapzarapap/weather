import { useState, useRef } from 'react';

export default function SearchBar({ onSearch, onLocate, locating }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimer = useRef(null);

  async function handleInput(e) {
    const val = e.target.value;
    setQuery(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (val.length < 2) { setSuggestions([]); return; }
    debounceTimer.current = setTimeout(async () => {
      try {
        const q = encodeURIComponent(val);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=8`,
          { headers: { 'Accept-Language': 'de', 'User-Agent': 'WeatherApp/1.0' } }
        );
        if (!res.ok) return;
        const data = await res.json();
        const seen = new Map();
        setSuggestions(data.filter(s => {
          const key = `${s.display_name}|${s.type || ''}`;
          if (seen.has(key)) return false;
          seen.set(key, true);
          return true;
        }));
      } catch { setSuggestions([]); }
    }, 300);
  }

  function formatLabel(item) {
    const parts = item.display_name.split(',').map(p => p.trim());
    const name = parts[0];
    return [name, ...parts.slice(1).filter(p => p !== name && isNaN(parseInt(p)))].slice(0, 3).join(', ');
  }

  function selectSuggestion(item) {
    setQuery(item.display_name.split(',')[0]);
    setSuggestions([]);
    onSearch(parseFloat(item.lat), parseFloat(item.lon), item.display_name.split(',')[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (suggestions.length > 0) {
      selectSuggestion(suggestions[0]);
    }
  }

  return (
    <div className="search-wrapper">
      <form className="search-bar glass" onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={handleInput}
          placeholder="Ort suchen..."
          className="search-input"
        />
        <button type="submit" className="search-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        <button
          type="button"
          className={`locate-btn ${locating ? 'spinning' : ''}`}
          onClick={onLocate}
          title="Use my location"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="3"/>
            <line x1="12" y1="2" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="6" y2="12"/>
            <line x1="18" y1="12" x2="22" y2="12"/>
          </svg>
        </button>
      </form>
      {suggestions.length > 0 && (
        <ul className="suggestions glass">
          {suggestions.map((s, i) => (
            <li key={i} onClick={() => selectSuggestion(s)}>
              {formatLabel(s)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
