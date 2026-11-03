import { useEffect, useState } from 'react'

function LandingHeader() {
    const [activeSection, setActiveSection] = useState('')

    useEffect(() => {
        const updateActiveSection = () => {
            const sections = document.querySelectorAll('#about, #features, #contact')

            const isAtBottom =
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 2

            if (isAtBottom) {
                setActiveSection('contact')
                return
            }

            const currentSection = [...sections]
                .reverse()
                .find((section) => section.getBoundingClientRect().top <= window.innerHeight * 0.35)

            setActiveSection(currentSection?.id || 'about')
        }

        window.addEventListener('scroll', updateActiveSection)
        window.addEventListener('resize', updateActiveSection)

        updateActiveSection()

        return () => {
            window.removeEventListener('scroll', updateActiveSection)
            window.removeEventListener('resize', updateActiveSection)
        }
    }, [])

    const navClass = (section) =>
        `text-black transition-all ${activeSection === section
            ? 'underline underline-offset-8 decoration-2'
            : 'hover:underline hover:underline-offset-8'
        }`

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between px-8 py-5">
                <div className="text-xl font-semibold text-black">
                    Vinsky
                </div>

                <nav className="flex items-center gap-10 text-sm">
                    <a href="#about" className={navClass('about')}>
                        About Vinsky
                    </a>
                    <a href="#features" className={navClass('features')}>
                        What You Can Do
                    </a>
                    <a href="#contact" className={navClass('contact')}>
                        Contact
                    </a>
                </nav>

                <div className="flex items-center gap-3 text-sm">
                    <a href="/register" className="px-4 py-2 rounded-lg text-sm font-medium border border-black hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        Sign Up
                    </a>
                    <a href="/login" className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium border border-black hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        Log In
                    </a>
                </div>
            </div>
        </header>
    )
}

export default LandingHeader