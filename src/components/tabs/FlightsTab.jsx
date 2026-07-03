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
          <span className="info-label">نوع الرحلة</span>
          <span className="info-value">
            {flights.flight_type}
            {flights.flight_type === 'مباشرة' && <span className="badge badge-ok">بدون توقف</span>}
          </span>
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

      {flights.flight_type === 'غير مباشرة' && flights.stopover_notes && (
        <p className="notes">
          <strong>تفاصيل التوقف: </strong>
          {flights.stopover_notes}
        </p>
      )}

      {flights.notes && <p className="notes">{flights.notes}</p>}

      {flights.example_options?.length > 0 && (
        <div className="example-flights">
          <h3>أمثلة توضيحية تقريبية</h3>
          <p className="notes disclaimer">
            هذه أسعار ومدد تقريبية لإعطاء فكرة عامة فقط، وليست عروض حجز حقيقية — تحقق دائمًا من السعر
            والمواعيد الفعلية عبر رابط Google Flights أدناه.
          </p>
          <ul className="example-flights-list">
            {flights.example_options.map((option, i) => (
              <li key={i} className="example-flight-item">
                <span className="example-flight-airline">{option.airline}</span>
                <span className="muted">{option.approx_duration}</span>
                <span className="example-flight-price">{option.approx_price_per_adult}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {flights.google_flights_url && (
        <a className="btn-primary link-btn" href={flights.google_flights_url} target="_blank" rel="noreferrer">
          بحث الرحلات على Google Flights
        </a>
      )}
    </div>
  )
}
