"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import IconRenderer from "@/components/icon-renderer"
import PublicImpactSection from "@/components/PublicImpactSection"
import Project100Progress from "@/components/Project100Progress"

export default function SupportPage() {
  const [project100Raised, setProject100Raised] = useState(0)
  const [statsLoaded, setStatsLoaded] = useState(false)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch("/api/public/stats", { cache: "no-store" })
        const data = await response.json()

        if (response.ok) {
          setProject100Raised(Number(data?.project100Funding?.raised || 0))
        }
      } catch (error) {
        console.error("Error loading public stats:", error)
      } finally {
        setStatsLoaded(true)
      }
    }

    void loadStats()
  }, [])

  return (
    <>
      <Navigation />

      {/* HERO SECTION */}
      <section className="container mx-auto px-4 pt-24 pb-12 ">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-[40px] lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-9 md:leading-13 mb-6">
              HOW YOU CAN{" "}
              <span className="text-primary dark:text-[#8bc97f]"> SUPPORT</span>
            </h1>

            <p className="lg:text-lg text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              There are three ways to be part of this journey, donate, sponsor, or volunteer.
              Each contribution directly impacts the boys we serve and the future we’re
              shaping together.
            </p>

            <div className="flex gap-4">
              {/* <Link
                href="/support"
                className="inline-flex items-center gap-2 bg-primary hover:bg-[#5ea04e] text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Support a Cause
                <ChevronRight className="w-4 h-4" />
              </Link> */}

              <Link
                href="#support-options"
                className="inline-flex items-center gap-2 bg-primary hover:bg-[#5ea04e] text-white lg:px-6 lg:py-3 px-3 py-1 rounded-lg font-semibold transition"
              >
                LEARN HOW
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden hidden lg:block shadow-xl"
          >
            <img
              src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764570541/Carpentry_2_ceiql0.png"
              alt="Support Illustration"
              className="w-full h-105 object-cover"
            />

            {/* Overlay */}
            {/* <div className="absolute hover:bg-black/40 inset-0 bg-black/70"></div> */}
            <div className="absolute inset-0 flex items-center justify-center">
            {/* <h2 className="text-white text-center italic text-3xl ">
              When you support a boy,<br/> you build a nation.
            </h2> */}
          </div>
          </motion.div>
        </div>
      </section>

      {/* SUPPORT OPTIONS */}
      <section id="support-options" className="bg-card dark:bg-gray-900  container mx-auto px-4 py-3 md:py-12">
        <div className=" mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* DONATE */}
            <div className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-border hover:border-primary transition-all hover:shadow-lg">
              <div className="relative h-64 text-white hover:text-primary overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764755445/Donate_1_ptppnd.png"
                  alt="Donate"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-center px-6
                    opacity-70 group-hover:opacity-100
                    transition-opacity duration-700 ease-in-out">

                    <div className="">
                      <h4 className=" text-3xl font-[700] mb-2">YOUR SUPPORT</h4>
                    </div>

                  </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <IconRenderer icon={'https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617721/Asset_29_cwxbbu.svg'} size={20} className="text-primary" />
                  <h3 className="text-xl font-bold text-foreground">DONATE</h3>
                </div>

                <p className="text-muted-foreground text-sm mb-6">
                  Your generosity helps us build leaders for tomorrow. Choose a cause: Skills, Education, or Sports and decide how you’d like to give.
                </p>

                <Link
                  href="/support/donate"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  DONATE NOW
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* SPONSOR */}
            <div className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-border hover:border-primary transition-all hover:shadow-lg">
              <div className="relative h-64 text-white hover:text-primary overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1773143614/Sponsors_fm6ql3.svg"
                  alt="Sponsor"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-center px-6
                    opacity-70 group-hover:opacity-100
                    transition-opacity duration-700 ease-in-out">

                    <div className="">
                      <h4 className=" text-3xl font-[700] mb-2">GIVES HOPE</h4>
                    </div>

                  </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <IconRenderer icon={'https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617667/Sponsor_1_goyphq.svg'} size={20} className="text-primary" />
                  <h3 className="text-xl font-bold text-foreground">SPONSOR</h3>
                </div>

                <p className="text-muted-foreground text-sm mb-6">
                  Sponsor tools, materials, or experiences. Each contribution directly supports a boy’s journey toward growth and independence.
                </p>

                <Link
                  href="/support/sponsor"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  SPONSOR AN ITEM
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* VOLUNTEER */}
            <div className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-border hover:border-primary transition-all hover:shadow-lg">
              <div className="relative h-64 text-white hover:text-primary overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764570531/Education_3_y4l5kp.jpg"
                  alt="Volunteer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-center px-6
                    opacity-70 group-hover:opacity-100
                    transition-opacity duration-700 ease-in-out">

                    <div className="">
                      <h4 className=" text-3xl font-[700] mb-2">TO THE FUTURE</h4>
                    </div>

                  </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <IconRenderer icon={'https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617618/Volunteer_izlode.svg'} size={20} className="text-primary" />
                  <h3 className="text-xl font-bold text-foreground">VOLUNTEER</h3>
                </div>

                <p className="text-muted-foreground text-sm mb-6">
                  The heartbeat of our activities, given the ultimate commitment, your time, skills, and passion to mentor and guide boys.
                </p>

                <Link
                  href="/support/volunteer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  SIGN UP
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-1 ">
        <PublicImpactSection />
      </section>


      <Footer />
    </>
  )
}
