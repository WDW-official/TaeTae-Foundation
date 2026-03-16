
"use client";
import Footer from "@/components/footer";
import Navigation from "@/components/navigation";
import { Montserrat } from "next/font/google";
import { useState } from "react";

type AssessmentKey = "Football" | "Athletics" | "Combat Sports";

const montserrat = Montserrat({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const assessmentData = {
  "Skills Development": {
    title: "Skills Development",
    subtitle: "Based on internationally recognised STEM and technical learning frameworks used in maker education and engineering foundations. Focus areas include problem-solving, systems thinking, creativity, prototyping, electronics, robotics, and digital literacy. Practical assessment is conducted through project-based challenges aligned with global STEM education models.",
  },

  "Education": {
    title: "Education",
    subtitle: "Cognitive and academic development is guided by recognised educational benchmarks such as the Wechsler Intelligence Scale for Children (WISC-V) for cognitive evaluation and international academic competency frameworks used in mathematics, literacy, and analytical reasoning. Focus areas include memory, reasoning ability, comprehension, processing speed, and critical thinking.",
  },
  Football: {
    title: "Football",
    subtitle: "Training and assessment aligned with FIFA development principles and The Football Association (FA) academy training frameworks. Focus areas include agility, coordination, ball control, tactical awareness, decision-making, and game intelligence.",
  },
  Athletics: {
    title: "Athletics",
    subtitle: "Performance benchmarks based on World Athletics development standards. Training focuses on sprint mechanics, explosive power, endurance development, biomechanics, and speed efficiency.",
  },
  "Combat Sports": {
    title: "Combat Sports Assessment",
    subtitle: "Conditioning and development based on International Boxing Association (IBA) training frameworks and combat sport fundamentals. Focus areas include reflex development, balance, tactical awareness, stamina, discipline, and mental resilience.",
  },
};


const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#4aa344" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#4aa344" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#4aa344" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-7">
      <div className="flex-1 h-px bg-linear-to-r from-transparent dark:to-primary to-gray-900" />
      <span className="dark:text-primary text-gray-900 uppercase tracking-[0.2em] text-[10px] md:text-3xl font-bold whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-linear-to-l from-transparent dark:to-primary to-gray-900" />
    </div>
  );
}

export default function TaeTaeFoundationPage() {

  const [activeTab, setActiveTab] =
    useState<AssessmentKey>("Athletics");

  return (
    <main className="bg-secondary dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <div className="min-h-screen container mx-auto  pt-20 ">

        <div className="mx-auto">

          {/* -------------------------
              OPERATIONAL PHILOSOPHY
          -------------------------- */}

          <div className="px-6 pt-7">

            <section className="relative  bg-black/1 mb-20 rounded-2xl md:py-24 py-10 overflow-hidden">

              {/* TEXT */}
              <div className="relative z-10 mx-auto px-">
                <h1 className={`${montserrat.className} md:text-7xl text-gray-900 dark:text-white text-[40px] font-black uppercase leading-[1.05]`}>
                  OUR OPERATIONAL <br /> <span className="text-primary">PHILOSOPHY</span> 
                </h1>

                <p className="mt-6 text-lg  max-w-xl leading-relaxed">
                  At TaeTae Foundation, we focus on practical education,
                  skill-building, and teamwork through sports, vocational
                  exposure, and structured mentorship.
                </p>

                <p className="mt-4 text-lg  max-w-xl leading-relaxed">
                  Each program is designed to shape a well-rounded young man
                  who is physically capable, intellectually curious, and
                  prepared to contribute meaningfully to society.
                </p>
              </div>

              {/* IMAGE */}
              <img
                src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1773365282/Empowering_The_Ecosystem_g40vqv.svg"
                alt=""
                className="absolute right-0 top-0 rounded-2xl h-full w-[60%] object-cover 
                mask-[linear-gradient(to_left,black,transparent)]"
              />

            </section>

            <Divider label="The 4-Step Development Pipeline" />

            <div className="grid grid-cols-[1fr_26px_1fr] grid-rows-[auto_26px_auto]">

              {/* STEP 1 */}
              <PipelineCard
                number="1"
                title="Identification & Partnership"
                text="We partner with existing institutions, government schools, football teams and athletics groups where boys already show potential."
              />

              <div className="flex items-center justify-center">
                <ChevronRight />
              </div>

              {/* STEP 2 */}
              <PipelineCard
                number="2"
                title="Engagement & Evaluation"
                text="Working with local coaches we conduct structured physical and cognitive assessments tailored to each discipline."
              />

              <div className="flex items-center justify-center">
                <ChevronDown />
              </div>

              <div />

              <div className="flex items-center justify-center">
                <ChevronDown />
              </div>

              {/* STEP 3 */}
              <PipelineCard
                number="3"
                title="Benchmarking"
                text="Performance is measured against internal and international standards to identify exceptional potential."
              />

              <div className="flex items-center justify-center">
                <ChevronRight />
              </div>

              {/* STEP 4 */}
              <PipelineCard
                number="4"
                title="Selection & Pathways"
                text="Promising participants enter TaeTae Foundation development pathways with mentorship and training."
              />

            </div>

          </div>

          <div className="h-px bg-linear-to-r from-transparent via-[#4aa34440] to-transparent my-10" />

          {/* -------------------------
              EMPOWERING ECOSYSTEM
          -------------------------- */}

          <div className="px-6">

            <section className="relative mb-20 bg-black/1 rounded-2xl md:py-24 py-10 overflow-hidden">

              {/* TEXT */}
              <div className="relative z-10  mx-auto px-">
                <h1 className={`${montserrat.className} md:text-7xl text-gray-900 dark:text-white text-[34px] font-black uppercase leading-[1.05]`}>
                  Empowering <br /> The <span className="text-primary">Ecosystem </span> 
                </h1>

                <p className="mt-6 text-lg  max-w-xl leading-relaxed">
                  Our impact extends beyond the participants.
                </p>
                <p className="mt-6 text-lg  max-w-xl leading-relaxed">
                  By engaging local and international experts we strengthen the
                  capabilities of facilitators, coaches and mentors.
                </p>

                <p className="mt-4 text-lg  max-w-xl leading-relaxed">
                  This collaborative model builds a wider network of skilled leaders
                  and stronger community structures.
                </p>
              </div>

              {/* IMAGE */}
              <img
                src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1773140390/WhatsApp_Image_2026-03-09_at_10.20.02_PM_ahkda2.svg"
                alt=""
                className="absolute right-0 rounded-2xl top-0 h-full w-[60%] object-cover 
                mask-[linear-gradient(to_left,black,transparent)]"
              />

            </section>

            <Divider label="The key Elements of our ecosystem" />

            <div className="relative mb-20">

              {/* HUB */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10">

                <div className="flex items-center gap-2">
                  <ChevronLeft />

                  <img
                    src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1773365279/Icon_1_wshkcw.svg"
                    alt="hub"
                    className="md:w-28 w-20 h-20 md:h-28"
                  />

                  <ChevronRight />
                </div>

              </div>

              {/* CARDS */}
              <div className="grid grid-cols-2 gap-3 md:gap-16">

                <EcoCard
                  title="Local Coaches & Facilitators"
                  text="Enhanced curriculum and tools to instruct fundamental skills."
                />

                <EcoCard
                  title="International Experts"
                  text="Global best practices, specialized techniques and mentorship."
                />

                <EcoCard
                  title="Vocational Mentors"
                  text="Workshops focusing on technical, mechanical and creative trades."
                />

                <EcoCard
                  title="Health Organizations"
                  text="Nutritional support and health management for growing boys."
                />

              </div>

            </div>

            <Divider label="Assessment & Testing" />

            {/* TABS */}

            <div className="flex gap-2 mb-4">

              {(["Skills Development","Education", "Football","Athletics", "Combat Sports"] as AssessmentKey[]).map(tab => {

                const on = activeTab === tab;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`md:px-4 md:py-2 px-2 py-1 rounded-lg text-[10px] md:text-lg transition-all
                      ${on
                        ? "bg-[#4aa34433] border border-primary text-primary"
                        : "bg-white/5 border border-gray-900 dark:border-white/10 dark:text-white/60"
                      }`}
                  >
                    {tab}
                  </button>
                );
              })}

            </div>

            {/* ASSESSMENT CARD */}

            {(() => {

              const d = assessmentData[activeTab];

              return (
                <div className="border border-[#4aa34466] rounded-xl
                bg-linear-to-br from-[#152b1f] to-[#131c23] p-5">

                  <h4 className="text-primary md:text-3xl  uppercase text-sm font-bold mb-2">
                    {d.title}
                  </h4>

                  <p className="text-sm md:text-2xl mb-3 text-white/80">
                    {d.subtitle}
                  </p>

                  {/* {d.tests.map((t) => (
                    <p key={t.label} className="text-xs md:text-xl text-white/70 mb-1">
                      <span className="font-semibold text-white">
                        {t.label}:
                      </span>{" "}
                      {t.detail}
                    </p>
                  ))} */}

                  

                </div>
              );

            })()}

            <div className="h-10" />

          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function PipelineCard({number,title,text}:{number:string,title:string,text:string}) {
  return (
    <div className="bg-linear-to-br from-[#15232b] to-[#131c23]
      border border-[#4aa34466] rounded-lg p-2">

      <div className="flex items-center gap-3 mb-3">

        <div className="w-7 h-7 rounded-full
        bg-[#4aa34426] border border-primary
        flex items-center justify-center text-[10px] text-primary font-bold">
          {number}
        </div>

        <p className="uppercase text-primary md:text-3xl text-[12px] font-bold leading-tight">
          {title}
        </p>

      </div>

      <p className="md:text-2xl text-sm text-white/70 leading-relaxed">
        {text}
      </p>

    </div>
  );
}

function EcoCard({title,text}:{title:string,text:string}) {
  return (
    <div className="bg-linear-to-br from-[#15232b] to-[#131c23]
    border border-[#4aa34466] rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <p className="uppercase text-primary md:text-3xl text-sm font-bold mb-2">
          {title}
        </p>
      </div>

      <p className="md:text-2xl text-sm text-white/70 leading-relaxed">
        {text}
      </p>

    </div>
  );
}
