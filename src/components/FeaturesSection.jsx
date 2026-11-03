function FeaturesSection() {
    return (
        <section id="features" className="bg-white px-8 py-12 text-black">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-7xl font-semibold leading-tight">
                    What You Can Do
                </h1>

                <p className="ml-2 max-w-7xl text-base leading-relaxed">
                    From managing members to organizing concerts and sharing sheet music, Vinsky brings your entire orchestra together in one place.
                </p>

                <div className="mt-8 rounded-3xl bg-gray p-6 flex flex-col gap-3">
                    <div className="rounded-2xl bg-white p-5 grid grid-cols-[180px_1fr] items-center">
                        <span className="text-7xl font-semibold leading-none">
                            01
                        </span>
                        <div>
                            <h2 className="text-base font-semibold">
                                Manage Your Orchestras
                            </h2>
                            <p className="text-base leading-relaxed">
                                Manage your members, roles and orchestra information from one place.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-5 grid grid-cols-[180px_1fr] items-center">
                        <span className="text-7xl font-semibold leading-none">
                            02
                        </span>
                        <div>
                            <h2 className="text-base font-semibold">
                                Plan Rehearsals & Events
                            </h2>
                            <p className="text-base leading-relaxed">
                                Schedule rehearsals, concerts and events with everything organized.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-5 grid grid-cols-[180px_1fr] items-center">
                        <span className="text-7xl font-semibold leading-none">
                            03
                        </span>
                        <div>
                            <h2 className="text-base font-semibold">
                                Share Scores
                            </h2>
                            <p className="text-base leading-relaxed">
                                Keep your sheet music and musical repertoire accessible at all times.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection