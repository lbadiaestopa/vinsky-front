import LandingHeader from '../components/LandingHeader'
import AboutSection from '../components/AboutSection'
import FeaturesSection from '../components/FeaturesSection'

function Landing() {
    return (
        <>
            <LandingHeader />
            <main className="pt-4">
                <AboutSection />
                <FeaturesSection />
            </main>
        </>
    )
}

export default Landing