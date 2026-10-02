"use client"

import { useMemo, useState } from "react"
import { Calendar, Camera, ChevronLeft, ChevronRight, Image as ImageIcon, X } from "lucide-react"
import { motion } from "framer-motion"
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"
import { cn } from "@/lib/utils"

type GalleryItem = {
  id: string
  title: string
  category: "Education" | "Sports" | "Skills" | "Mentorship" | "Community"
  src: string
  description: string
  date?: string
  accent: string
}

const activityImages = [
  "v1790895790/IMG_1744_1_ktzhjj.heic",
  "v1790895788/IMG_1473_nbcyyo.heic",
  "v1790895786/IMG_1690_xmuadq.heic",
  "v1790895785/IMG_1470_gt3mzn.heic",
  "v1790895784/IMG_1696_uvct68.heic",
  "v1790895784/IMG_1698_wqo36x.heic",
  "v1790895783/IMG_0227_px3ii0.heic",
  "v1790895781/IMG_1719_1_f7n238.heic",
  "v1790895782/IMG_1689_zddqof.heic",
  "v1790895781/IMG_1736_1_nrpwfh.heic",
  "v1790895779/IMG_1721_1_ldcu7r.heic",
  "v1790895779/IMG_1713_1_noamqz.heic",
  "v1790895778/IMG_1708_1_or1o7w.heic",
]

const accents = ["bg-sky-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"]

const galleryItems: GalleryItem[] = activityImages.map((image, index) => ({
  id: image,
  title: `Activity Moment ${index + 1}`,
  category: "Community",
  src: `https://res.cloudinary.com/dx3zrhslt/image/upload/f_jpg,q_auto,c_limit,w_1600/${image}`,
  description: "A moment from TaeTae Foundation activities.",
  accent: accents[index % accents.length],
}))

const filters = ["All", "Community"] as const

const categoryCopy: Record<GalleryItem["category"], string> = {
  Education: "Learning Moments",
  Sports: "Sports & Teamwork",
  Skills: "Skills Workshops",
  Mentorship: "Mentorship",
  Community: "Community",
}

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All")
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const filteredItems = useMemo(() => {
    if (activeFilter === "All") return galleryItems
    return galleryItems.filter((item) => item.category === activeFilter)
  }, [activeFilter, galleryItems])

  const selectedItem = selectedIndex === null ? null : filteredItems[selectedIndex]

  const goToPrevious = () => {
    setSelectedIndex((current) => {
      if (current === null) return null
      return current === 0 ? filteredItems.length - 1 : current - 1
    })
  }

  const goToNext = () => {
    setSelectedIndex((current) => {
      if (current === null) return null
      return current === filteredItems.length - 1 ? 0 : current + 1
    })
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white text-gray-950 dark:bg-gray-900 dark:text-white">
      <Navigation />

      <section className="relative pt-28 pb-12 md:pt-32 md:pb-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(120,157,98,0.18),rgba(72,124,63,0.04)_38%,rgba(251,191,36,0.12)_100%)] dark:bg-[linear-gradient(135deg,rgba(120,157,98,0.2),rgba(15,23,42,0.15)_42%,rgba(56,189,248,0.1)_100%)]" />
        <div className="container relative mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm dark:bg-gray-950/50">
                <Camera className="h-4 w-4" />
                TaeTae Foundation Gallery
              </div>
              <h1 className="font-heading text-4xl font-extrabold leading-tight text-gray-950 dark:text-white md:text-6xl">
                Moments from our activities
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-700 dark:text-gray-300 md:text-lg">
                A visual story of learning, mentorship, sports, practical skills, and community moments shaping boys into confident young men.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="grid grid-cols-3 gap-3"
            >
              {galleryItems.slice(0, 3).map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "overflow-hidden rounded-lg border border-white/70 bg-white shadow-xl dark:border-white/10 dark:bg-gray-800",
                    index === 1 ? "mt-8" : "mb-8"
                  )}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="h-44 w-full object-cover md:h-64"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50 py-5 dark:border-gray-800 dark:bg-gray-950/35">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "shrink-0 rounded-full border px-5 py-2 text-sm font-semibold transition",
                  activeFilter === filter
                    ? "border-primary bg-primary text-white shadow-md"
                    : "border-gray-200 bg-white text-gray-700 hover:border-primary/50 hover:text-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 dark:bg-gray-900 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-950 dark:text-white md:text-4xl">
                Activity Highlights
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 md:text-base">
                {filteredItems.length} image{filteredItems.length === 1 ? "" : "s"} in view
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground dark:bg-gray-800 dark:text-gray-200">
              <ImageIcon className="h-4 w-4 text-primary" />
              Our activities in pictures
            </div>
          </div>

          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {filteredItems.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.24) }}
                onClick={() => setSelectedIndex(index)}
                className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    className={cn(
                      "w-full object-cover transition duration-500 group-hover:scale-105",
                      index % 5 === 0 ? "h-80" : index % 3 === 0 ? "h-64" : "h-56"
                    )}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/20 to-transparent p-4">
                    <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-900">
                      {categoryCopy[item.category]}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className={cn("mb-3 h-1 w-12 rounded-full", item.accent)} />
                  <h3 className="text-lg font-bold text-gray-950 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center dark:border-gray-700 dark:bg-gray-950">
              <ImageIcon className="mx-auto mb-4 h-10 w-10 text-primary" />
              <h3 className="text-xl font-bold">No images in this category yet</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">New activity images will appear here when they are uploaded.</p>
            </div>
          )}
        </div>
      </section>

      {selectedItem && (
        <div className="fixed inset-0 z-[80] bg-black/90 p-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close image preview"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mx-auto flex h-full max-w-6xl flex-col justify-center gap-5">
            <div className="relative flex min-h-0 items-center justify-center">
              <button
                type="button"
                onClick={goToPrevious}
                className="absolute left-0 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 md:inline-flex"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <img
                src={selectedItem.src}
                alt={selectedItem.title}
                className="max-h-[74vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              />

              <button
                type="button"
                onClick={goToNext}
                className="absolute right-0 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 md:inline-flex"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="mx-auto w-full max-w-3xl rounded-lg bg-white p-5 text-gray-950 dark:bg-gray-900 dark:text-white">
              <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-primary">
                <span>{categoryCopy[selectedItem.category]}</span>
                {selectedItem.date && (
                  <span className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    {new Date(selectedItem.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-2xl font-bold">{selectedItem.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{selectedItem.description}</p>

              <div className="mt-4 flex gap-3 md:hidden">
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 font-semibold dark:border-gray-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
