import { Link } from 'react-router-dom'

function EmailVerified() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-semibold mb-6 ms-1">
                    Email verified successfully!
                </h1>

                <p className="text-sm text-gray-600 mb-6 ms-1">
                    Your email address has been verified. You can now log in to your Vinsky account.
                </p>

                <Link
                    to="/login"
                    className="block text-center rounded-lg bg-black text-white text-sm font-medium py-2 border border-black hover:cursor-pointer"
                >
                    Go to Login
                </Link>
            </div>
        </div>
    )
}

export default EmailVerified