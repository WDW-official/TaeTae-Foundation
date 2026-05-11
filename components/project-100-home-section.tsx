import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Project100Progress from "@/components/Project100Progress"

export default function Project100HomeSection() {
  return (
    <section className="bg-card px-4 py-12 dark:bg-gray-800 md:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="overflow-hidden rounded-3xl border border-[#d9d1bf] bg-white shadow-[0_24px_70px_rgba(27,39,23,0.12)] dark:border-[#35523f] dark:bg-gray-900">
          <img
            src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1777031860/project-100_powpk9.svg"
            alt="Project 100"
            className="h-full min-h-[280px] w-full object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary dark:text-[#8bc97f]">
            Project 100
          </p>
          <h2 className="mt-3 uppercase font-heading text-4xl font-extrabold leading-tight text-gray-900 dark:text-white md:text-4xl">
            Help us find the next 100 boys.
          </h2>
          <p className="mt-5 text-base leading-7 text-gray-700 dark:text-gray-300 md:text-lg">
            Project 100 is our intake system for identifying boys with strong cognitive and physical potential, then moving them toward trials, onboarding, mentorship, education, skills, and sports development.
          </p>

          <div className="mt-6 grid gap-3 text-sm text-gray-700 dark:text-gray-300 sm:grid-cols-2">
            {["Open public nominations", "Trials and finals across Lagos", "Full onboarding for selected boys", "Long-term development support"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary dark:text-[#8bc97f]" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* <Project100Progress raised={0} compact className="mt-6" /> */}

          <Link
            href="/programs/project-100"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#5f8141]"
          >
            Go to Project 100
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
