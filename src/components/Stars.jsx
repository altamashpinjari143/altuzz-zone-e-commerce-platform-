export default function Stars({ value, count }) {
  const full = Math.round(value);
  return (
    <span className="stars" aria-label={value.toFixed(1) + " out of 5 stars"}>
      {"★".repeat(full)}
      <span className="dim">{"★".repeat(5 - full)}</span>
      {count !== undefined && <small> {value.toFixed(1)} ({count})</small>}
    </span>
  );
}
