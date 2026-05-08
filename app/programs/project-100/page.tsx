"use client"

import { useEffect, useRef, useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Camera, CheckCircle2, Mail, Phone, Upload, X } from "lucide-react"

const initialForm = {
  childName: "",
  dateOfBirth: "",
  schoolAttended: "",
  guardianName: "",
  guardianPhone: "",
  guardianEmail: "",
  profilePhotoBase64: "",
}

export default function Project100Page() {
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [photoPreview, setPhotoPreview] = useState("")
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState("")
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setIsCameraOpen(false)
  }

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [isCameraOpen])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const setPhoto = (base64: string) => {
    setForm((prev) => ({ ...prev, profilePhotoBase64: base64 }))
    setPhotoPreview(base64)
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhoto(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const startCamera = async () => {
    setCameraError("")

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera capture is not supported on this device. Please upload a photo instead.")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })

      streamRef.current = stream
      setIsCameraOpen(true)
    } catch (error) {
      console.error("Project 100 camera error:", error)
      setCameraError("Camera access was blocked or unavailable. Please allow camera access or upload a photo.")
    }
  }

  const capturePhoto = () => {
    const video = videoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) {
      setCameraError("Camera is still loading. Please try again in a moment.")
      return
    }

    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext("2d")

    if (!context) {
      setCameraError("Could not capture the photo. Please upload an image instead.")
      return
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    setPhoto(canvas.toDataURL("image/jpeg", 0.88))
    stopCamera()
  }

  const clearPhoto = () => {
    setForm((prev) => ({ ...prev, profilePhotoBase64: "" }))
    setPhotoPreview("")
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const response = await fetch("/api/project-100", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.error || "We could not submit this application.")
        return
      }

      setSuccessMessage("Application received. Our team will review the details and follow up.")
      setForm(initialForm)
      setPhotoPreview("")
      stopCamera()
    } catch (error) {
      console.error("Project 100 submission error:", error)
      setErrorMessage("Something went wrong while submitting the application.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ed] text-slate-900 dark:bg-gray-800 dark:text-[#eff5ea]">
      <Navigation />

      <section className="relative overflow-hidden px-4 pb-16 pt-24 md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,167,84,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(10,26,26,0.12),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(139,201,127,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(77,120,90,0.24),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-6 overflow-hidden rounded-4xl border border-[#d9d1bf] shadow-[0_30px_80px_rgba(27,39,23,0.12)] dark:border-[#284133]">
            <div className="relative h-55 md:h-80">
              <img
                src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1777031860/project-100_powpk9.svg"
                alt="Project 100 banner "
                className="h-full w-full object-cover"
              />
              {/* <div className="absolute inset-0 bg-gradient-to-r from-[rgba(10,26,20,0.78)] via-[rgba(10,26,20,0.52)] to-[rgba(10,26,20,0.18)]" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#d5ebba]">
                  Project 100
                </p>
                <h1 className="max-w-3xl text-4xl font-black uppercase leading-none text-white md:text-6xl">
                  Help Us Find The Next 100 Boys.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/85 md:text-base">
                  Submit a potential boy&apos;s details for internal review and future onboarding into TaeTae Foundation.
                </p>
              </div> */}
            </div>
          </div>
          <div className="mb-5 rounded-[1.75rem] border border-[#d9d1bf] bg-[linear-gradient(145deg,rgba(125,167,84,0.14),rgba(255,255,255,0.96))] p-5 shadow-sm dark:border-[#35523f] dark:bg-[linear-gradient(145deg,rgba(97,138,83,0.22),rgba(20,37,29,0.96))] lg:hidden">
            <p className="text-xl font-bold uppercase tracking-[0.3em] text-[#6b8f41] dark:text-[#d8ebb6]">
              About Project 100
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-[#d7e4da]">
              Project 100 is a system designed to identify the boys with the highest
              potential in order to onboard and develop them early. We will be holding
              trials and finals for each Local Government Areas across Lagos.
            </p>
            <div className="mt-4 rounded-2xl border border-[#d9d1bf] bg-white/70 px-4 py-3 dark:border-[#35523f] dark:bg-[#14251d]/80">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b8f41] dark:text-[#d8ebb6]">
                Untapped Potential
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-[#d7e4da]">
                Thousands of boys in Nigeria possess exceptional intellectual and physical
                ability but remain undiscovered.
              </p>
            </div>
          </div>

          <div className="grid gap-4 rounded-4xl border border-[#d9d1bf] bg-white/90 shadow-[0_30px_80px_rgba(27,39,23,0.12)] backdrop-blur dark:border-[#284133] dark:bg-[#0f1d17]/90 md:p-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="hidden rounded-[1.75rem] border border-[#d9d1bf] bg-[linear-gradient(135deg,rgba(125,167,84,0.12),rgba(255,255,255,0.94)),radial-gradient(circle_at_top,rgba(125,167,84,0.18),transparent_35%)] p-6 dark:border-[#35523f] dark:bg-[linear-gradient(135deg,rgba(97,138,83,0.26),rgba(13,29,23,0.96)),radial-gradient(circle_at_top,rgba(139,201,127,0.18),transparent_35%)] md:p-8 lg:block">
              <h1 className="max-w-xl text-4xl font-black uppercase leading-none text-[#6b8f41] dark:text-[#d8ebb6] md:text-6xl">
                About Project 100
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-700 dark:text-[#d7e4da] md:text-base">
                Project 100 is a system designed to identify the boys with the highest potential in
                order to onboard and develop them early. We will be holding trials and finals for
                each Local Government Area across Lagos.
              </p>

              <div className="mt-6 rounded-2xl border border-[#d9d1bf] bg-white/80 p-5 dark:border-[#35523f] dark:bg-[#13261d]/80">
                <h2 className="text-xl font-black uppercase text-[#6b8f41] dark:text-[#d8ebb6]">
                  The boys that are selected will learn:
                </h2>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700 dark:text-[#d7e4da]">
                  <li>- Skills acquisition</li>
                  <li>- Sports</li>
                  <li>- Education</li>
                  <li>- Mentorship</li>
                  <li>- Character and leadership development</li>
                </ul>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[#d9d1bf] bg-white/80 p-5 dark:border-[#35523f] dark:bg-[#13261d]/80">
                  <h2 className="text-xl font-black uppercase text-[#6b8f41] dark:text-[#d8ebb6]">Untapped Potential</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-[#d7e4da]">
                    Thousands of boys in Nigeria possess exceptional intellectual and physical ability
                    but remain undiscovered. Project 100 helps us start identifying them intentionally.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#d9d1bf] bg-white/80 p-5 dark:border-[#35523f] dark:bg-[#13261d]/80">
                  <h2 className="text-xl font-black uppercase text-[#6b8f41] dark:text-[#d8ebb6]">The Objective</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-[#d7e4da]">
                    We must identify and develop 2,500+ boys, with the highest cognitive and physical
                    ceiling over a 5 year period. Starting with 100 boys ages 10 to 14 within the
                    Ikeja and Kosofe LGA.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[#d9d1bf] bg-[#fcfbf8] p-4 dark:border-[#35523f] dark:bg-[#102019] md:p-8">
              <div className="mb-6">
                <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">Submit Details</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-[#c2d2c7]">
                  If you know your boy has the potential, register now.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  ["childName", "Child's Name", "text"],
                  ["dateOfBirth", "Date of Birth", "date"],
                  ["schoolAttended", "School Attended", "text"],
                  ["guardianName", "Parent/Guardian's Name", "text"],
                  ["guardianPhone", "Number", "tel"],
                  ["guardianEmail", "Email", "email"],
                ].map(([name, label, type]) => (
                  <div key={name}>
                    <label className="mb-2 block text-sm font-bold uppercase tracking-[0.15em] text-[#6b8f41]">
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={form[name as keyof typeof form]}
                      onChange={handleChange}
                      required={name !== "schoolAttended"}
                      className={`block w-full min-w-0 max-w-full rounded-2xl border border-[#aab88a] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-[#47624f] dark:bg-[#152820] dark:text-white ${
                        name === "dateOfBirth"
                          ? "appearance-none [-webkit-appearance:none] overflow-hidden pr-3 text-[16px]"
                          : "text-[16px] md:text-sm"
                      }`}
                      style={
                        name === "dateOfBirth"
                          ? {
                              WebkitAppearance: "none",
                              appearance: "none",
                            }
                          : undefined
                      }
                    />
                  </div>
                ))}

                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-[0.15em] text-[#6b8f41]">
                    Child&apos;s Photo
                  </label>

                  <div className="rounded-2xl border border-[#aab88a] bg-white p-4 dark:border-[#47624f] dark:bg-[#152820]">
                    {photoPreview ? (
                      <div className="mb-4 overflow-hidden rounded-xl border border-[#d9d1bf] dark:border-[#35523f]">
                        <img
                          src={photoPreview}
                          alt="Selected child photo preview"
                          className="h-56 w-full object-cover"
                        />
                      </div>
                    ) : null}

                    {isCameraOpen ? (
                      <div className="mb-4 space-y-3">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="h-64 w-full rounded-xl bg-black object-cover"
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={capturePhoto}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-[#5f8141]"
                          >
                            <Camera className="h-4 w-4" />
                            Capture photo
                          </button>
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#aab88a] px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-primary hover:text-primary dark:text-white"
                          >
                            <X className="h-4 w-4" />
                            Cancel camera
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {!photoPreview && !isCameraOpen ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#aab88a] px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-primary hover:text-primary dark:text-white">
                          <Upload className="h-4 w-4" />
                          Upload photo
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handlePhotoUpload}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={startCamera}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#aab88a] px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-primary hover:text-primary dark:text-white"
                        >
                          <Camera className="h-4 w-4" />
                          Snap instantly
                        </button>
                      </div>
                    ) : null}

                    {photoPreview ? (
                      <button
                        type="button"
                        onClick={clearPhoto}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-red-600"
                      >
                        <X className="h-4 w-4" />
                        Remove photo
                      </button>
                    ) : null}

                    {cameraError ? (
                      <p className="mt-3 text-sm leading-6 text-red-600">{cameraError}</p>
                    ) : null}

                    <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-[#c2d2c7]">
                      Upload an existing image or use the device camera to take one now.
                    </p>
                  </div>
                </div>

                {errorMessage ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                ) : null}

                {successMessage ? (
                  <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      {successMessage}
                    </span>
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#5f8141] disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <p className="mt-6 text-xs leading-5 text-slate-500">
                By submitting this form, you are sharing preliminary details for internal review.
                Official enrollment and consent collection happen later.
              </p>

              <div className="mt-6 rounded-2xl border border-[#d9d1bf] bg-white/70 p-4 text-sm text-slate-700 dark:border-[#35523f] dark:bg-[#14251d] dark:text-[#d7e4da] lg:hidden">
                <p className="mt-4 font-semibold uppercase text-[#6b8f41] dark:text-[#d8ebb6]">
                  The Objective
                </p>
                <p className="mt-2">
                  We must identify and develop 2,500+ boys, with the highest cognitive and physical ceiling over a 5 year period. Starting with 100 boys (Ages 10-14) within the Ikeja and Kosofe LGA.
                </p>
              </div>
                
                <p className="mt-4 text-sm font-semibold">
                  NB: We will require valid proof of age for all participants
                </p>
              <Link
                href="/programs"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                Explore our programmes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="mt-8 rounded-3xl bg-[#0d1a14] p-6 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-[#d5ebba]">What Happens Next</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-white/85">
              <li>We receive and review each registration in our intake queue.</li>
              <li>Qualified boys move into trials and finals across Lagos.</li>
              <li>Selected boys continue into full onboarding and development.</li>
            </ul>

            <div className="mt-6 flex flex-col gap-3 text-sm text-white/90">
              <a href="tel:+2349040000551" className="inline-flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#d5ebba]" />
                <span>+234 (904) 0000 551</span>
              </a>
              <a href="mailto:info@taetaefoundation.org" className="inline-flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#d5ebba]" />
                <span>info@taetaefoundation.org</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
