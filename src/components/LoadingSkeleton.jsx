export default function LoadingSkeleton() {
  return (
    <div className="skeleton-container">
      <div className="skeleton search-skeleton" />
      <div className="skeleton current-skeleton" />
      <div className="skeleton hourly-skeleton" />
      <div className="skeleton radar-skeleton" />
      <div className="skeleton weekly-skeleton" />
    </div>
  );
}
