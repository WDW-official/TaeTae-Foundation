import Link from "next/link"
import { ArrowRight, Hammer, BookOpen, Trophy } from "lucide-react"
import IconRenderer from "./icon-renderer"
import { Exo_2, Keania_One } from "next/font/google";

const exo2 = Exo_2({
  weight: "500",
  subsets: ["latin"],
});

export default function WhatWeStarting() {
  const programs = [
    {
      title: "Skills Acquisition",
      description: "Vocational and creative development. The boys learn, mechanics and electrical engineering, content creation, programming, and basic carpentry.",
      image: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764570530/freepik__realistic-ultra-high-resolution-photo-of-a-15-year__14040_ydyty9.png",
      href: "/programs/skills",
      icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617664/Skills_djsoom.svg",
    },
    {
      title: "Education & Mentorship",
      description: "Fine-tuning the boy applicable knowledge of basic literacy, numeracy, and STEM through after-school tutoring, leadership programs.",
      image: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764570537/Education_1_ju5myi.png",
      href: "/programs/education",
      icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617633/Education_cwwvkm.svg",
    },
    {
      title: "Sports Development",
      description: "Developing physical and social growth through football, athletics, and combat sports, to teach teamwork and discipline.",
      image: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764925058/Football_1_fd9ljd.png",
      href: "/programs/sports",
      icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617632/Ball_Icon_shxgfx.svg",
    },
  ]

  return (
    <section id="programs" className="bg-card dark:bg-gray-900 py-10 md:py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-3 mb-12">
          <div className="relative h-40 md:h-64">
            <img
              src="https://res.cloudinary.com/dx3zrhslt/image/upload/v1772884456/start-up-02-stroke-rounded_jyfidg.svg"
              className="absolute inset-0 w-full h-full opacity-40 object-contain"
            />

            <div className={`${exo2.className} relative text-3xl md:text-[64px] md:leading-16 text-gray-700 dark:text-white px-[31px] md:py-[42px] py-[30px] text-center font-[900]`}>
              WHAT WE'RE STARTING WITH...
            </div>
          </div>
            {/* <img
              src="https://res.cloudinary.com/dx3zrhslt/image/upload/v1772884456/start-up-02-stroke-rounded_jyfidg.svg"
              className="absolute inset-0 w-full h-full object-contain"
            />
            <div
              className={`${exo2.className} text-xl md:text-[64px] leading-16 px-[31px] py-[42px] font-bold mb-4 text-white`}
            >
              WHAT WE'RE STARTING WITH...
            </div> */}
          <div>
            <p className=" text-sm md:px-11.5 px[20px] lg:text-[25px] text-gray-600 dark:text-gray-300 md:mb-12 mb-0 max-w-2xl mx-auto">
              We’re beginning our journey with three key focus areas which are <span className="bg-secondary dark:bg-primary font-bold">Skills Acquisition, Education & Mentorship, and Sports Development</span>   all designed to build a strong foundation for every boy to reach his full potential.
            </p>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program, idx) => {
            const Icon = program.icon
            return (
              <div
                key={idx}
                className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-border hover:border-primary transition-all hover:shadow-lg"
              >
                <div className="relative h-64 bg-linear-to-br from-primary/10 to-secondary overflow-hidden">
                  <img
                    src={program.image || "/placeholder.svg?height=256&width=400"}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition"></div>
                </div>
                <div className="md:p-6 p-3 py-6">
                  <div className="flex items-center gap-3 mb-3">
                    <IconRenderer icon={Icon} size={32} className="text-primary" />
                    <h3 className="text-2xl text-gray-800 dark:text-primary  font-bold">{program.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-6">{program.description}</p>
                  <Link
                    href={program.href}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/70 transition"
                  >
                    LEARN MORE
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
