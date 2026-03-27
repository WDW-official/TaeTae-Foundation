"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HowWeOperate from "@/components/how-we-operate";
import WhatWeStarting from "@/components/what-we-starting";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import IconRenderer from "@/components/icon-renderer";
import { Geist, Montserrat } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const montserrat = Montserrat({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export default function AboutFoundationPage() {

  const weDo = [
    {
      title: "Education & Mentorship",
      description: "Strengthening academic foundations, confidence, values, and life skills.",
    },
    {
      title: "Skills & Future Work",
      description: "Equipping boys with vocational, STEM, digital, and creative skills linked to employability.",
    },
    {
      title: "Sports Development",
      description: "Using structured sports to build discipline, teamwork, health, and leadership.",
    },
    {
      title: "Volunteer & Trainer",
      description: "Developing coaches, mentors, and artisans to deliver programmes safely and consistently.",
    },
  ]
  
  const pillars = [
    {
      title: "GET INVOLVED",
      icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617578/Support_hb7jin.svg",
      description: "If you are enthusiastic about making a difference not just talking a good game, come and partner or collaborate with us to empower communities to shape future men.",
      href: "/support",
    },
    {
      title: "DONATE OR SPONSOR",
      icon: "https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617709/Donate_1_bwz3lo.svg",
      description: "Your donations are developing communities, and bringing dreams to life. Take your time and think about what you can commit to. Stay tuned for latest updates on the progress brought to life by your donations.",
      href: "/support",
    },
  ]
  return (
    <main className="bg-white dark:bg-gray-900 overflow-hidden">
      <Navigation />
      {/* ---------------------------------------- */}
      {/* SECTION 1 — ABOUT THE FOUNDATION */}
      {/* ---------------------------------------- */}
      <section className="container mx-auto px-4 pt-24 lg:pb-12  pb-2">
        <div className={`grid ${geistSans.variable}  lg:grid-cols-2 gap-12 items-center`}>
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={`${montserrat.className} text-3xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-9 md:leading-15 mb-6`}>
              BUILDING BOYS OF{" "}
              <span className="text-primary md:text-[50px]">CHARACTER, COMPETENCE,</span>{" "}
              AND <span className="text-primary md:text-[50px]">CONFIDENCE</span>
            </h1>

            <p className="lg:text-lg text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              The TaeTae Foundation is committed to nurturing the boy-child
              through comprehensive development programs designed to instill
              discipline, curiosity, and self-belief. We create safe spaces and
              structured mentorship that guide boys toward becoming responsible,
              confident young men prepared to make a difference in their
              communities.
            </p>

            {/* <Link
              href="/#programs"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a8d4f] transition"
            >
              Learn More <ArrowRight className="w-4 h-4" />
            </Link> */}
          </motion.div>

          {/* RIGHT — IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden lg:block hidden shadow-xl"
          >
            <img
              src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1773141580/Stem_Kit_2_my6qej.svg"
              className="w-full h-105 object-cover"
              alt="About the Foundation"
            />
          </motion.div>
        </div>
      </section>
      <section className="from-[#2f5129] pb-12 md:pb-24 bg-linear-to-br to-[#2a6f1a] dark:from-[#0a1421] dark:to-[#0a1421] grid-cols-1 gap-12 grid md:grid-cols-2 dark:bg-gray-900 p-4 md:p-14 [clip-path:polygon(0_5%,100%_0,100%_95%,0_100%)] md:[clip-path:polygon(0_10%,100%_0,100%_90%,0_100%)]">
        <div className="relative md:mt-20 mt-20  group overflow-hidden">
          <div>
            <h1 className="text-5xl lg:text-5xl text-white text-center font-bold dark:text-white leading-12 md:leading-15 mb-6">
              WHAT WE <span className="text-primary">MUST ACHIEVE</span> 
            </h1>
            <p className="text-center text-white text-xl md;mb-12 mb-5 max-w-2xl mx-auto">
            By 2030, we must have systematically developed and fine tuned a programme that will child the lives of the boy-child for generations to come.
            </p>
            <div className="grid-cols-1 p-2 gap-3 grid md:grid-cols-2 ">
              <div className="flex-1">
                <h1 className="text-2xl flex-1 lg:text-4xl text-primary font-bold leading-tight mb-2">
                  MISSION
                </h1>
                <p className=" text-white text-sm md;mb-12  max-w-2xl mx-auto">
                  To identify, nurture, and develop the talents, abilities, and character of the boy-child, especially in underserved communities, by providing access to structured sports programmes, quality education, vocational and digital skills, mentorship, and opportunity platforms.
                </p>
              </div>
              <div className="block md:hidden ">
                <h1 className="text-2xl flex-1 lg:text-4xl font-bold text-primary leading-tight mb-2">
                  VISION
                </h1>
                <p className=" text-white flex md:hidden text-sm md;mb-12  max-w-2xl mx-auto">
                  To raise a generation of young men who are physically strong, intellectually capable, emotionally intelligent, and economically empowered, able to compete locally and globally, becoming contributors to the continuous development of future generations
                </p>
              </div>
              <div>
              <img
                src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1770906839/unnamed_5_1_pqbbth.svg"
                className=" rounded-xl max-w-[94%]  object-cover group-hover:scale-105 transition-transform duration-300"
              />
              </div>
            </div>
            <div className="grid-cols-1 hidden  p-2 gap-3 md:grid md:grid-cols-2">             
              <div>
                <img
                  src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1770913426/unnamed_2_gyffal.svg"
                  className=" rounded-xl max-w-[94%]  object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:flex hidden flex-1 lg:text-4xl font-bold text-primary leading-tight mb-2">
                  VISION
                </h1>
                <p className=" text-white md:flex hidden  text-sm md;mb-12  max-w-2xl mx-auto">
                  To raise a generation of young men who are physically strong, intellectually capable, emotionally intelligent, and economically empowered, able to compete locally and globally, becoming contributors to the continuous development of future generations
                </p>
              </div>
            </div>

          {/* color overlay */}
          {/* <div className="absolute inset-0 bg-black/40"></div> */}

          {/* word on top */}
          {/* <div className="absolute  flex inset-0 items-center justify-center">
            <span className="text-white  text-sm">
              Every contribution big or small changes a boy's trajectory, and contributes to his future outcome for the betterment of the society.
            </span>
          </div>
          <div className="absolute flex inset-0 mb-20 items-center justify-center">
            <span className="text-white  text-sm">
              Every contribution big or small changes a boy's trajectory, and contributes to his future outcome for the betterment of the society.
            </span>
          </div> */}
          </div>
          <div>

          </div>
        </div>

      <div>
        <h1 className="text-2xl md:mt-20  lg:text-5xl text-white text-center font-bold dark:text-white leading-tight mb-6">
          HOW WE WILL ACHIEVE IT.
        </h1>
        <p className="text-center text-white md:text-xl text-[17px]  md;mb-12 mb-5 max-w-2xl mx-auto">
          We combine four proven pillars into one coordinated programme:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-2 sm:mt-13.5 my-10 lg:grid-cols-2 gap-2 md:gap-10">
            {weDo.map((pillar, index) => {
              

              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group p-2 md:pt-8 md:pb- md:px-8  from-[#ffffff] bg-linear-to-br shadow-2xl to-white dark:from-[#1d395d] dark:to-[#0a1421] dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition relative"
                >
                  
                  {/* Title */}
                  <h3 className="lg:text-2xl text-[13px] md:text-xl font-bold text-primary  mb-2">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 lg:text-xl text-[10px] leading-relaxed mb-2">
                    {pillar.description}
                  </p>

                  {/* Arrow CTA — only if link exists */}
                  {/* {pillar.href && (
                    <Link
                      href={pillar.href}
                      className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
                    >
                      Learn More
                      <ArrowRight
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  )} */}
                </motion.div>
              )
            })}
        </div>
      </div>
      </section>

      
      {/* MAIN CONTENT */}
      <section className="container mx-auto py-2">
        {/* ABOUT SECTION */}
        <section className="container mx-auto px-4 md:py-10 py-0">
            <h2 className={`${montserrat.className} lg:text-7xl text-4xl font-extrabold text-gray-900 dark:text-white mb-2 text-center`}>
                AN ACCOUNTABLE  <br/> DATA-DRIVEN NGO
            </h2>
            <p className="lg:text-5xl font-bold text-primary text-xl  md:leading-14 mb-4 text-center max-w-3xl mx-auto">
              Technology That Turns Impact Into Measurable Outcomes
            </p>
            <p className="text-center hidden md:block text-xl mb-2 md:mb-12">
              Accountability: Audit-ready data at any point in time <br/>
              Transparency: Know exactly where funds go and what they achieve
            </p>

            <div className="grid lg:grid-cols-2 md:gap-12 gap-6 items-center">

                {/* LEFT — IMAGE + BADGE */}
                <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
                >
                {/* Paragraph 1 */}
                
                

                {/* Highlighted Box */}
                <div className="  ">
                    <p className="text-sm font-extrabold lg:text-xl text-gray-900 text-center leading-relaxed">
                      PARTICIPANT PROGRESS & PROGRAMME MANAGEMENT
                    </p>
                    <p className="lg:text-lg hidden md:block text-center  text-sm text-gray-700 dark:text-gray-300 leading-relaxed ">
                      Monitors engagement, outcomes, and development<br/> pathways for every boy
                    </p>
                    <p className="lg:text-lg md:hidden block text-center  text-sm text-gray-700 dark:text-gray-300 leading-relaxed ">
                      Monitors engagement, outcomes, and development pathways for every boy
                    </p>
                    <div>
                      <img
                        src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1770915283/macbook_pro_ergnrp.svg"
                        className=" md:rounded-xl sm:my-12 my-4 max-w-[94%]  object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="lg:text-base text-sm text-gray-700 dark:text-gray-300 leading-relaxed ">
                      Monitor academic, skills, sports, and mentorship progress per participant Identify high performers, at-risk participants, and intervention needs early.
                    </p>
                  </div>
                </motion.div>
                

                {/* RIGHT — CONTENT */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className=""
                >
                  <div className=" p-3 ">
                    <p className="text-sm lg:text-xl font-extrabold text-gray-900 text-center leading-relaxed">
                      LIVE SPONSORSHIP & FUNDING DASHBOARD
                    </p>
                    <p className="lg:text-lg hidden md:block text-center text-sm text-gray-700 dark:text-gray-300 leading-relaxed ">
                      Tracks donor contributions, allocations, and <br/>programme funding in real time
                    </p>
                    <p className="lg:text-lg md:hidden block  text-center text-sm text-gray-700 dark:text-gray-300 leading-relaxed ">
                      Tracks donor contributions, allocations, and programme funding in real time
                    </p>
                    <div>
                      <img
                        src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1770922105/macbook_pro_2_gttwqs.svg"
                        className=" md:rounded-xl sm:my-12 my-4  max-w-[94%]  object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-base text-primary leading-relaxed">
                      Real-Time Financial Transparency

                    </p>
                    <p className="lg:text-base text-sm text-gray-700 dark:text-gray-300 leading-relaxed ">
                      Live visibility into sponsorships, donations, and allocations Clear audit trails from funding received to activities delivered
                    </p>
                  </div>
                </motion.div>

            </div>
        </section>


        {/* APPROACH */}

        {/* FIVE-YEAR PLAN */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl md:p-10 p-2 shadow-md border  border-gray-200 dark:border-gray-700 mb-20"
        >
          <section className="w-full">

          {/* TOP GRID */}
          <div className="grid md:grid-cols-2">

            {/* LEFT GREEN PANEL */}
            <div className="bg-primary dark:bg-gray-900 text-white md:p-10 p-4">
              <h2 className="sm:text-3xl drop-shadow-2xl text-4xl font-bold mb-6">
                80% VOCATIONAL AND DIGITAL EMPLOYABILITY
              </h2>

              <ul className="space-y-1 text-sm sm:text-lg">
                <li>Participants placed into apprenticeships, internships, or paid work</li>
                <li>Job-ready technical, digital, and creative skill sets</li>
                <li>Early income-generation and entrepreneurship pathways.</li>
              </ul>
            </div>

            {/* RIGHT LIGHT PANEL */}
            <div className="bg-gray-100 dark:bg-gray-800 md:p-10 p-4">
              <h2 className="md:text-4xl text-4xl font-extrabold mb-6">
                EVERY 5 YEARS
              </h2>

              <h3 className="md:text-2xl text-lg font-bold text-primary mb-4">
                National Sports Representation Pathways
              </h3>

              <ul className="space-y-1 md:text-lg text-sm">
                <li>Identified elite athletes progressing into pipelines</li>
                <li>Structured exposure through tournaments</li>
                <li>Discipline, leadership, and health outcomes.</li>
              </ul>
            </div>

          </div>


          {/* BOTTOM IMAGE ROW */}
          <div className=" gap-6 bg-primary/20 p-4">

            <div className="text-center md:mb-2 mb-1">
                  <Link
                    href="/about/the-plan"
                    className="inline-flex gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a8d4f] transition"
                  >
                    LEARN MORE <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

          </div>

        </section>

        </motion.div>

        {/* PILLARS */}
        <div className="grid grid-cols-1 md:mx-0 mx-3 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon

            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group p-8 bg-white dark:bg-gray-800 mb-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition relative"
              >
                <div className="flex items-center gap-3 justfiy-center">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-full bg-primary/15 dark:bg-primary/20 flex items-center justify-center mb-4">
                    <IconRenderer icon={Icon} size={32} className="text-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="lg:text-2xl text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {pillar.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 lg:text-base text-sm leading-relaxed mb-6">
                  {pillar.description}
                </p>

                {/* Arrow CTA — only if link exists */}
                {pillar.href && (
                  <Link
                    href={pillar.href}
                    className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
                  >
                    LEARN MORE
                    <ArrowRight
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                )}
              </motion.div>
            )
          })}
        </div>

        

        {/* CTA BUTTONS */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            href="/get-involved"
            className="px-6 py-3 bg-[#76b569] text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-[#5a8d4f] transition"
          >
            Get Involved <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/partner"
            className="px-6 py-3 border-2 border-[#76b569] text-[#76b569] dark:text-[#8bc97f] rounded-lg font-semibold flex items-center gap-2 hover:bg-[#76b569]/10 transition"
          >
            Partner With Us <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/donate"
            className="px-6 py-3 border-2 border-[#5a8d4f] text-[#5a8d4f] dark:text-[#8bc97f] rounded-lg font-semibold flex items-center gap-2 hover:bg-[#5a8d4f]/10 transition"
          >
            Donate <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div> */}
        
      </section>
       <Footer />
    </main>
  );
}
