export default function ErrorCard({ message, onRetry }) {
  return (
    <div className="error-card glass">
      <span className="error-message">{message}</span>
      {onRetry && (
        <button className="retry-btn" onClick={onRetry}>
Erneut versuchen
        </button>
      )}
    </div>
  );
}
