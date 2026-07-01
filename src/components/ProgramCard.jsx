import { useEffect, useState } from 'react'
import { getScores } from '../services/scoreService'

function ProgramCard({ program, isOpen, onToggle }) {
    const [scores, setScores] = useState([])
    const [loadingScores, setLoadingScores] = useState(false)

    useEffect(() => {
        if (!isOpen) return

        const fetchScores = async () => {
            setLoadingScores(true)
            const data = await getScores(program.id)
            setScores(data)
            setLoadingScores(false)
        }

        fetchScores()
    }, [isOpen, program.id])

    return (
        <div style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '12px' }}>
            <div onClick={onToggle} style={{ cursor: 'pointer' }}>
                <h3 style={{ margin: 0 }}>{program.name}</h3>
                <p style={{ margin: '4px 0', fontSize: '0.9rem', opacity: 0.85 }}>
                    {new Date(program.start_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    {' → '}
                    {new Date(program.end_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
            </div>

            {isOpen && (
                <div style={{ marginTop: '12px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                    <h4>Scores</h4>

                    {loadingScores && <p>Loading...</p>}

                    {!loadingScores && scores.length === 0 && <p>No scores available</p>}

                    {!loadingScores && scores.length > 0 && (
                        <ul>
                            {scores.map((score) => (
                                <li key={score.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                    <span>{score.original_name}</span>
                                    <button type="button">Download</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}

export default ProgramCard