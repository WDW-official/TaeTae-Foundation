"use client"

import Footer from "@/components/footer"
import PDFViewer from "@/components/PDFViewer"
import Navigation from "@/components/navigation"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <main className="bg-secondary dark:bg-gray-900 ">
      
      <Navigation />

      <div className="container mx-auto pt-20 px-4">
        <div className="mx-auto">

          <section className="relative mb-10 rounded-2xl md:py-14 py-10 overflow-hidden">

            {/* 🔥 TITLE */}
            <div className="relative z-10 mx-auto">
              <h1 className="font-heading md:text-7xl text-center text-gray-900 dark:text-white text-[40px] font-black uppercase leading-[1.05]">
                The <span className="text-primary">Plan</span>
              </h1>

              {/* 🔼 TEXT ABOVE PDF */}
              <p className="md:text-3xl mx-5 text-sm mt-4 text-center text-gray-900 dark:text-white font-medium leading-[1.2]">
                Below is a comprehensive outline of our 5 year plan for development of 2500+ of the most talented boys in Lagos, whilst upskilling 100+ volunteers, coaches, facilitators and mentors.
              </p>
            </div>

            {/* 📄 PDF VIEWER */}
            <div className="w-full h-[70vh] md:h-[85vh] mt-8 rounded-2xl overflow-auto shadow-2xl border border-gray-200 dark:border-gray-800">
              <PDFViewer src="/The TaeTae Foundation Profile 2026..pdf" />
            </div>

            {/* 🔽 TEXT BELOW PDF */}
            <p className="md:text-3xl mx-5 text-sm mt-6 text-center text-gray-900 dark:text-white font-light leading-[1.2]">
              We don't claim to know it all, but we believe collaboration will be key to the success of this initiative. If you would like to reach out, feel free.
            </p>

            {/* 🔘 CTA */}
            <div className="text-center md:mb-10 mb-1 mt-6 md:mt-12">
              <Link
                href="/contact"
                className="inline-flex uppercase items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a8d4f] transition"
              >
                Contact Us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}