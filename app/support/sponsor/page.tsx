"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/backButton"
import Link from "next/link"

type SponsorItemsKey = "equipment" | "materials" | "support"

type SponsorItem = {
  id: string
  name: string
  description?: string
  priceUSD: number
  images: string[]
  totalNeeded: number
  funded: number
  unit?: string
}

type SponsorSection = {
  id: string
  title: string
  items: SponsorItem[]
}

type SponsorData = Record<SponsorItemsKey, SponsorSection[]>

type SelectedState = Record<string, { selected: boolean; quantity: number }>

const plans = [
  { label: "Sponsor 1 Boy", multiplier: 1 },
  { label: "Sponsor 10 Boys", multiplier: 10 },
  { label: "Sponsor Full Cohort", multiplier: 100 },
]

function SponsorContent() {
  const router = useRouter()

  const [multiplier, setMultiplier] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("paystack")
  const [exchangeRate, setExchangeRate] = useState<number>(1400)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [activeTab, setActiveTab] = useState<SponsorItemsKey>("equipment")
  const [selectedItems, setSelectedItems] = useState<SelectedState>({})
  const [sponsorItems, setSponsorItems] = useState<SponsorData>({
    equipment: [],
    materials: [],
    support: [],
  })
  const [selectedItem, setSelectedItem] = useState<SponsorItem | null>(null)
  const [currentImage, setCurrentImage] = useState(0)

  const [loading, setLoading] = useState(true)

  function openModal(item: SponsorItem) {
  setSelectedItem(item)
  setCurrentImage(0)
}

function closeModal() {
  setSelectedItem(null)
}

  // ================= FETCH =================
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/sponsor-items")
        const data = await res.json()
        if (data?.data) setSponsorItems(data.data)

        const rateRes = await fetch(
          "https://api.exchangerate.host/latest?base=USD&symbols=NGN"
        )
        const rateData = await rateRes.json()
        setExchangeRate(rateData?.rates?.NGN || 1400)
      } catch {
        setExchangeRate(1400)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])
  

  const allItems = useMemo(() => {
    return Object.values(sponsorItems)
      .flat()
      .flatMap((section) => section.items)
  }, [sponsorItems])

  // ================= SELECT =================
  const handleToggle = (id: string) => {
    const item = allItems.find((i) => i.id === id)
    if (!item) return

    const remaining = Math.max(item.totalNeeded - item.funded, 0)

    setSelectedItems((prev) => {
      const isSelected = prev[id]?.selected

      if (isSelected) {
        return {
          ...prev,
          [id]: { selected: false, quantity: 0 },
        }
      }

      let qty = 1

      if (multiplier === 10) qty = Math.min(10, remaining)
      if (multiplier === 100) qty = remaining

      return {
        ...prev,
        [id]: {
          selected: qty > 0,
          quantity: qty,
        },
      }
    })
  }

  const handleQuantityChange = (id: string, type: "inc" | "dec") => {
  setSelectedItems((prev) => {
    const item = allItems.find((i) => i.id === id)
    if (!item) return prev

    const current = prev[id]?.quantity || 0
    const remaining = item.totalNeeded - item.funded

    let newQty = current

    if (multiplier === 100) {
      newQty = type === "inc" ? remaining : 0
    } else {
      const step = multiplier
      newQty = type === "inc" ? current + step : current - step
    }

    if (newQty < 0) newQty = 0
    if (newQty > remaining) newQty = remaining

    return {
      ...prev,
      [id]: {
        selected: newQty > 0,
        quantity: newQty,
      },
    }
  })
}




  // ================= TOTAL =================
  const totalUSD = useMemo(() => {
    return Object.entries(selectedItems).reduce((sum, [id, state]) => {
      if (!state.selected || state.quantity <= 0) return sum

      const item = allItems.find((i) => i.id === id)
      if (!item) return sum

      return sum + item.priceUSD * state.quantity
    }, 0)
  }, [selectedItems, allItems])

  useEffect(() => {
    setSelectedItems((prev) => {
      const updated: SelectedState = {}

      Object.entries(prev).forEach(([id, state]) => {
        if (!state.selected) return

        const item = allItems.find((i) => i.id === id)
        if (!item) return

        const remaining = Math.max(item.totalNeeded - item.funded, 0)

        let newQty = 1

        if (multiplier === 10) {
          newQty = Math.min(10, remaining)
        } else if (multiplier === 100) {
          newQty = remaining
        }

        updated[id] = {
          selected: newQty > 0,
          quantity: newQty,
        }
      })

      return updated
    })
  }, [multiplier, allItems])


  const totalNGN = useMemo(() => {
    return totalUSD * exchangeRate
  }, [totalUSD, exchangeRate])

  const displayTotal =
    paymentMethod === "paystack" ? totalNGN : totalUSD

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const chosenItems = Object.entries(selectedItems)
      .filter(([_, item]) => item.selected)
      .map(([id, item]) => ({
        id,
        quantity: item.quantity,
      }))

    if (chosenItems.length === 0) {
      alert("Please select at least one item")
      setIsSubmitting(false)
      return
    }

    const formData = {
      name,
      email,
      items: chosenItems,
      multiplier,
      totalAmount: displayTotal,
      paymentMethod,
      currency: paymentMethod === "paystack" ? "NGN" : "USD",
      rateUsed: exchangeRate,
      mode: "sponsorship",
    }

    localStorage.setItem("sponsorshipFormData", JSON.stringify(formData))

    if (paymentMethod === "paystack") {
      router.push("/checkout-paystack");
    } else if (paymentMethod === "kora") {
      router.push("/checkout-kora");
    } else if (paymentMethod === "paypal") {
      router.push("/checkout-paypal");
    }
  }

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading sponsor items...</p>
          </div>
        </div>
      </section>
    );
    return <div className="max-w-4xl mx-auto px-4 py-12">Loading sponsor items...</div>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
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

      <h1 className="text-4xl uppercase font-bold text-primar mb-2">
        Become a <span className="text-primary dark:text-[#8bc97f]">Sponsor</span>
      </h1>

      <p className="text-foreground mb-8">
        Choose specific items to sponsor and make a tangible impact.
      </p>

      {/* ================= PLANS ================= */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {plans.map((plan) => {
          const previewUSD = Object.entries(selectedItems).reduce((sum, [id, state]) => {
            if (!state.selected) return sum

            const item = allItems.find((i) => i.id === id)
            if (!item) return sum

            const remaining = Math.max(item.totalNeeded - item.funded, 0)

            let planQuantity = 1
            if (plan.multiplier === 10) planQuantity = Math.min(10, remaining)
            if (plan.multiplier === 100) planQuantity = remaining

            return sum + item.priceUSD * planQuantity
          }, 0)

          const previewAmount =
            paymentMethod === "paystack" ? previewUSD * exchangeRate : previewUSD

          return (
            <button
              key={plan.multiplier}
              type="button"
              onClick={() => setMultiplier(plan.multiplier)}
              className={`p-4 rounded-xl border md:text-2xl text-base text-bold ${
                multiplier === plan.multiplier
                  ? "bg-primary text-white"
                  : "bg-primary/10 text-primary dark:text-primary"
              }`}
            >
              <div>{plan.label}</div>
              <div className="font-bold">
                {paymentMethod === "paystack"
                  ? `₦${previewAmount.toLocaleString()}`
                  : `$${previewAmount.toLocaleString()}`}
              </div>
            </button>
          )
        })}
      </div>

      {/* ================= TABS ================= */}
      <div className="mb-4">
        {(["equipment", "materials", "support"] as SponsorItemsKey[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-2 py-2 text-sm mr-2 rounded ${
              activeTab === tab
                ? "bg-primary text-white"
                : "bg-gray-200 dark:text-primary"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ================= ITEMS ================= */}
        {sponsorItems[activeTab].map((section) => (
          <div key={section.id} className="mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">
              {section.title}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {section.items.map((item) => {
                const state = selectedItems[item.id]
                const selected = state?.selected
                const quantity = state?.quantity || 1

                const funded = item.funded ?? 0
                const progress = (funded / item.totalNeeded) * 100

                const price =
                  paymentMethod === "paystack"
                    ? item.priceUSD * exchangeRate
                    : item.priceUSD

                return (
                  <div
                    key={item.id}
                    className="border rounded-2xl p-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition"
                  >
                    {/* Top Section */}
                    <div className="flex justify-between gap-2 items-start">
                      
                      {/* Left */}
                      <div className="flex flex-col flex-1">
  
                        {/* Row: Checkbox + Title */}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selected || false}
                            onChange={() => handleToggle(item.id)}
                            className="
                              w-5 h-5
                              accent-primary
                              rounded
                              border-2 border-gray-300
                              checked:border-primary
                              focus:ring-2 focus:ring-primary
                            "
                          />

                          <span className="font-bold text-primary text-sm">
                            {item.name}
                          </span>
                        </div>

                        {/* Details (aligned under title, NOT checkbox) */}
                        <div className="ml-7 mt-1 flex flex-col">
                          <span className="text-xs truncate w-28 block dark:text-white text-gray-500">
                            {item.description}
                          </span>

                          <span className="text-primary font-semibold mt-1">
                            {paymentMethod === "paystack"
                              ? `₦${price.toLocaleString()}`
                              : `$${item.priceUSD}`}
                          </span>
                        </div>
                        {/* Progress */}
                        <div className="mt-4 ml-7">
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>

                          <div className="flex justify-between! text-xs mt-1 dark:text-white text-gray-500">
                            <span>{item.totalNeeded - funded} needed</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                        </div>

                      </div>

                      {/* Right Icon */}
                      <div className="bg-green-50 dark:bg-white p-2 rounded-lg">
                        {item.images?.[0] && (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-xl cursor-pointer"
                            onClick={() => openModal(item)}
                          />
                        )}

                      </div>


                    </div>

                    

                    {/* Quantity Selector */}
                    {selected && (
                      <div className="flex items-center justify-end gap-3 mt-4">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, "dec")}
                          className="w-8 h-8 rounded-md border flex items-center justify-center hover:bg-gray-100"
                        >
                          -
                        </button>

                        <span className="font-medium">{quantity}</span>

                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, "inc")}
                          className="w-8 h-8 rounded-md border flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* ================= FORM ================= */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-4 py-2 rounded-lg"
            required
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-4 py-2 rounded-lg"
            required
          />
        </div>

        {/* ================= PAYMENT ================= */}
        {/* <div>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Select Payment Method
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod("paystack")}
              className={`p-6 rounded-lg border-2 ${
                paymentMethod === "paystack"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              Paystack (NGN)
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("kora")}
              className={`p-6 rounded-lg border-2 ${
                paymentMethod === "kora"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              Kora (USD)
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("paypal")}
              className={`p-6 rounded-lg border-2 ${
                paymentMethod === "paypal"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              PayPal (USD)
            </button>
          </div>
        </div> */}
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

        {/* ================= TOTAL ================= */}
        <div className="text-right font-semibold text-lg text-primary">
          Total:{" "}
          {paymentMethod === "paystack"
            ? `₦${totalNGN.toLocaleString()}`
            : `$${totalUSD.toLocaleString()}`}
        </div>

        <button
          type="submit"
          className="w-full px-4 py-3 bg-primary text-white rounded-lg"
        >
          Proceed to Payment
        </button>

      </form>
      {selectedItem && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full p-4 relative">

            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-xl"
            >
              ✕
            </button>

            {/* Main Image */}
            <img
              src={selectedItem.images[currentImage]}
              className="w-full md:h-[400px] bg-white object-contain rounded-xl"
            />

            {/* Navigation */}
            <div className="flex justify-between! mt-4">
              <button
                onClick={() =>
                  setCurrentImage((prev) =>
                    prev === 0 ? selectedItem.images.length - 1 : prev - 1
                  )
                }
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg"
              >
                Prev
              </button>

              <button
                onClick={() =>
                  setCurrentImage((prev) =>
                    prev === selectedItem.images.length - 1 ? 0 : prev + 1
                  )
                }
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg"
              >
                Next
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {selectedItem.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setCurrentImage(index)}
                  className={`w-16 h-16 object-cover bg-white rounded-lg cursor-pointer border ${
                    index === currentImage ? "border-green-600" : ""
                  }`}
                />
              ))}
            </div>

            {/* Info */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">{selectedItem.name}</h3>
              <p className="text-sm text-gray-500">
                {selectedItem.description}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default function SponsorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SponsorContent />
    </Suspense>
  )
}
