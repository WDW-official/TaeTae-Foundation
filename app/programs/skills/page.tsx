"use client"

import Link from "next/link"
import { ArrowLeft, Hammer, Code, Palette, Wrench, TrendingUp, Cog, Lightbulb, } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import IconRenderer from "@/components/icon-renderer"
import { useState } from "react"
import { motion } from "framer-motion"
import BackButton from "@/components/backButton"

export default function SkillsPage() {
  const skills = [
    { name: "Coding", icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617658/Coding_xjwkrq.svg", 
      short: "Participants are introduced to the fundamentals of electrical systems, including circuits, wiring, power distribution, and safety practices.",
    rest: " Through guided workshops and practical demonstrations, boys learn how electricity flows through homes, machines, and devices. As they progress, they work with tools, testing equipment, and simple installations under supervision, building both technical understanding and responsibility while gaining confidence in solving real-world electrical challenges."},
    { name: "Mechanics", icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617663/Mechanics_tn0fsu.svg", 
      short: "Mechanical training focuses on understanding machines, engines, and the principles that allow them to move and operate",
    rest: " Through exposure to automotive basics, tools, and machinery, participants learn how components interact within mechanical systems. With supervision from experienced mechanics, boys practice disassembly, maintenance, and repair techniques while developing problem-solving skills and a strong appreciation for precision, safety, and disciplined workmanship.",},
    { name: "Carpentry", icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617613/Carpentry_xlivwz.svg", 
      short: "Carpentry training provides hands-on experience in woodworking, measurement, and construction techniques.",
    rest: " Participants learn how to use essential tools safely while building simple furniture, frames, and functional structures. Over time, boys develop craftsmanship, patience, and attention to detail as they transform raw materials into useful creations, fostering pride in practical skills and encouraging the creativity needed to design and build independently." },
    { name: "Electrical Engineering", icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617631/Lightbulb_with_gear_wzfwcm.svg", 
      short: "Young athletes receive guidance from experienced mentors.",
    rest: " This helps them develop discipline, leadership, and life skills that go beyond sports.",},
  ]

  const impact = [
    { metric: "95%", label: "Completion Rate" },
    { metric: "87%", label: "Employment Success" },
    { metric: "150+", label: "Skills Taught" },
    { metric: "500+", label: "Boys Trained" },
  ]

  const [openBenefit, setOpenBenefit] = useState<number | null>(null);

  return (
    <main className="bg-white dark:bg-gray-900">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <BackButton label="Back"/>

        <div className="bg-linear-to-br from-primary/10 via-accent/10 to-background md:h-96 rounded-lg overflow-hidden mb-12 border border-border">
          <div className="relative w-full h-full">

            {/* IMAGE */}
            <img
              src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1773140390/WhatsApp_Image_2026-03-09_at_10.20.02_PM_ahkda2.svg"
              alt="Support Illustration"
              className="w-full h-full object-cover"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/50 hover:bg-black/40"></div>

            {/* CENTER TITLE */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-center lg:text-5xl text-2xl font-bold">
                Skills Program
              </h2>
            </div>

            {/* BOTTOM TEXT */}
            <div className="absolute bottom-0 md:bottom-14 left-0 w-full px-1 pt-4 md:p-6 text-center">
              <p className="text-white text-sm md:text-base max-w-2xl mx-auto">
                We continue to collaborate with existing workshops, technical institutions, and experienced professionals while also establishing selected TaeTae Foundation led training initiatives.
              </p>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Intro Section */}
            <p className="lg:text-lg text-sm text-muted-foreground mb-8 leading-relaxed">
               Through these partnerships, boys get to access to real tools, equipment, and structured learning materials. With guidance from skilled tradespeople, engineers, and university-level mentors, the young men develop practical abilities, discipline, and creative thinking gradually refining their talents over several years while building the confidence to design, build, and innovate.
            </p>

            {/* Impact Stats */}
            {/* <div className="grid grid-cols-4 md:grid-cols-4 gap-4 mb-12 bg-secondary dark:bg-gray-800 lg:p-8 p-2 rounded-lg border border-border">
              {impact.map((item) => (
                <div key={item.metric} className="text-center">
                  <p className="lg:text-3xl text-xl font-bold text-primary ">{item.metric}</p>
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div> */}

            {/* Skills Section */}
            <div className="hidden md:block">
              <h2 className="lg:text-5xl text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                What Boys Learn
              </h2>
              <div className="grid grid-cols-1   md:grid-cols-2 gap-6 mb-12">
                {skills.map((skill, index) => {
                  const Icon = skill.icon
                  return (
                    <div
                      key={skill.name}
                      className="dark:bg-gray-800 border border-border p-6 rounded-lg hover:border-primary transition"
                    >
                      <div className="flex gap-4 items-center mb-3">
                        <IconRenderer icon={Icon} size={32} className="text-primary" />
                        <h3 className="text-xl font-bold text-foreground">{skill.name}</h3>
                      </div>
                       <p className="text-muted-foreground">
                          {skill.short}
                          {openBenefit === index && skill.rest}
                        </p>

                        {skill.rest && (
                          <button
                            onClick={() =>
                              setOpenBenefit(openBenefit === index ? null : index)
                            }
                            className="text-primary text-sm mt-2 hover:underline"
                          >
                            {openBenefit === index ? "Read less" : "Read more"}
                          </button>
                        )}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="max-w-7xl mx-auto pb-4 block md:hidden sm:px-6 lg:px-8">
              <div>
                <h2 className="lg:text-5xl text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  What Boys Learn
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3">

                  {skills.map((value, index) => {
                    const Icon = value.icon;

                    return (
                      <div
                        key={index}
                        className={`
                          group py-6 sm:py-8 transition-all duration-300

                          /* MOBILE — horizontal separators between items */
                          ${index !== 0 ? "border-t border-border sm:border-t-0" : ""}

                          /* DESKTOP — vertical separators between columns */
                          ${index !== 0 ? "sm:border-l sm:border-border" : ""}
                        `}
                      >
                        <div className="text-lg items-center flex gap-3 sm:text-2xl font-bold">
                        <div className="mb-4 p-1 rounded-lg bg-primary/10 w-fit">
                          <IconRenderer icon={Icon} size={32} className="text-primary" />
                        </div>

                        <h4 className="text-lg sm:text-2xl font-bold text-foreground mb-3">
                          {value.name}
                        </h4>
                        </div>

                         <p className="text-muted-foreground">
                            {value.short}
                            {openBenefit === index && value.rest}
                          </p>

                          {value.rest && (
                            <button
                              onClick={() =>
                                setOpenBenefit(openBenefit === index ? null : index)
                              }
                              className="text-primary text-sm mt-2 hover:underline"
                            >
                              {openBenefit === index ? "Read less" : "Read more"}
                            </button>
                          )}
                      </div>
                    );
                  })}

                </div>
              </div>
            </div>

            {/* Impact & Outcomes */}
            <h2 className="lg:text-5xl text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              Impact & Outcomes
            </h2>
            <div className="bg-secondary dark:bg-gray-800 border border-border p-8 rounded-lg">
              <p className="text-foreground leading-relaxed">
                Through hands-on training, boys gain confidence, employable skills, and opportunities for
                entrepreneurship. Many graduates have gone on to secure jobs, start their own businesses, and mentor
                younger trainees. The program fosters growth, creativity, and real-world readiness.
              </p>
            </div>
          </div>

          {/* Sidebar CTA */}
          <div>
            <div className="bg-gray-200 dark:bg-gray-800 border border-border p-8 rounded-lg sticky top-24">
              
              <h3 className="text-[23px] uppercase font-bold mb-4">Support This Program</h3>
              
              <p className="text-foreground text-sm mb-6">
                Invest in boys' Skills and future.
              </p>

              <div className="space-y-3">

                {/* Donate */}
                <Link
                  href="/support/donate?program=education"
                  className="flex items-center uppercase justify-center gap-2 w-full px-4 py-3 bg-[#6f9f6f]/70 hover:bg-[#5c8a5c] text-primary-foreground rounded-lg font-semibold transition"
                >
                  <IconRenderer icon={"https://res.cloudinary.com/dzn1k1z8r/image/upload/v1774451701/donate_q97ool.svg"} size={20} className="text-white" />
                  Donate
                </Link>

                {/* Sponsor */}
                <Link
                  href="/support/sponsor?program=education"
                  className="flex items-center uppercase justify-center gap-2 w-full px-4 py-3 border-2 bg-[#d1d5db] hover:bg-[#bfc4cb] text-gray-700 border-primary/10 rounded-lg font-semibold transition"
                >
                  <IconRenderer icon={"https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617667/Sponsor_1_goyphq.svg"} size={20} className="text-gray-700" />
                  Sponsor
                </Link>

                {/* Volunteer */}
                <Link
                  href="/support/volunteer"
                  className="flex items-center uppercase justify-center gap-2 w-full px-4 py-3 border-2 bg-[#e6d8a8] hover:bg-[#d6c88f] text-gray-900 border-accent/10 rounded-lg font-semibold transition"
                >
                  <IconRenderer icon={"https://res.cloudinary.com/dzn1k1z8r/image/upload/v1774451701/volunteer_wv40vn.svg"} size={20} className="text-gray-900" />
                  Volunteer
                </Link>

              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}