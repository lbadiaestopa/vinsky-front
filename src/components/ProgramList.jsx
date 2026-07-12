import ProgramCard from './ProgramCard'

function ProgramList({
    title,
    programs,
    selectedProgramId,
    setSelectedProgramId,
    canManage,
    onProgramUpdated,
    onProgramDeleted,
    action,
}) {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{title}</h2>

                {action}
            </div>

            {programs.length === 0 && (
                <p className="text-sm">
                    {title === 'Programs'
                        ? 'No active programs.'
                        : 'No past programs.'}
                </p>
            )}

            <div className="flex flex-col gap-3">
                {programs.map((program) => (
                    <ProgramCard
                        key={program.id}
                        program={program}
                        isOpen={selectedProgramId === program.id}
                        onToggle={() =>
                            setSelectedProgramId(
                                selectedProgramId === program.id
                                    ? null
                                    : program.id
                            )
                        }
                        canManage={canManage}
                        onProgramUpdated={onProgramUpdated}
                        onProgramDeleted={onProgramDeleted}
                    />
                ))}
            </div>
        </div>
    )
}

export default ProgramList