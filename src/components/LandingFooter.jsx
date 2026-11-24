import { Link } from 'react-router-dom'

function LandingFooter() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-white border-t border-gray-200 px-8 py-5 text-black">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                    <a
                        href="https://github.com/lbadiaestopa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline underline-offset-4"
                    >
                        GitHub
                    </a>
                    <span>·</span>
                    <a
                        href="https://www.linkedin.com/in/lbadiaestopa/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline underline-offset-4"
                    >
                        LinkedIn
                    </a>
                </div>

                <span>© Vinsky {currentYear}</span>

                <Link to="/privacy" className="hover:underline">
                    Privacy Policy
                </Link>
            </div>
        </footer>
    )
}

export default LandingFooter