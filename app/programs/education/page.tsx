"use client"

import Link from "next/link"
import { ArrowLeft, BookOpen, Award, Users, TrendingUp, Code, Camera, Sigma, Atom } from "lucide-react"
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import IconRenderer from "@/components/icon-renderer";
import BackButton from "@/components/backButton";
import { useState } from "react";
import { motion } from "framer-motion";

export default function EducationPage() {
  const benefits = [
  {
    icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617611/Computer_Science_fdcsmf.svg",
    title: "Media",
    short: "Media training introduces boys to digital storytelling, photography, video production, and content creation.",
    rest: " Participants learn how to capture ideas, edit visual material, and communicate messages through modern digital platforms. Through guided projects and mentorship from experienced creators, boys develop creativity, technical skills, and confidence in expressing their perspectives while gaining valuable skills that are increasingly relevant in today’s digital world.",
  },
  {
    icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617708/Math_csmhst.svg",
    title: "Math",
    short: "Mathematics training strengthens numeracy, logic, and structured thinking.",
    rest: " Through engaging exercises, practical examples, and problem-solving challenges, boys learn how mathematical concepts apply to real-life situations. By reinforcing foundational skills in arithmetic, reasoning, and analytical thinking, the program helps participants build confidence in tackling complex problems and prepares them for future academic, technical, and professional opportunities.",
  },
  {
    icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617569/Science_u6pqus.svg",
    title: "Science",
    short: "Science learning focuses on curiosity, experimentation, and discovery.",
    rest: " Through hands-on demonstrations and simple experiments, boys explore the principles that govern the natural and technological world around them. From basic physics and chemistry concepts to practical applications in engineering and everyday life, participants develop critical thinking skills while gaining a deeper understanding of how science shapes modern society.",
  },
  {
    icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617614/Communication_2_wllcto.svg",
    title: "Communication",
    short: "Communication training helps boys express ideas clearly and confidently.",
    rest: " Participants practice reading comprehension, public speaking, and structured discussion while also developing listening skills and respectful dialogue. By strengthening language abilities and encouraging thoughtful expression, the program prepares participants to communicate effectively in academic settings, professional environments, and leadership roles within their communities.",
  },
];


  const outcomes = [
    { metric: "92%", label: "Pass Rate" },
    { metric: "85%", label: "Grade Improvement" },
    { metric: "300+", label: "Boys Mentored" },
    { metric: "99%", label: "Confidence Growth" },
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
              src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764570531/Education_3_y4l5kp.jpg"
              alt="Support Illustration"
              className="w-full h-full object-cover"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/60 hover:bg-black/40"></div>

            {/* CENTER TITLE */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-center lg:text-5xl text-2xl font-bold">
                Education Program
              </h2>
            </div>

            {/* BOTTOM TEXT */}
            <div className="absolute bottom-14 md:bottom-14 left-0 w-full px-1 pt-4 md:p-6 text-center">
              <p className="text-white text-sm md:text-base max-w-2xl mx-auto">
                Through partnerships with schools, educators, and experienced professionals, we support boys in strengthening the academic and creative skills that shape future leaders. 
              </p>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <p className="lg:text-lg text-sm text-muted-foreground mb-8 leading-relaxed">
              Our programs combine practical learning, mentorship, and real-world exposure to help boys develop confidence, curiosity, and problem-solving ability. By blending foundational education with modern digital skills, we prepare participants to think critically, communicate effectively, and explore opportunities across science, technology, and creative industries.
            </p>

            {/* <div className="grid grid-cols-4 md:grid-cols-4 gap-4 mb-12 bg-secondary dark:bg-gray-800 lg:p-8 p-2 rounded-lg border border-border">
              {outcomes.map((item) => (
                <div key={item.metric} className="text-center">
                  <p className="lg:text-3xl text-xl font-bold text-primary ">{item.metric}</p>
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div> */}
            <div className="hidden md:block">
            <h2 className="lg:text-5xl text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              What Boys Receive
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div
                    key={benefit.title}
                    className="dark:bg-gray-800 border border-border p-6 rounded-lg hover:border-primary transition"
                  >
                    <div className="flex gap-4 items-center mb-2">
                      <IconRenderer icon={Icon} size={32} className="text-primary" />

                      <h3 className="text-xl font-bold text-foreground">
                        {benefit.title}
                      </h3>
                    </div>

                    <p className="text-muted-foreground">
                      {benefit.short}
                      {openBenefit === index && benefit.rest}
                    </p>

                    {benefit.rest && (
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

                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;

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
                          <IconRenderer icon={Icon} size={22} className="text-primary" />
                        </div>

                        <h4 className="text-lg sm:text-2xl font-bold text-foreground mb-3">
                          {benefit.title}
                        </h4>
                        </div>

                        <p className="text-muted-foreground">
                          {benefit.short}
                          {openBenefit === index && benefit.rest}
                        </p>

                        {benefit.rest && (
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

            <h2 className="lg:text-5xl text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Award className="w-8 h-8 text-primary" />
              Impact
            </h2>
            <div className="bg-secondary dark:bg-gray-800 border border-border p-8 rounded-lg">
              <p className="text-foreground text-sm lg:text-base leading-relaxed">
                We believe every boy deserves quality education and mentorship. Through our programs, academic
                performance improves, confidence grows, and boys start seeing education as a gateway to unlimited
                opportunities.
              </p>
            </div>
          </div>

          <div>
            <div className="bg-gray-200 dark:bg-gray-800 border border-border p-8 rounded-lg sticky top-24">
              
              <h3 className="text-[23px] uppercase font-bold mb-4">Support This Program</h3>
              
              <p className="text-foreground text-sm mb-6">
                Invest in boys' education and future.
              </p>

              <div className="space-y-3">

                {/* Donate */}
                <Link
                  href="/support/donate?program=education"
                  className="flex items-center justify-center uppercase gap-2 w-full px-4 py-3 bg-[#6f9f6f]/70 hover:bg-[#5c8a5c] text-primary-foreground rounded-lg font-semibold transition"
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
