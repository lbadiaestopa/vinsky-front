import aboutImage from '../assets/about-image.png'

function AboutSection() {
    return (
        <section id="about" className="bg-white px-8 py-24 text-black">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-7xl font-semibold leading-tight">
                    Your Orchestra, Always in Sync.
                </h1>

                <p className="ml-2 max-w-7xl text-base leading-relaxed">
                    Vinsky brings your orchestra's projects, rehearsals, concerts, and members together in one place. Stay organized and spend less time managing logistics and more time making music.
                </p>

                <div className="mt-8 rounded-3xl bg-gray p-6">
                    <img
                        src={aboutImage}
                        alt="Vinsky orchestra management platform"
                        className="w-full object-cover rounded-2xl"
                    />
                </div>
            </div>
        </section>
    )
}

export default AboutSection