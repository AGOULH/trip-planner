export default function FlightsTab({ flights }) {
  if (!flights) return null
  return (
    <div className="tab-panel">
      <div className="info-grid">
        <div className="info-box">
          <span className="info-label">مطار الانطلاق</span>
          <span className="info-value">{flights.from_airport_name}</span>
        </div>
        <div className="info-box">
          <span className="info-label">مطار الوجهة</span>
          <span className="info-value">{flights.to_airport_name}</span>
        </div>
        <div className="info-box">
          <span className="info-label">المسافة إلى مركز المدينة</span>
          <span className="info-value">{flights.distance_to_center_km} كم</span>
        </div>
        <div className="info-box">
          <span className="info-label">مدة التنقل إلى المركز</span>
          <span className="info-value">{flights.duration_to_center_minutes} دقيقة</span>
        </div>
      </div>

      {flights.notes && <p className="notes">{flights.notes}</p>}

      {flights.google_flights_url && (
        <a className="btn-primary link-btn" href={flights.google_flights_url} target="_blank" rel="noreferrer">
          بحث الرحلات على Google Flights
        </a>
      )}
    </div>
  )
}
