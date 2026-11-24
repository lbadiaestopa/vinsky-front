import { Link } from 'react-router-dom'

function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-white text-black">
            <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
                <Link
                    to="/"
                    className="text-sm hover:underline"
                >
                    ← Back to home
                </Link>

                <h1 className="mt-10 mb-8 text-4xl font-semibold">
                    Privacy Policy
                </h1>

                <div className="space-y-8 text-base leading-relaxed">
                    <section>
                        <h2 className="mb-3 text-xl font-semibold">
                            1. Introduction
                        </h2>
                        <p>
                            Vinsky is a personal software project designed to
                            simplify the management of orchestras, musical
                            projects, rehearsals, and concerts.
                        </p>
                        <p className="mt-3">
                            This Privacy Policy explains how Vinsky collects,
                            uses, and protects personal information.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold">
                            2. Information We Collect
                        </h2>
                        <p>
                            When you create an account or use Vinsky, we may
                            collect:
                        </p>
                        <ul className="mt-3 list-disc space-y-1 pl-6">
                            <li>First and last name.</li>
                            <li>Email address.</li>
                            <li>Passwords, stored in hashed form.</li>
                            <li>
                                Information and content provided through the
                                application's features.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold">
                            3. How We Use Your Information
                        </h2>
                        <p>We use personal information to:</p>
                        <ul className="mt-3 list-disc space-y-1 pl-6">
                            <li>Create and manage user accounts.</li>
                            <li>Authenticate users and verify email addresses.</li>
                            <li>Provide the application's features.</li>
                            <li>Send account-related and transactional emails.</li>
                            <li>
                                Maintain the security and functionality of the
                                application.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold">
                            4. Use of Google APIs
                        </h2>
                        <p>
                            Vinsky uses the Gmail API to send transactional
                            emails, including account verification emails, from
                            a dedicated application email account.
                        </p>
                        <p className="mt-3">
                            Access to the Gmail API is limited to sending emails
                            through the authorized sender account. Vinsky does
                            not access users' personal Google accounts, inboxes,
                            contacts, or email history.
                        </p>
                        <p className="mt-3">
                            Vinsky's use and transfer of information received
                            from Google APIs to any other app will adhere to the{' '}
                            <a
                                href="https://developers.google.com/terms/api-services-user-data-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                            >
                                Google API Services User Data Policy
                            </a>
                            , including the Limited Use requirements.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold">
                            5. Data Sharing
                        </h2>
                        <p>
                            Vinsky does not sell personal information.
                            Information may be processed by third-party service
                            providers necessary to operate the application,
                            including hosting, database, and email delivery
                            services.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold">
                            6. Data Security and Retention
                        </h2>
                        <p>
                            Vinsky uses authentication, password hashing, and
                            access controls to protect personal information.
                        </p>
                        <p className="mt-3">
                            Personal information is retained for as long as
                            necessary to provide the application's functionality,
                            subject to applicable legal requirements.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold">
                            7. Your Rights
                        </h2>
                        <p>
                            You may request access to, correction of, or deletion
                            of your personal information by contacting Vinsky.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold">
                            8. Changes to This Policy
                        </h2>
                        <p>
                            This Privacy Policy may be updated as the application
                            evolves. Any changes will be published on this page.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold">
                            9. Contact
                        </h2>
                        <p>
                            For questions or requests regarding this Privacy
                            Policy, please contact:
                        </p>
                        <a
                            href="mailto:vinsky.app@gmail.com"
                            className="mt-2 inline-block underline"
                        >
                            vinsky.app@gmail.com
                        </a>
                    </section>
                </div>

                <footer className="mt-16 border-t border-gray-200 pt-6 text-sm">
                    ©Vinsky {new Date().getFullYear()}
                </footer>
            </div>
        </main>
    )
}

export default PrivacyPolicy