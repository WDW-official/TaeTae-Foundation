import { ContactHero } from "@/components/contact/contact-hero"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export const metadata = {
  title: "Contact Us - TaeTae Foundation",
  description: "Get in touch with us to learn more about our programs or how you can help.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <ContactHero />
      <div className="lg:py-24 pb-10 dark:bg-gray-800 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
