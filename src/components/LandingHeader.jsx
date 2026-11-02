import { useEffect, useState } from 'react'

function LandingHeader() {
    const [activeSection, setActiveSection] = useState('')

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id)
                    }
                })
            },
            {
                rootMargin: '-20% 0px -60% 0px'
            }
        )

        const sections = document.querySelectorAll('#about, #features, #contact')

        sections.forEach((section) => observer.observe(section))

        return () => observer.disconnect()
    }, [])

    const navClass = (section) =>
        `text-black transition-all ${
            activeSection === section
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