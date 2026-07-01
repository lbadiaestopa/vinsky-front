import ProgramCard from './ProgramCard'

function ProgramsTab({ programs, orchestras, selectedProgramId, onToggleProgram }) {
    const sortedOrchestras = [...orchestras].sort((a, b) => a.id - b.id)

    return (
        <div>
            <h2>Programs</h2>

            {sortedOrchestras.map((orchestra) => {
                const orchestraPrograms = programs
                    .filter((p) => p.orchestra.id === orchestra.id)
                    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))

                if (orchestraPrograms.length === 0) return null

                return (
                    <div key={orchestra.id} style={{ marginBottom: '24px' }}>
                        <h3>{orchestra.name}</h3>

                        {orchestraPrograms.map((program) => (
                            <ProgramCard
                                key={program.id}
                                program={program}
                                isOpen={selectedProgramId === program.id}
                                onToggle={() =>
                                    onToggleProgram(
                                        selectedProgramId === program.id ? null : program.id
                                    )
                                }
                            />
                        ))}
                    </div>
                )
            })}
        </div>
    )
}

export default ProgramsTab