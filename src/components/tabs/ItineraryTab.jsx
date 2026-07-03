const TYPE_LABEL = {
  'معلم': '🏛️',
  'مطعم': '🍽️',
  'تسوق': '🛍️',
  'نقل': '🚕',
}

export default function ItineraryTab({ itinerary }) {
  if (!itinerary?.length) return <p className="muted">لا يوجد برنامج يومي</p>

  return (
    <div className="tab-panel itinerary">
      {itinerary.map((day) => (
        <div className="card day-card" key={day.day}>
          <div className="day-header">
            <h3>
              اليوم {day.day} — {day.title}
            </h3>
            <span className="day-date">{day.date}</span>
          </div>
          {day.transport && (
            <p className="transport-line">
              <strong>وسيلة النقل: </strong>
              {day.transport}
            </p>
          )}

          <ul className="activity-list">
            {day.activities?.map((act, i) => (
              <li className="activity-item" key={i}>
                <span className="activity-icon">{TYPE_LABEL[act.type] || '📍'}</span>
                <div className="activity-body">
                  <div className="activity-title">
                    <span className="activity-time">{act.time}</span>
                    <span>{act.name}</span>
                    {act.type === 'مطعم' && act.halal && <span className="badge badge-ok">حلال</span>}
                  </div>
                  <p className="notes">{act.description}</p>
                  {act.google_maps_url && (
                    <a href={act.google_maps_url} target="_blank" rel="noreferrer" className="map-link">
                      عرض على خرائط جوجل ←
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
