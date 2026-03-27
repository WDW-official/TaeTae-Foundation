"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Donation } from "@/lib/schemas"


type Props = {
  donation: Donation
}

export default function DonationReminderClient({ donation }: Props) {

  const router = useRouter()

  const [amount, setAmount] = useState<number>(donation.amount)
  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "kora" | "stripe">(donation.paymentMethod)

  const handleDonate = () => {

    const currency = paymentMethod === "paystack" ? "NGN" : "USD"

    localStorage.setItem(
      "sponsorshipFormData",
      JSON.stringify({
        program: donation.program,
        email: donation.email,
        amount,
        name: donation.donationMode === "known" ?donation.name  :"Anonymous" ,
        duration: donation.duration,
        paymentMethod,
        currency,
        donationMode: donation.donationMode,
        mode: "donation",
      })
    )

    if (paymentMethod === "paystack") router.push("/checkout-paystack")
    if (paymentMethod === "kora") router.push("/checkout-kora")
  }

  return (
    <div className="max-w-xl mx-auto min-h-screen px-4 py-12">

      <h1 className="text-3xl font-bold mb-6">
        Continue Your Donation
      </h1>

      <div className="border rounded-lg p-6 mb-6">

        <div className="flex justify-between mb-2">
          <span>Name</span>
          <span className="font-semibold">{donation.name}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Program</span>
          <span className="font-semibold">{donation.program}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Donation Type</span>
          <span className="font-semibold capitalize">
            {donation.duration}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Email</span>
          <span className="font-semibold">{donation.email}</span>
        </div>

      </div>

      <label className="font-semibold block mb-2">
        Donation Amount
      </label>

      <input
        type="number"
        value={amount}
        onChange={(e)=>setAmount(Number(e.target.value))}
        className="border rounded-lg px-4 py-2 w-full mb-4"
      />

      <div className="flex gap-2 mb-6 flex-wrap">

        {[2000,5000,10000,20000].map((value)=>(
          <button
            key={value}
            type="button"
            onClick={()=>setAmount(value)}
            className="px-3 py-1 border rounded-lg"
          >
            ₦{value.toLocaleString()}
          </button>
        ))}

      </div>

      <button
        onClick={handleDonate}
        className="bg-primary text-white px-6 py-3 rounded-lg w-full"
      >
        Donate ₦{Number(amount).toLocaleString()}
      </button>

    </div>
  )
}
