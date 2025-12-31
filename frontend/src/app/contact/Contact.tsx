import { FooterSection } from "@/components/landing/FooterSection"
import { NavigationBar } from "@/components/landing/NavigationBar"
import { ContactForm } from "./ContactForm"
import { ContactHeading } from "./ContactHeading"
import { ContactMethods } from "./ContactMethods"

export const Contact = () => {

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <NavigationBar />

            {/* Hero Section */}
            <ContactHeading />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid lg:grid-cols-3 gap-12">

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <ContactForm />
                    </div>

                    {/* Contact Information */}
                    <ContactMethods />
                </div>
            </div>

            <FooterSection />
        </div>
    )
}