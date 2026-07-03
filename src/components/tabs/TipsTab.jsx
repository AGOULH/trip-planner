export default function TipsTab({ tips }) {
  if (!tips?.length) return <p className="muted">لا توجد نصائح</p>

  return (
    <div className="tab-panel">
      <ul className="tips-list">
        {tips.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>
    </div>
  )
}
