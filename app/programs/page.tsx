"use client"

import Footer from "@/components/footer"
import IconRenderer from "@/components/icon-renderer"
import Navigation from "@/components/navigation"
import WhatWeStarting from "@/components/what-we-starting"
import { motion } from "framer-motion"
import { Globe, Eye, Diamond, Calendar, Handshake, HeartHandshake, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HowWeOperatePage() {
  const pillars = [
    {
      title: "SKILLS",
      icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617603/Our_Mission_akg8w9.svg",
      description: "Hands-on workshops that develop creativity, problem-solving, and craftsmanship.",
    },
    {
      title: "EDUCATION",
      icon: "Eye",
      description: "Learning support and literacy programs that strengthen academicconfidence.",
    },
    {
      title: "SPORTS",
      icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617622/Values_julkif.svg",
      description: "Activities that promote teamwork, discipline, and resilience.",
    },
  ]

  return (
      <main className="bg-secondary dark:bg-gray-900 overflow-hidden">
        <Navigation />
      {/* HERO SECTION */}
      <section className="relative flex items-center pt-24 pb-12 lg:pb-10 overflow-hidden">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-1 items-center relative z-10">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:leading-20 leading-8 md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-3 md:mb-6">
              SHAPING BOYS INTO<br/>
              <span className="text-primary dark:text-[#8bc97f]"> MEN OF PURPOSE</span>
            </h1>
            <p className="lg:text-xl text-sm text-gray-600 dark:text-gray-300 leading-relaxed lg:mb-8 max-w-xl">
              At the <span className="font-bold">TaeTae Foundation</span>, we believe that when boys are given tools, guidance,
              and opportunity, they grow into responsible men who uplift their families and
              communities.
            </p>
            <div className="font-semibold mt-3 text-gray-800 mb-1 italic">
              JOIN US
            </div>
              
            <div className="">
              <Link
                  href="/support/volunteer"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a8d4f] transition"
                >
                <p className="font-semibold">Growth • Excellence • Integrity</p>
                </Link>
            </div>
          </motion.div>

          {/* Right Decorative Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
            >
            <div className="rounded-2xl overflow-hidden ">
                <img
                src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1770925732/iPhone_17_Pro_Mockup_Free.svg.png_qbwmye.svg"
                alt="Boys in leadership training"
                className="w-full md:h-95 mt-10  object-cover"
                />
            </div>

            
          </motion.div>
          
        </div>

        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#76b569]/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-[#5a8d4f]/20 rounded-full blur-3xl -z-10" />
      </section>
      {/* ---------------------------------------- */}
            {/* SECTION 2 — HOW WE OPERATE */}
            {/* ---------------------------------------- */}
            <section className="bg-secondary dark:bg-gray-800 lg:py-24 py-10">
              <div className="container mx-auto px-4">
                <h2 className="lg:text-6xl text-4xl  font-bold text-gray-800 dark:text-white mb-6 text-center">
                  HOW WE OPERATE
                </h2>
      
                <p className="lg:text-lg text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto lg:mb-12 text-center">
                  We focus on practical education, skill-building, and teamwork
                  through sports and structured mentorship. Each program is designed
                  to shape a well-rounded young man ready to contribute meaningfully
                  to society.
                </p>
      
              </div>
                {/* SUB SECTIONS */}
                <div className=" mx-auto  px- sm:px-6 lg:px-8">
                <div>
      
                  <div className="grid bg-whit grid-cols-1 sm:grid-cols-3">
      
                    {pillars.map((pillar, index) => {
      
                      return (
                        <div
                          key={index}
                          className={`
                            group p-6 sm:p-8 transition-all duration-300
      
                            /* MOBILE — horizontal separators between items */
                            ${index !== 0 ? "border-t border-border sm:border-t-0" : ""}
      
                            /* DESKTOP — vertical separators between columns */
                            ${index !== 0 ? "sm:border-l sm:border-border" : ""}
                          `}
                        >
                          <div className="text-lg items-center flex gap-3 sm:text-2xl font-bold">
      
                          <h4 className="text-lg sm:text-2xl font-bold text-foreground mb-3">
                            {pillar.title}
                          </h4>
                          </div>
      
                          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            {pillar.description}
                          </p>
                        </div>
                      );
                    })}
      
                  </div>
                </div>
      
                {/* CTA */}
                <div className="text-center mt-12">
                  <Link
                    href="/programs"
                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a8d4f] transition"
                  >
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
      
            {/* ---------------------------------------- */}
            {/* SECTION 3 — WHAT WE ARE STARTING WITH */}
            {/* ---------------------------------------- */}
            <WhatWeStarting />
            <Footer />
      
    </main>)
}