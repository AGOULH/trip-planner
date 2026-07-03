import { useState } from 'react'
import { DESTINATIONS } from '../data/destinations'
import { NATIONALITIES } from '../data/nationalities'

const emptyAdult = () => ({ id: crypto.randomUUID(), nationality: NATIONALITIES[0], customNationality: '' })
const emptyChild = () => ({ id: crypto.randomUUID(), age: 5 })

export default function TripForm({ onSubmit, submitting }) {
  const [departureCity, setDepartureCity] = useState('')
  const [destinationId, setDestinationId] = useState(DESTINATIONS[0].id)
  const [travelDate, setTravelDate] = useState('')
  const [numberOfDays, setNumberOfDays] = useState(5)
  const [adults, setAdults] = useState([emptyAdult()])
  const [children, setChildren] = useState([])
  const [formError, setFormError] = useState('')

  const updateAdult = (id, patch) => {
    setAdults((list) => list.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  }
  const updateChild = (id, patch) => {
    setChildren((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!departureCity.trim()) {
      setFormError('الرجاء إدخال مدينة المغادرة')
      return
    }
    if (!travelDate) {
      setFormError('الرجاء اختيار تاريخ السفر')
      return
    }
    if (adults.length === 0) {
      setFormError('يجب إضافة بالغ واحد على الأقل')
      return
    }
    setFormError('')

    const destination = DESTINATIONS.find((d) => d.id === destinationId)
    onSubmit({
      departureCity: departureCity.trim(),
      destinationCity: destination.city,
      destinationCountry: destination.country,
      destinationAirportCode: destination.airportCode,
      destinationAirportName: destination.airportName,
      travelDate,
      numberOfDays: Number(numberOfDays),
      adults: adults.map((a) => ({
        nationality: a.nationality === 'أخرى' ? (a.customNationality.trim() || 'غير محددة') : a.nationality,
      })),
      children: children.map((c) => ({ age: Number(c.age) })),
    })
  }

  return (
    <form className="card trip-form" onSubmit={handleSubmit}>
      <h2>تفاصيل الرحلة</h2>

      <div className="form-grid">
        <label>
          مدينة المغادرة
          <input
            type="text"
            placeholder="مثال: الرياض"
            value={departureCity}
            onChange={(e) => setDepartureCity(e.target.value)}
          />
        </label>

        <label>
          الوجهة السياحية
          <select value={destinationId} onChange={(e) => setDestinationId(e.target.value)}>
            {DESTINATIONS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.city} - {d.country}
              </option>
            ))}
          </select>
        </label>

        <label>
          تاريخ السفر
          <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} />
        </label>

        <label>
          عدد الأيام
          <input
            type="number"
            min="1"
            max="30"
            value={numberOfDays}
            onChange={(e) => setNumberOfDays(e.target.value)}
          />
        </label>
      </div>

      <fieldset className="people-fieldset">
        <legend>البالغون</legend>
        {adults.map((adult, index) => (
          <div className="person-row" key={adult.id}>
            <span className="person-index">{index + 1}</span>
            <select
              value={adult.nationality}
              onChange={(e) => updateAdult(adult.id, { nationality: e.target.value })}
            >
              {NATIONALITIES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            {adult.nationality === 'أخرى' && (
              <input
                type="text"
                placeholder="اكتب الجنسية"
                value={adult.customNationality}
                onChange={(e) => updateAdult(adult.id, { customNationality: e.target.value })}
              />
            )}
            <button
              type="button"
              className="btn-remove"
              onClick={() => setAdults((list) => list.filter((a) => a.id !== adult.id))}
              disabled={adults.length === 1}
              title="حذف"
            >
              ×
            </button>
          </div>
        ))}
        <button type="button" className="btn-add" onClick={() => setAdults((list) => [...list, emptyAdult()])}>
          + إضافة بالغ
        </button>
      </fieldset>

      <fieldset className="people-fieldset">
        <legend>الأطفال</legend>
        {children.map((child, index) => (
          <div className="person-row" key={child.id}>
            <span className="person-index">{index + 1}</span>
            <label className="inline-label">
              العمر
              <input
                type="number"
                min="0"
                max="17"
                value={child.age}
                onChange={(e) => updateChild(child.id, { age: e.target.value })}
              />
            </label>
            <button
              type="button"
              className="btn-remove"
              onClick={() => setChildren((list) => list.filter((c) => c.id !== child.id))}
              title="حذف"
            >
              ×
            </button>
          </div>
        ))}
        {children.length === 0 && <p className="muted">لا يوجد أطفال في هذه الرحلة</p>}
        <button type="button" className="btn-add" onClick={() => setChildren((list) => [...list, emptyChild()])}>
          + إضافة طفل
        </button>
      </fieldset>

      {formError && <p className="error-text">{formError}</p>}

      <button type="submit" className="btn-primary btn-submit" disabled={submitting}>
        {submitting ? 'جارٍ إنشاء الخطة...' : 'إنشاء خطة الرحلة'}
      </button>
    </form>
  )
}
