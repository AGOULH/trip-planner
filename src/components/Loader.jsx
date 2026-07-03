export default function Loader({ label }) {
  return (
    <div className="loader">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  )
}
