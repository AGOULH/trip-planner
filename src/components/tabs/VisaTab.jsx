export default function VisaTab({ visas }) {
  if (!visas?.length) return <p className="muted">لا توجد بيانات تأشيرة</p>

  return (
    <div className="tab-panel">
      <div className="visa-list">
        {visas.map((v, i) => (
          <div className="card visa-card" key={i}>
            <div className="visa-header">
              <h3>{v.nationality}</h3>
              <span className={`badge ${v.required ? 'badge-warn' : 'badge-ok'}`}>
                {v.required ? 'تأشيرة مطلوبة' : 'بدون تأشيرة'}
              </span>
            </div>
            <div className="info-grid">
              <div className="info-box">
                <span className="info-label">نوع التأشيرة</span>
                <span className="info-value">{v.type}</span>
              </div>
              <div className="info-box">
                <span className="info-label">مدة الإصدار</span>
                <span className="info-value">{v.processing_time}</span>
              </div>
              <div className="info-box">
                <span className="info-label">التكلفة التقريبية</span>
                <span className="info-value">{v.cost_estimate}</span>
              </div>
            </div>
            {v.notes && <p className="notes">{v.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
