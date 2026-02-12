import Link from "next/link"
import { Heart, Gift, Users, ArrowRight } from "lucide-react"
import IconRenderer from "./icon-renderer"


export default function HowYouSupport() {
  const ways = [
  {
    title: "Donate",
    description: "Direct financial support to fund programs and operations, donations come two forms Occasional and Routine.",
    icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617660/Donate_enmtx9.svg",
    href: "/support/donate",
  },
  {
    title: "Sponsor",
    description: "When you sponsor you pick specific items the boys need, such as tools, STEM kits, books, sports kits, and much more.",
    icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617667/Sponsor_1_goyphq.svg",
    href: "/support/sponsor",
  },
  {
    title: "Volunteer",
    description: "The ultimate commitment, your time, skills, and passion to mentor and guide boys.",
    icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617618/Volunteer_izlode.svg",
    href: "/support/volunteer",
  },
]

  return (
    <section className="bg-secondary dark:bg-gray-800 py-16 md:py-10 ">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-6xl font-bold text-primary mb-8 text-center">How You Can <span className="text-white drop-shadow-lg">Support</span> </h2>
        <p className="text-center text-foreground mb-12 max-w-2xl mx-auto">
          There are three ways to support, Donations, Sponsorships, and Volunteering. Choose what works best for you and support us to make a real difference.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {ways.map((way, idx) => {
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 p-8 rounded-[55px] shadow-lg border-12 border-[#8f8f8f21] hover:border-primary transition-all text-center group"
              >
                <div className="flex items-center rounded-[55px] shadow-[11px] border-2 border-[#e4e4e4] justify-center gap-2 m-3">
                <div className="w-16 h-16 bg-primary/10 dark:bg-primary/30 rounded-full flex items-center justify-center  m-2 group-hover:bg-primary/20 transition">
                  <IconRenderer icon={way.icon} size={40} className="text-primary" />
                </div>
                  <h3 className="text-2xl dark:text-white font-bold text-gray-600">{way.title}</h3>
                </div>
                  <p className="text-muted-foreground text-sm mb-6">{way.description}</p>
                <Link
                  href={way.href}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )
          })}
        </div>

      </div>
        <div className="bg-linear-to-br from-primary to-[#173510] dark:from-[#0a1421] dark:to-[#0a1421] text-white p-8 md:p-12  text-center">
          <h3 className="text-2xl md:text-4xl font-bold md:mb-3 mb-10">Your Impact Matters</h3>
          <div className="grid md:grid-cols-3 grid-cols-1  gap-6 ">
            <div className="relative group w-full h-full md:rounded-4xl rounded-2xl overflow-hidden">

              <img
                src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1770897331/file_00000000484071f48e2a72919353ffa8_3_sg3f1d.svg"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* color overlay */}
              <div className="absolute inset-0 bg-black/40"></div>

              {/* word on top */}
              <div className="absolute md:hidden flex inset-0 items-center justify-center">
                <span className="text-white  text-sm">
                  Every contribution big or small changes a boy's trajectory, and contributes to his future outcome for the betterment of the society.
                </span>
              </div>

            </div>
         
            <div>
              
              <p className="md:text-lg text-sm hidden md:flex mb-8 mt-6.25 opacity-90">Every contribution big or small changes a boy's trajectory, and contributes to his future outcome for the betterment of the society.</p>
            <div className="grid grid-cols-3 gap-6 md:gap-12">
            <div>
              <div className="text-sm md:text-5xl font-bold mb-2">100+</div>
              <div className="text-sm md:text-base">Boys Supported</div>
            </div>
            <div>
              <div className="text-xl md:text-5xl font-bold mb-2">3</div>
              <div className="text-sm md:text-base">Core Programs</div>
            </div>
            <div>
              <div className="text-xl md:text-5xl font-bold mb-2">∞</div>
              <div className="text-sm md:text-base">Possibilities</div>
            </div>
          </div>
            <div className="text-center italic mt-12 text-sm md:text-2xl">Developing Tomorrow's Leaders</div>
          </div>
          <img
            src={"https://res.cloudinary.com/dzn1k1z8r/image/upload/v1770897318/freepik__35mm-film-photography-open-learning-space-with-nig__35804_ulheac.svg"}
            className="w-full hidden md:block rounded-4xl h-full object-cover group-hover:scale-105 transition-transform"
          />
          </div>
        </div>
    </section>
  )
}
