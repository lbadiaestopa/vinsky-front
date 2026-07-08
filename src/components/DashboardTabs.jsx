function DashboardTabs({
    tabs,
    activeTab,
    onChange,
}) {
    const tabClass = (tab) =>
        `rounded-lg text-sm font-medium px-4 py-2 cursor-pointer focus:outline-none disabled:cursor-default ${
            activeTab === tab
                ? 'bg-black text-white'
                : 'text-black hover:bg-card-gray transition-colors'
        }`

    return (
        <nav className="flex gap-2 mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    onClick={() => onChange(tab.id)}
                    disabled={activeTab === tab.id}
                    className={tabClass(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    )
}

export default DashboardTabs