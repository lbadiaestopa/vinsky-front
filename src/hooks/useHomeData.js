import { useEffect, useState } from 'react'
import { getOrchestras } from '../services/orchestraService'
import { getPrograms } from '../services/programService'
import { getEvents } from '../services/eventService'
import client from '../api/client'

export function useHomeData() {
    const [orchestrasData, setOrchestrasData] = useState([])
    const [programsData, setProgramsData] = useState([])
    const [eventsData, setEventsData] = useState([])
    const [adminOrchestraIds, setAdminOrchestraIds] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const membershipsRes = await client.get('/memberships')
            const memberships =
                membershipsRes.data.data ?? membershipsRes.data

            setAdminOrchestraIds(
                memberships
                    .filter((m) => m.role === 'admin')
                    .map((m) => m.orchestra.id)
            )

            try {
                const orchestras = await getOrchestras()
                setOrchestrasData(orchestras)

                const programsArrays = await Promise.all(
                    orchestras.map(orchestra => getPrograms(orchestra.id))
                )

                const allPrograms = programsArrays.flat()
                setProgramsData(allPrograms)

                const eventsArrays = await Promise.all(
                    allPrograms.map(program => getEvents(program.id))
                )

                const allEvents = eventsArrays.flat()
                setEventsData(allEvents)
            } catch (error) {
                console.error('Home load error:', error)
            }
        }

        fetchData()
    }, [])

    return {
        orchestrasData,
        programsData,
        eventsData,
        adminOrchestraIds,
    }
}