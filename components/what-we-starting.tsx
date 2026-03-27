import Link from "next/link"
import { ArrowRight, Hammer, BookOpen, Trophy } from "lucide-react"
import IconRenderer from "./icon-renderer"
import { Overlay } from "vaul";

export default function WhatWeStarting() {
  const programs = [
    {
      title: "SKILLS ACQUISITION",
      description: "Vocational and creative development. The boys learn, mechanics and electrical engineering, content creation, programming, and basic carpentry.",
      image: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1773140368/WhatsApp_Image_2026-03-09_at_10.19.54_PM_fapil7.svg",
      href: "/programs/skills",
      overlay: "Skills turn potential into independence.",
      icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617664/Skills_djsoom.svg",
    },
    {
      title: "EDUCATION & MENTORSHIP",
      description: "Fine-tuning the boy applicable knowledge of basic literacy, numeracy, and STEM through after-school tutoring, leadership programs.",
      image: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764570537/Education_1_ju5myi.png",
      href: "/programs/education",
      overlay:"Strong minds build stronger futures.",
      icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617633/Education_cwwvkm.svg",
    },
    {
      title: "SPORTS DEVELOPMENT",
      description: "Developing physical and social growth through football, athletics, and combat sports, to teach teamwork and discipline.",
      image: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1773140382/WhatsApp_Image_2026-03-09_at_10.20.06_PM_yygxqp.svg",
      href: "/programs/sports",
      overlay:"Sport builds discipline. Discipline builds champions.",
      icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617632/Ball_Icon_shxgfx.svg",
    },
  ]

  return (
    <section id="programs" className="bg-card dark:bg-gray-900 md:py-10 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-3 mb-12">
          <div className="relative h-40 md:h-64">
            <img
              src="https://res.cloudinary.com/dx3zrhslt/image/upload/v1772884456/start-up-02-stroke-rounded_jyfidg.svg"
              className="absolute inset-0 w-full h-full opacity-40 object-contain"
            />

            <div className="font-display relative text-3xl md:text-[64px] md:leading-16 font-[500] text-gray-700 dark:text-white px-[31px] md:py-[42px] py-[30px] text-center">
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
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={program.image || "/placeholder.svg?height=256&width=400"}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Fade Overlay */}
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-center px-6
                                  opacity-70 group-hover:opacity-100
                                  transition-opacity duration-700 ease-in-out">

                    <div className="text-white">
                      <h4 className="font-display text-2xl font-[500] mb-2">{program.overlay}</h4>
                    </div>

                  </div>
                </div>

                {/* Content */}
                <div className="md:p-6 p-3 py-6">
                  <div className="flex items-center gap-3 mb-3">
                    <IconRenderer icon={Icon} size={32} className="text-primary" />
                    <h3 className="text-xl text-gray-800 dark:text-primary font-bold">
                      {program.title}
                    </h3>
                  </div>

                  <p className="text-muted-foreground text-sm mb-6">
                    {program.description}
                  </p>

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
