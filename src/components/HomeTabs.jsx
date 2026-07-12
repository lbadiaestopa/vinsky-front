function HomeTabs({ activeTab, onChange }) {
    const buttonClass = (tab) =>
        `rounded-lg text-sm font-medium px-4 py-2 cursor-pointer focus:outline-none disabled:cursor-default ${
            activeTab === tab
                ? 'bg-black text-white'
                : 'text-black hover:bg-card-gray transition-colors'
        }`

    return (
        <div className="flex gap-2 mb-6">
            <button
                type="button"
                onClick={() => onChange('events')}
                disabled={activeTab === 'events'}
                className={buttonClass('events')}
            >
                Next events
            </button>

            <button
                type="button"
                onClick={() => onChange('programs')}
                disabled={activeTab === 'programs'}
                className={buttonClass('programs')}
            >
                Next programs
            </button>
        </div>
    )
}

export default HomeTabs