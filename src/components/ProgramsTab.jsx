import ProgramCard from './ProgramCard'

function ProgramsTab({
    programs,
    orchestras,
    selectedProgramId,
    onToggleProgram,
    adminOrchestraIds,
}) {
    const sortedOrchestras = [...orchestras].sort((a, b) => a.id - b.id)

    

    return (
        <div>
            {sortedOrchestras.map((orchestra) => {
                const orchestraPrograms = programs
                    .filter((p) => p.orchestra.id === orchestra.id)
                    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))

                if (orchestraPrograms.length === 0) return null

                return (
                    <div key={orchestra.id} className="mb-6">
                        <h3 className="text-base font-semibold mb-2">{orchestra.name}</h3>

                        <div className="flex flex-col gap-3">
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
                                    canManage={adminOrchestraIds.includes(program.orchestra.id)}
                                />
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ProgramsTab