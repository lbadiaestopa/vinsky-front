function ContactSection() {
    return (
        <section id="contact" className="bg-white px-8 pb-12 text-black">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-7xl font-semibold leading-tight">
                    Let's get in touch!
                </h1>

                <p className="ml-1 max-w-7xl text-base leading-relaxed">
                    Have a question, an idea, or feedback about Vinsky? I'd love to hear from you.
                </p>

                <a
                    href="mailto:lbadiaestopa@gmail.com"
                    className="ml-1 mt-4 inline-block text-base font-semibold hover:underline underline-offset-4"
                >
                    Get in touch →
                </a>
            </div>
        </section>
    )
}

export default ContactSection