import { useState } from 'react'
import ApiKeySetup from './components/ApiKeySetup'
import TripForm from './components/TripForm'
import ResultView from './components/ResultView'
import Loader from './components/Loader'
import { generateTripPlan } from './services/claude'

const API_KEY_STORAGE_KEY = 'trip_planner_anthropic_api_key'

function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE_KEY) || '')
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSaveApiKey = (value) => {
    setApiKey(value)
    localStorage.setItem(API_KEY_STORAGE_KEY, value)
  }

  const handleSubmitTrip = async (trip) => {
    setError('')
    setPlan(null)

    if (!apiKey) {
      setError('الرجاء إدخال مفتاح Anthropic API أولًا')
      return
    }

    setLoading(true)
    try {
      const result = await generateTripPlan({ apiKey, trip })
      setPlan(result)
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء إنشاء الخطة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>مخطط الرحلات العائلية</h1>
        <p className="muted">خطّط رحلتك العائلية القادمة بمساعدة الذكاء الاصطناعي</p>
      </header>

      <main className="app-main">
        <ApiKeySetup apiKey={apiKey} onSave={handleSaveApiKey} />
        <TripForm onSubmit={handleSubmitTrip} submitting={loading} />

        {loading && <Loader label="جارٍ إنشاء خطة الرحلة، قد يستغرق ذلك دقيقة..." />}
        {error && <p className="card error-card">{error}</p>}
        {plan && <ResultView plan={plan} />}
      </main>
    </div>
  )
}

export default App
