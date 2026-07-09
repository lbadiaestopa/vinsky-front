import EventCard from './EventCard'
import { useProgramCard } from '../hooks/useProgramCard'
import AddEventModal from './AddEventModal'
import EditProgramModal from './EditProgramModal'
import { EVENT_TYPES_ORDER } from '../constants/eventTypes'

function ProgramCard({ program, isOpen, onToggle, canManage, onProgramUpdated, onProgramDeleted }) {
    const {
        scores, loadingScores, isUploading, uploadError, fileInputRef,
        handleFileSelected, handleDownload, downloadingId, handleDeleteScore, deletingScoreId,
        sortedEvents, loadingEvents, handleEventUpdated, handleEventDeleted,
        menuOpen, toggleMenu, closeMenu,
        activeModal, openModal, closeModal,
        eventForm, setEventForm, isSavingEvent, eventError, handleCreateEvent,
        detailsForm, setDetailsForm, isSavingDetails, detailsError, handleUpdateDetails,
        isDeleting, handleDelete
    } = useProgramCard(program, isOpen, onProgramUpdated, onProgramDeleted)

    return (
        <div className={`border border-gray rounded-lg p-4 mb-3 relative ${isDeleting ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-start">
                <div onClick={onToggle} className="cursor-pointer flex-1">
                    <h3 className="text-base font-semibold">{program.name}</h3>
                    <p className="text-sm opacity-85 my-1">
                        {new Date(program.start_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {' - '}
                        {new Date(program.end_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                </div>

                {canManage && (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                toggleMenu()
                            }}
                            className="bg-transparent border-none text-lg cursor-pointer px-2 focus:outline-none"
                        >
                            <span className="material-symbols-outlined text-xl! rounded-full hover:bg-gray transition-colors px-2 py-1">more_vert</span>
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 top-full bg-white border border-gray rounded-lg shadow-md z-10 min-w-35">
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); openModal('editDetails') }}
                                    className="block w-full text-left text-sm px-3 py-2 hover:bg-card-gray transition-colors focus:outline-none cursor-pointer"
                                >
                                    Edit details
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleDelete() }}
                                    className="block w-full text-left text-sm px-3 py-2 text-red hover:bg-card-gray transition-colors focus:outline-none cursor-pointer"
                                >
                                    Delete program
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isOpen && (
                <div className="mt-3 border-t border-gray pt-3">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-semibold">Events</h4>

                        <button
                            type="button"
                            onClick={() => openModal('addEvent')}
                            className="rounded-lg border border-gray hover:bg-card-gray transition-colors text-sm font-medium pl-2 pr-3 py-1.5 cursor-pointer focus:outline-none flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-xl!">add</span>
                            Add event
                        </button>
                    </div>

                    {loadingEvents && <p className="text-sm">Loading...</p>}
                    {!loadingEvents && sortedEvents.length === 0 && <p className="text-sm">No events scheduled</p>}
                    {!loadingEvents && sortedEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            programId={program.id}
                            canManage={true}
                            onEventUpdated={handleEventUpdated}
                            onEventDeleted={handleEventDeleted}
                        />
                    ))}

                    <hr className="border-gray mb-4 mt-4" />

                    <div className="flex justify-between items-center mt-4 mb-2">
                        <h4 className="text-sm font-semibold ms-1">Scores</h4>

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="rounded-lg border border-gray hover:bg-card-gray transition-colors text-sm font-medium pl-2 pr-3 py-1.5 cursor-pointer focus:outline-none flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-xl!">add</span>
                            {isUploading ? 'Uploading...' : 'Add score'}
                        </button>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileSelected}
                        className="hidden"
                    />

                    {uploadError && <p className="text-sm text-red">{uploadError}</p>}

                    {loadingScores && <p className="text-sm">Loading...</p>}
                    {!loadingScores && scores.length === 0 && <p className="text-sm">No scores available</p>}
                    {!loadingScores && scores.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                            {scores.map((score) => (
                                <div key={score.id} className="bg-card-gray rounded-lg p-3 flex justify-between items-center gap-2">
                                    <span className="text-sm truncate">{score.original_name}</span>
                                    <div className="flex gap-1 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleDownload(score)}
                                            disabled={downloadingId === score.id}
                                            className="px-2 py-1 hover:bg-gray rounded-full transition-colors focus:outline-none cursor-pointer disabled:opacity-60 flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-lg!">
                                                {downloadingId === score.id ? 'progress_activity' : 'download'}
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteScore(score)}
                                            disabled={deletingScoreId === score.id}
                                            className="rounded-full text-sm px-2 py-1 text-red hover:bg-gray transition-colors focus:outline-none cursor-pointer disabled:opacity-60"
                                        >
                                            <span className="material-symbols-outlined text-lg!">
                                                {deletingScoreId === score.id ? 'progress_activity' : 'delete'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <AddEventModal
                open={activeModal === 'addEvent'}
                form={eventForm}
                setForm={setEventForm}
                isSaving={isSavingEvent}
                error={eventError}
                onSave={handleCreateEvent}
                onClose={closeModal}
            />

            <EditProgramModal
                open={activeModal === 'editDetails'}
                form={detailsForm}
                setForm={setDetailsForm}
                isSaving={isSavingDetails}
                error={detailsError}
                onSave={handleUpdateDetails}
                onClose={closeModal}
            />
        </div>
    )
}

export default ProgramCard