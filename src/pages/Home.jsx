import { useState } from 'react'
import { events } from '../mock/events'
import { programs } from '../mock/programs'
import { orchestras } from '../mock/orchestras'
import { memberships } from '../mock/memberships'
import { EVENT_TYPES_ORDER, EVENT_TYPE_LABELS } from '../utils/eventTypes'
import EventCard from '../components/EventCard'
import ProgramHomeCard from '../components/ProgramHomeCard'

const CURRENT_USER_ID = 1

function Home() {
  const [orchestraFilter, setOrchestraFilter] = useState('')
  const [programFilter, setProgramFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selectedProgramId, setSelectedProgramId] = useState(null)

  const userOrchestraIds = memberships
    .filter((m) => m.user_id === CURRENT_USER_ID)
    .map((m) => m.orchestra_id)

  const userOrchestras = orchestras.filter((o) =>
    userOrchestraIds.includes(o.id)
  )

  const availablePrograms = programs
    .filter((p) => userOrchestraIds.includes(p.orchestra_id))
    .filter((p) =>
      orchestraFilter ? p.orchestra_id === Number(orchestraFilter) : true
    )
    .sort((a, b) => a.orchestra_id - b.orchestra_id)

  const filteredEvents = events
    .filter((event) => {
      const eventProgram = programs.find((p) => p.id === event.program_id)

      // Restricció base: només events d'orquestres on l'usuari és membre
      if (!eventProgram || !userOrchestraIds.includes(eventProgram.orchestra_id)) {
        return false
      }

      if (typeFilter && event.type !== typeFilter) return false
      if (programFilter && event.program_id !== Number(programFilter)) return false
      if (orchestraFilter && eventProgram.orchestra_id !== Number(orchestraFilter)) return false

      return true
    })
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))

  return (
    <div>
      <h1>Next events</h1>

      {/* FILTERS */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <label>
          Orchestra:
          <select
            value={orchestraFilter}
            onChange={(e) => {
              setOrchestraFilter(e.target.value)
              setProgramFilter('')
            }}
          >
            <option value="">All</option>
            {userOrchestras.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Program:
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
          >
            <option value="">All</option>
            {availablePrograms.map((p) => {
              const orchestra = orchestras.find((o) => o.id === p.orchestra_id)
              return (
                <option key={p.id} value={p.id}>
                  {orchestraFilter ? p.name : `${orchestra?.name} · ${p.name}`}
                </option>
              )
            })}
          </select>
        </label>

        <label>
          Type:
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All</option>

            {EVENT_TYPES_ORDER.map((type) => (
              <option key={type} value={type}>
                {EVENT_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* EVENTS */}
      <div>
        {filteredEvents.map((event) => (
          <div key={event.id}>
            <EventCard
              event={event}
              onSelectProgram={(id) => setSelectedProgramId(id ? Number(id) : null)}
            />

            {selectedProgramId === event.program_id && (
              <ProgramHomeCard programId={selectedProgramId} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home