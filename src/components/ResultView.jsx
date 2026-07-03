import { useState } from 'react'
import FlightsTab from './tabs/FlightsTab'
import VisaTab from './tabs/VisaTab'
import AccommodationTab from './tabs/AccommodationTab'
import ItineraryTab from './tabs/ItineraryTab'
import BudgetTab from './tabs/BudgetTab'
import TipsTab from './tabs/TipsTab'

const TABS = [
  { id: 'flights', label: 'الطيران' },
  { id: 'visa', label: 'التأشيرة' },
  { id: 'accommodation', label: 'السكن' },
  { id: 'itinerary', label: 'البرنامج اليومي' },
  { id: 'budget', label: 'الميزانية' },
  { id: 'tips', label: 'نصائح' },
]

export default function ResultView({ plan }) {
  const [activeTab, setActiveTab] = useState('flights')

  return (
    <div className="card result-card">
      <div className="tabs-header">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'flights' && <FlightsTab flights={plan.flights} />}
      {activeTab === 'visa' && <VisaTab visas={plan.visas} />}
      {activeTab === 'accommodation' && <AccommodationTab accommodation={plan.accommodation} />}
      {activeTab === 'itinerary' && <ItineraryTab itinerary={plan.itinerary} />}
      {activeTab === 'budget' && <BudgetTab budget={plan.budget} />}
      {activeTab === 'tips' && <TipsTab tips={plan.tips} />}
    </div>
  )
}
