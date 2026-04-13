"use client"

import type React from "react"

import { useState, Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import IconRenderer from "@/components/icon-renderer"
import BackButton from "@/components/backButton"
import { generateDonationToken } from "@/lib/token"
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels"

ChartJS.register(CategoryScale,ChartDataLabels, LinearScale, ArcElement, BarElement, Tooltip, Legend);


function DonateContent() {
  const searchParams = useSearchParams()
  const [stats, setStats] = useState<any>(null);
  const program = searchParams?.get("program")
  const donationToken = generateDonationToken()
  const [showModal, setShowModal] = useState(false)

  const [step, setStep] = useState(1)
  const [selectedProgram, setSelectedProgram] = useState(program || "skills")
  const [donationMode, setDonationMode] = useState("known")
  const [paymentMethod, setPaymentMethod] = useState("paystack")
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [dataReady, setDataReady] = useState(false)
  const [duration, setDuration] = useState<"one-time" | "monthly" | "quarterly">("one-time")
  const suggestedAmounts = {
  "one-time": paymentMethod === "paystack"
    ? [50000, 100000, 200000]
    : [50, 100, 200],

  monthly: paymentMethod === "paystack"
    ? [2000, 5000, 10000]
    : [5, 10, 20],

  quarterly: paymentMethod === "paystack"
    ? [5000, 15000, 30000]
    : [15, 30, 60],
}
const reminderToken = generateDonationToken()

useEffect(() => {
    fetchPublicStats();
  }, []);

  async function fetchPublicStats() {
  const res = await fetch("/api/public/stats")
  const data = await res.json()

  setStats({
    donationsByProgram: {
      skills: data?.donationsByProgram?.skills || 0,
      education: data?.donationsByProgram?.education || 0,
      sports: data?.donationsByProgram?.sports || 0,
    },
  })
  const formatted = {
    donationsByProgram: {
      skills: data?.donationsByProgram?.skills || 0,
      education: data?.donationsByProgram?.education || 0,
      sports: data?.donationsByProgram?.sports || 0,
    },
  }

  setStats(formatted)
  setDataReady(true)
}

useEffect(() => {
  if (!dataReady || !stats) return

  const entries = Object.entries(stats.donationsByProgram) as [string, number][]

  if (!entries.length) return

  const lowest = entries.reduce((min, curr) =>
    curr[1] < min[1] ? curr : min
  )[0]

  if (lowest) {
    setShowSupportModal(true)
  }
}, [dataReady, stats])
const nextDate = new Date()
const donationPieData = {
  labels: ["Skills", "Education", "Sports"],
  datasets: [
    {
      data: [
        stats?.donationsByProgram?.skills || 0,
        stats?.donationsByProgram?.education || 0,
        stats?.donationsByProgram?.sports || 0,
      ],
      backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      borderWidth: 0,
      hoverOffset: 15,
    },
  ],
}

const lowestTrack = stats
  ? (Object.entries(stats.donationsByProgram) as [string, number][])
      .reduce((min, curr) => (curr[1] < min[1] ? curr : min))[0]
  : null
const formattedTrack =
  lowestTrack
    ? lowestTrack.charAt(0).toUpperCase() + lowestTrack.slice(1)
    : ""
useEffect(() => {
  if (showModal) {
    const timer = setTimeout(() => {
      setShowModal(false)
    }, 6000) // 3 seconds

    return () => clearTimeout(timer)
  }
}, [showModal])


if (duration === "monthly") {
  nextDate.setMonth(nextDate.getMonth() + 1)
}

if (duration === "quarterly") {
  nextDate.setMonth(nextDate.getMonth() + 3)
}

  const programs = [
    { 
      name: "Skills", 
      description: "STEM, Media, Engineering, and Carpentry",
      icon: 'https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617664/Skills_djsoom.svg'
    },
    { 
      name: "Education", 
      description: "Maths, Science, Problem Solving",
      icon: 'https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617633/Education_cwwvkm.svg'
    },
    { 
      name: "Sports", 
      description: "Football, Boxing, Taekwondo, and Track ",
      icon: 'https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617632/Ball_Icon_shxgfx.svg'
    },
]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const isLocalGateway = paymentMethod === "paystack" || paymentMethod === "kora" || paymentMethod === "paypal"
      const currency = isLocalGateway ? "NGN" : "USD"
      if (isLocalGateway) {
        const checkoutPayload = {
            program: selectedProgram,
            name: donationMode === "anonymous" ? "Anonymous" : name,
            email,
            amount: amount,
            mode: "donation",
            paymentMethod,
            donationMode,
            currency,
            message,
            duration,
            reminderToken,
            reminderTokenExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),

            nextDonationDate: nextDate,

            reminder3Sent: false,
            reminder1Sent: false
          }

        const checkoutRes = await fetch("/api/checkout-drafts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "donation",
            provider: paymentMethod,
            payload: checkoutPayload,
          }),
        })

        const checkoutData = await checkoutRes.json()

        if (!checkoutRes.ok || !checkoutData.checkoutId) {
          throw new Error(checkoutData.error || "Failed to start checkout")
        }

      // Redirect to unified checkout page
      if (paymentMethod === "paystack") {
        window.location.href = `/checkout-paystack?checkoutId=${checkoutData.checkoutId}`
        return
      }

      if (paymentMethod === "kora") {
        window.location.href = `/checkout-kora?checkoutId=${checkoutData.checkoutId}`
        return
      }

        if (paymentMethod === "paypal") {
          window.location.href = `/checkout-paypal?checkoutId=${checkoutData.checkoutId}`
          return
        }
    }
    } catch (error) {
      console.error("Error:", error)
      alert("Error processing donation")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const firstSuggested = suggestedAmounts[duration][0]
    setAmount(firstSuggested.toString())
  }, [duration])

  return (
    <div className="max-w-2xl min-h-screen dark:bg-gray-900 mx-auto px-4 py-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        {/* LOGO */}
        <Link
          href="/"
          className="flex p-1 bg-white border dark:border-white dark:bg-gray-900 rounded-full  items-center"
        >
          {/* Logo for light mode */}
          <img
            src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764783363/Tae_Tae_2_a52zrp.svg"
            alt="TaeTae Foundation Logo"
            className="md:h-10 pr-1 h-8 w-auto dark:hidden"  // This will hide in dark mode
          />
          
          {/* Logo for dark mode */}
          <img
            src="/Tae-Tae-logo.png"
            alt="TaeTae Foundation Logo"
            className="md:h-10 pr-1 h-8 w-auto hidden dark:block"  // This will show only in dark mode
          />
        </Link>
        <BackButton label="Back"/>
      </div>

      <h1 className="text-4xl text-center font-bold uppercase text-primar mb-2">Make a <span className="text-primary dark:text-[#8bc97f]">Donation</span></h1>
      <p className="text-foreground text-base text-center mb-3">Provide your details to make a meaningful contribution.</p>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3 mb-4 md:mb-8">
        {/* Text */}
        <p className="text-sm text-gray-500">
          Step {step} of 3
        </p>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`w-1 h-1 rounded-full transition ${
                s === step
                  ? "bg-primary scale-110"
                  : "bg-gray-400 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Choose Program */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white"> Choose a Program</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {programs.map((prog) => (
                <button
                  key={prog.name}
                  type="button"
                  onClick={() => setSelectedProgram(prog.name.toLowerCase())}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedProgram === prog.name.toLowerCase()
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <IconRenderer icon={prog.icon} size={16} className="text-primary" />
                    <div className="font-bold uppercase text-primary">{prog.name}</div>
                  </div>
                    <div className="text-[13px] font-light">{prog.description}</div>
                  {/* <div className="text-sm text-foreground">Select this program</div> */}
                </button>

              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Continue
            </button>
                <div className="text-centere">
                Your donation will be distributed as required into your chosen track.
                </div>
            <div className="bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Donation Distribution</h3>
                </div>
                <div className="h-80 flex items-center justify-center">
                  {stats ? (
                    <Pie 
                      data={donationPieData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              padding: 20,
                              font: {
                                size: 13,
                              }
                            }
                          },
                          datalabels: {
                            color: "#fff",
                            font: {
                              weight: "bold",
                              size: 14,
                            },

                            formatter: (value: number) => {
                              return value.toLocaleString()
                            },
                          },
                          tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            cornerRadius: 8,
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="text-sm text-gray-500">Loading chart...</div>
                  )}
                </div>
              </div>
          </div>
        )}

        {/* Step 2: Donation Mode & Amount */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Donation Details</h2>
            {/* Donation Duration Toggle */}
            <div className="fle justify-center">
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 w-full ">

                <button
                  type="button"
                  onClick={() => setDuration("one-time")}
                  className={`flex-1 px-4 py-2 text-sm font-semibold rounded-full transition ${
                    duration === "one-time"
                      ? "bg-white dark:bg-gray-900 shadow text-primary"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  One Time
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDuration("monthly")
                    setShowModal(true)
                  }}
                  className={`flex-1 px-4 py-2 text-sm font-semibold rounded-full transition ${
                    duration === "monthly"
                      ? "bg-white dark:bg-gray-900 shadow text-primary"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  Monthly
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDuration("quarterly")
                    setShowModal(true)
                  }}
                  className={`flex-1 px-4 py-2 text-sm font-semibold rounded-full transition ${
                    duration === "quarterly"
                      ? "bg-white dark:bg-gray-900 shadow text-primary"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  Quarterly
                </button>

              </div>
            </div>
            {showModal && duration !== "one-time" && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">

                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setShowModal(false)}
                />

                {/* Modal */}
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-[90%] max-w-md shadow-xl text-center animate-scale-in">
                  
                  <h3 className="text-lg font-bold mb-2 text-primary">
                    Recurring Donation
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    For routine donations we will simply give you two gentle reminders before your next 
                    <span className="font-semibold"> {duration}</span> donation.
                  </p>

                  {/* Optional close */}
                  <button
                    onClick={() => setShowModal(false)}
                    className="mt-4 text-sm text-primary underline"
                  >
                    Got it
                  </button>
                </div>
              </div>
            )}
            <label className="block text-foreground font-semibold mb-3">Pay With</label>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4">

              {/* Paystack */}
              <button
                type="button"
                onClick={() => setPaymentMethod("paystack")}
                className={`relative md:p-3 p-1 rounded-lg md:rounded-xl border-2 transition-all text-left group
                  ${
                    paymentMethod === "paystack"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary hover:shadow-sm"
                  }`}
              >
                {paymentMethod === "paystack" && (
                  <span className="absolute right-3 text-primary text-sm font-semibold">
                    ✓
                  </span>
                )}

                <div className="flex items-center gap-1 md:gap-3 ">
                  <img
                    src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1774481327/Paystack_ocqxrn.svg"
                    alt="Paystack"
                    className="md:h-6 h-3 w-auto"
                  />
                  <span className="font-semibold text-[11px] md:text-lg">Paystack</span>
                </div>
                  <span className="font-semibold ml-4 md:ml-10 text-[11px] md:text-lg">(NGN)</span>
              </button>

              {/* Kora */}
              <button
                type="button"
                onClick={() => setPaymentMethod("kora")}
                className={`relative md:p-3 p-1 rounded-lg md:rounded-xl border-2 transition-all text-left group
                  ${
                    paymentMethod === "kora"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary hover:shadow-sm"
                  }`}
              >
                {paymentMethod === "kora" && (
                  <span className="absolute right-3 text-primary text-sm font-semibold">
                    ✓
                  </span>
                )}

                <div className="flex items-center gap-1 md:gap-3 ">
                  <img
                    src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1774481327/Korapay_femvsw.svg"
                    alt="Kora"
                    className="md:h-6 h-3 w-auto"
                  />
                  <span className="font-semibold text-[11px] md:text-lg">Kora</span>
                </div>
                <span className="font-semibold ml-2 md:ml-6 text-[11px] md:text-lg">(USD)</span>
              </button>

              {/* PayPal */}
              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={`relative md:p-3 p-1 rounded-lg md:rounded-xl border-2 transition-all text-left group
                  ${
                    paymentMethod === "paypal"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary hover:shadow-sm"
                  }`}
              >
                {paymentMethod === "paypal" && (
                  <span className="absolute right-3 text-primary text-sm font-semibold">
                    ✓
                  </span>
                )}

                <div className="flex items-center gap-1 md:gap-3">
                  <img
                    src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1774481327/paypal_rwadmf.svg"
                    alt="PayPal"
                    className=" md:h-6 h-3 w-auto"
                  />
                  <span className="font-semibold text-[11px] md:text-lg">PayPal</span>
                </div>
                <span className="font-semibold ml-4 md:ml-10 text-[11px] md:text-lg">(USD)</span>
              </button>

            </div>

            <div>
              <label className="block text-foreground font-semibold mb-3">How would you like to appear?</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="known"
                    checked={donationMode === "known"}
                    onChange={(e) => setDonationMode(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>Known (your name will appear)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="anonymous"
                    checked={donationMode === "anonymous"}
                    onChange={(e) => setDonationMode(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>Anonymous</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-2">Donation Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={paymentMethod === "paystack" ? "50000 NGN" : "100 USD"}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {paymentMethod === "paystack" ? "Amount in Nigerian Naira (NGN)" : "Amount in US Dollars (USD)"}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestedAmounts[duration].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt.toString())}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition ${
                    amount === amt.toString()
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {paymentMethod === "paystack" ? `₦${amt.toLocaleString()}` : `$${amt.toLocaleString()}`}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground ">
              Suggested for {duration.replace("-", " ")} donations
            </p>
            <div>
              <label className="block text-foreground font-semibold mb-2">Message (Optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Why is this cause important to you?"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment Method Selection */}
        {/* {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Step 3: Choose Payment Method</h2>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("kora")}
                className={`p-2 rounded-lg border-2 transition text-center ${
                  paymentMethod === "kora" ? "border-primary bg-primary/5" : "border-border hover:border-primary"
                }`}
              >
                <div className="font-bold text-lg text-primary mb-2">kora</div>
                <div className="text-sm text-foreground">Credit/Debit Card (USD)</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("paystack")}
                className={`p-2 rounded-lg border-2 transition text-center ${
                  paymentMethod === "paystack" ? "border-primary bg-primary/5" : "border-border hover:border-primary"
                }`}
              >
                <div className="font-bold text-lg text-primary mb-2">Paystack</div>
                <div className="text-sm text-foreground">Card/Bank Transfer (NGN)</div>
              </button>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Continue
              </button>
            </div>
          </div>
        )} */}

        {/* Step 4: Confirmation */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white"> Confirm & Donate</h2>

            {donationMode === "known" && (
              <>
                <div>
                  <label className="block text-foreground font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

              </>
            )}
            <div>
              <label className="block text-foreground font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="bg-secondary dark:bg-gray-800 p-6 rounded-lg border border-border">
              <h3 className="font-bold text-primary mb-3">Donation Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Program:</span>
                  <span className="font-semibold text-foreground">
                    {selectedProgram.charAt(0).toUpperCase() + selectedProgram.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-semibold text-foreground">
                    {paymentMethod === "paystack" ? `₦${amount}` : `$${amount}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-semibold text-foreground capitalize">
                    {duration.replace("-", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-foreground">
                    {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Appearing as:</span>
                  <span className="font-semibold text-foreground">
                    {donationMode === "anonymous" ? "Anonymous" : "Named"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </div>
        )}
      </form>
      {showSupportModal && lowestTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-[90%] max-w-md shadow-xl text-center animate-scale-in">

            <h3 className="text-lg font-bold mb-2 text-primary">
              Support Needed 🙏
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              The <span className="font-semibold">{formattedTrack}</span> track could do with some support.
              <br />
              Please consider making a{" "}
              <span className="font-semibold">{formattedTrack}</span> donation.
              <br />
              Thank you ❤️
            </p>

            <button
              onClick={() => setShowSupportModal(false)}
              className="mt-4 text-sm text-primary underline"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DonateContent />
    </Suspense>
  )
}
