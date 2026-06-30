import { programs } from '../mock/programs'
import { scores } from '../mock/scores'

function ProgramHomeCard({ programId }) {
    const program = programs.find((p) => p.id === programId)

    if (!program) {
        return null
    }

    const programScores = scores.filter(
        (s) => s.program_id === program.id
    )

    return (
        <div style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '12px' }}>
            <div style={{ marginTop: '12px' }}>
                <h4>Scores</h4>

                {programScores.length > 0 ? (
                    <ul>
                        {programScores.map((score) => (
                            <li
                                key={score.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <span>{score.original_name}</span>
                                <button type="button">
                                    Download
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No scores available</p>
                )}
            </div>

        </div>
    )
}

export default ProgramHomeCard