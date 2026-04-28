import Link from "next/link"
import { ArrowLeft, Home, SearchX } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white pt-24 text-gray-950 dark:bg-gray-900 dark:text-white">
        <section className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-16 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary dark:text-[#8bc97f]">
              <SearchX className="h-4 w-4" />
              Page not found
            </div>

            <h1 className=" text-4xl font-bold leading-tight md:text-6xl">
              This link does not look right.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-gray-600 dark:text-gray-300 md:text-lg">
              The page may have moved, been removed, or the address may have been typed incorrectly.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                <Home className="h-4 w-4" />
                Go home
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:border-primary hover:text-primary dark:border-gray-700 dark:text-white dark:hover:border-[#8bc97f] dark:hover:text-[#8bc97f]"
              >
                <ArrowLeft className="h-4 w-4" />
                View programs
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
