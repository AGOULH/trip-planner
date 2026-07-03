export default function AccommodationTab({ accommodation }) {
  if (!accommodation) return null

  return (
    <div className="tab-panel">
      {accommodation.map_url && (
        <a className="btn-secondary link-btn" href={accommodation.map_url} target="_blank" rel="noreferrer">
          عرض أفضل مناطق الإقامة على الخريطة
        </a>
      )}

      <div className="accommodation-grid">
        {accommodation.options?.map((opt, i) => (
          <div className="card accommodation-card" key={i}>
            <span className="badge badge-category">{opt.category}</span>
            <h3>{opt.name}</h3>
            <p className="muted">{opt.area}</p>
            <p className="price">{opt.price_per_night}</p>
            <p className="notes">{opt.description}</p>
            {opt.map_url && (
              <a className="btn-primary link-btn" href={opt.map_url} target="_blank" rel="noreferrer">
                عرض على الخريطة
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
