import LandingHeader from '../components/LandingHeader'
import AboutSection from '../components/AboutSection'
import FeaturesSection from '../components/FeaturesSection'
import ContactSection from '../components/ContactSection'
import LandingFooter from '../components/LandingFooter'

function Landing() {
    return (
        <>
            <LandingHeader />
            <main className="pt-4">
                <AboutSection />
                <FeaturesSection />
                <ContactSection />
            </main>
            <LandingFooter />
        </>
    )
}

export default Landing