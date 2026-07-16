/**
 * Skeleton Loader Component
 * Used for loading states to improve perceived performance
 */

const Skeleton = ({
  type = 'text',
  width = '100%',
  height = '1rem',
  count = 1,
  className = '',
}) => {
  if (type === 'card') {
    return (
      <div className={`skeleton-card ${className}`}>
        <div className="skeleton-element skeleton-line skeleton-line-large" />
        <div className="skeleton-element skeleton-line skeleton-line-full" />
        <div className="skeleton-element skeleton-line skeleton-line-full" />
        <div className="skeleton-element skeleton-line skeleton-line-medium" />
      </div>
    );
  }

  if (type === 'avatar') {
    return <div className={`skeleton-element skeleton-avatar ${className}`} />;
  }

  if (type === 'button') {
    return <div className={`skeleton-element skeleton-button ${className}`} style={{ '--skeleton-width': width }} />;
  }

  if (type === 'line') {
    return (
      <div className="skeleton-lines">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="skeleton-element skeleton-line"
            style={{ '--skeleton-width': width, '--skeleton-height': height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`skeleton-element ${className}`}
      style={{ '--skeleton-width': width, '--skeleton-height': height }}
    />
  );
};

export default Skeleton;
