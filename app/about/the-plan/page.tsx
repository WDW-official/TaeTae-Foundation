import Footer from "@/components/footer";
import GoogleSlides from "@/components/GoogleSlides";
import TaetaeLegalComplianceUI from "@/components/legalPage";
import Navigation from "@/components/navigation";
import { ArrowRight } from "lucide-react";
import { Montserrat } from "next/font/google";
import Link from "next/link";

const montserrat = Montserrat({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export default function Page() {
  return (
   <main className="bg-secondary dark:bg-gray-900 overflow-hidden">
        <Navigation />
        <div className=" container mx-auto  pt-20 ">
   
           <div className="mx-auto">
   
            <div className=" pt-3">
   
              <section className="relative  bg-black/1 mb-10 rounded-2xl md:py-14 py-10 overflow-hidden">
   
                 {/* TEXT */}
                 <div className="relative z-10 mx-auto px-">
                   <h1 className={`${montserrat.className} md:text-7xl text-center text-gray-900 dark:text-white text-[40px] font-black uppercase leading-[1.05]`}>
                     The  <span className="text-primary">Plan</span> 
                   </h1>
                   <h1 className=" md:text-3xl mx-5 text-sm mt-3 text-center text-gray-900 dark:text-white font-medium leading-[1.05]">
                    Below is a comprehensive outline of our 5 year plan for development 2500+ of the most talented boys in Lagos. Whilst upskilling 100+ volunteers, coaches, facilitators and mentors
                   </h1>
                </div>
                  <GoogleSlides />
                <h1 className=" md:text-3xl mx-5 text-sm mt-3 text-center text-gray-900 dark:text-white font-light leading-[1.05]">
                  We don't claim to know it all, but we believe collaboration will be key to the success of this initiative, if you would like reach out feel free.
                </h1>
                <div className="text-center md:mb-10 mb-1 mt-5 md:mt-12">
                  <Link
                    href="/contact"
                    className="inline-flex uppercase items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a8d4f] transition"
                  >
                    Contact Us <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                {/* <TaetaeLegalComplianceUI/> */}
              </section>
            </div>
          </div>
        </div>
        <Footer/>
    </main>
  );
}