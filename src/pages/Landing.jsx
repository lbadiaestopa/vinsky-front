import LandingHeader from '../components/LandingHeader'
import AboutSection from '../components/AboutSection'

function Landing() {
    return (
        <>
            <LandingHeader />
            <main className="pt-4">
                <AboutSection />
            </main>
        </>
    )
}

export default Landing