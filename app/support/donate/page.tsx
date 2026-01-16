"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import IconRenderer from "@/components/icon-renderer"
import BackButton from "@/components/backButton"

function DonateContent() {
  const searchParams = useSearchParams()
  const program = searchParams.get("program")

  const [step, setStep] = useState(1)
  const [selectedProgram, setSelectedProgram] = useState(program || "skills")
  const [donationMode, setDonationMode] = useState("known")
  const [paymentMethod, setPaymentMethod] = useState("paystack")
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const programs = [
    { 
      name: "Skills", 
      icon: 'https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617664/Skills_djsoom.svg'
    },
    { 
      name: "Education", 
      icon: 'https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617633/Education_cwwvkm.svg'
    },
    { 
      name: "Sports", 
      icon: 'https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617632/Ball_Icon_shxgfx.svg'
    },
]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const isLocalGateway = paymentMethod === "paystack" || paymentMethod === "kora"
      const currency = isLocalGateway ? "NGN" : "USD"
      if (isLocalGateway) {
        localStorage.setItem(
          "sponsorshipFormData",
          JSON.stringify({
            program: selectedProgram,
            name: donationMode === "anonymous" ? "Anonymous" : name,
            email: donationMode === "anonymous" ? null : email,
            amount: amount,
            mode: "donation",
            paymentMethod,
            donationMode,
            currency,
            message,
          })
        )

      // Redirect to unified checkout page
      if (paymentMethod === "paystack") {
        window.location.href = "/checkout-paystack"
        return
      }

      if (paymentMethod === "kora") {
        window.location.href = "/checkout-kora"
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

      <h1 className="text-4xl font-bold text-primar mb-2">Make a <span className="text-primary dark:text-[#8bc97f]">Donation</span></h1>
      <p className="text-foreground mb-8">Your generosity changes lives. Choose where your impact matters most.</p>

      {/* Step Indicator */}
      <div className="flex gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`flex-1 h-0.5 rounded-full ${s <= step ? "bg-primary" : "bg-border dark:bg-white"}`} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Choose Program */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Step 1: Choose a Program</h2>
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
                    <div className="font-bold text-primary">{prog.name}</div>
                  </div>
                  <div className="text-sm text-foreground">Select this program</div>
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
          </div>
        )}

        {/* Step 2: Donation Mode & Amount */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Step 2: Donation Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
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
              <button
                type="button"
                onClick={() => setPaymentMethod("kora")}
                className={`p-2 rounded-lg border-2 transition text-center ${
                  paymentMethod === "kora" ? "border-primary bg-primary/5" : "border-border hover:border-primary"
                }`}
              >
                <div className="font-bold text-lg text-primary mb-2">Kora</div>
                <div className="text-sm text-foreground">Credit/Debit Card (USD)</div>
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
            <h2 className="text-2xl font-bold text-primary">Step 4: Confirm & Donate</h2>

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
