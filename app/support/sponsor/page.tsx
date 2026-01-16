"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import IconRenderer from "@/components/icon-renderer";
import BackButton from "@/components/backButton";

// Define a type for the keys of the sponsorItems
type SponsorItemsKey = "equipment" | "materials" | "support"; // Only 3 categories

function SponsorContent() {
  const searchParams = useSearchParams()
  const program = searchParams.get("program")

  const [paymentMethod, setPaymentMethod] = useState("paystack") // Default to Paystack
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<SponsorItemsKey>("equipment") // Default tab is 'equipment'
  const [selectedItems, setSelectedItems] = useState<Record<string, { selected: boolean; quantity: number }>>({})

  // Sponsor items for the 3 specific categories
  const sponsorItems: Record<SponsorItemsKey, { id: string; name: string; description: string; amount: number; icon: string }[]> = {
    equipment: [
      { 
        id: "tools", 
        name: "Tool Set", 
        description: "Carpentry & mechanics tools", 
        amount: 150, 
        icon: 'https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617613/Carpentry_xlivwz.svg'
      },
      { 
        id: "kit", 
        name: "Sports Kit", 
        description: "Football, cones, and training gear", 
        amount: 200, 
        icon: 'https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617634/Sponsor_dm5cxc.svg'
      }
    ],
    materials: [
      { 
        id: "books", 
        name: "Books", 
        description: "Set of 20 classroom books", 
        amount: 75, 
        icon: 'https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617633/Education_cwwvkm.svg'
      }
    ],
    support: [
      { 
        id: "uniforms", 
        name: "Uniforms", 
        description: "Uniforms for 5 boys", 
        amount: 100, 
        icon: 'https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617667/Sponsor_1_goyphq.svg'
      },
      { 
        id: "tech", 
        name: "Tech", 
        description: "Laptops or tablets for learning", 
        amount: 500, 
        icon: 'https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617611/Computer_Science_fdcsmf.svg'
      },
      { 
        id: "meals", 
        name: "Meals", 
        description: "Meals for 30 boys", 
        amount: 300, 
        icon: 'https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617721/Asset_29_cwxbbu.svg'
      }
    ]
  }

  // Fetch live exchange rate
  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=NGN")
        const data = await res.json()
        if (data?.rates?.NGN) {
          setExchangeRate(data.rates.NGN)
        } else {
          setExchangeRate(1400) // fallback value
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error)
        setExchangeRate(1400) // fallback value
      }
    }
    fetchRate()
  }, [])

  const handleToggle = (id: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: prev[id]
        ? { ...prev[id], selected: !prev[id].selected }
        : { selected: true, quantity: 1 },
    }))
  }

  const handleQuantityChange = (id: string, value: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], quantity: value },
    }))
  }

  // Calculate total amount based on selected items and quantities
  const calculateTotal = () => {
    const totalUSD = Object.entries(selectedItems).reduce((sum, [id, item]) => {
      if (!item.selected) return sum
      const product = Object.values(sponsorItems).flat().find((i) => i.id === id)
      return sum + (product ? product.amount * item.quantity : 0)
    }, 0)

    if (paymentMethod === "paystack" && exchangeRate) {
      return totalUSD * exchangeRate
    }

    return totalUSD
  }

  const totalAmount = calculateTotal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const chosenItems = Object.entries(selectedItems)
      .filter(([_, item]) => item.selected)
      .map(([id, item]) => ({
        id,
        quantity: item.quantity,
      }));

    const total = paymentMethod === "paystack" ? totalAmount : totalAmount; // No need for a separate conversion here
    const currency = paymentMethod === "paystack" ? "NGN" : "USD";

    const formData = {
      name,
      email,
      items: chosenItems,
      totalAmount: total,
      paymentMethod,
      currency,
      rateUsed: exchangeRate,
      mode:"sponsorship"
    };

    try {
      // Store the form data in localStorage
      localStorage.setItem('sponsorshipFormData', JSON.stringify(formData));

      // Now, redirect based on the payment method
      if (paymentMethod === "kora") {
        window.location.href = `/checkout-kora`;
      } else {
        window.location.href = `/checkout-paystack`;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing sponsorship");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto dark:bg-gray-900 px-4 py-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        {/* LOGO */}
        <Link
          href="/"
          className="flex p-1 rounded-full bg-white border dark:border-white dark:bg-gray-900  items-center"
        >
          {/* Logo for light mode */}
          <img
            src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764783363/Tae_Tae_2_a52zrp.svg"
            alt="TaeTae Foundation Logo"
            className="md:h-10 h-8 pr-1 w-auto dark:hidden"  // This will hide in dark mode
          />
          
          {/* Logo for dark mode */}
          <img
            src="/Tae-Tae-logo.png"
            alt="TaeTae Foundation Logo"
            className="md:h-10 h-8 pr-1 w-auto hidden dark:block"  // This will show only in dark mode
          />
        </Link>
        <BackButton label="Back"/>
      </div>
      
      <h1 className="text-4xl font-bold text-primar mb-2">Become a <span className="text-primary dark:text-[#8bc97f]">Sponsor</span></h1>
      <p className="text-foreground mb-8">Choose specific items to sponsor and make a tangible impact.</p>

      {/* Tab Navigation */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("equipment")}
          className={`px-2 py-2 text-sm mr-2 rounded ${activeTab === "equipment" ? "bg-primary text-white" : "bg-gray-200 dark:text-primary"}`}
        >
          Equipment
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("materials")}
          className={`px-2 py-2 mr-2 text-sm rounded ${activeTab === "materials" ? "bg-primary text-white" : "bg-gray-200 dark:text-primary"}`}
        >
         Materials
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("support")}
          className={`px-2 py-2 mr-2 text-sm rounded ${activeTab === "support" ? "bg-primary text-white" : "bg-gray-200 dark:text-primary"}`}
        >
          Support
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Item Selection */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">Select Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sponsorItems[activeTab].map((item) => {
              const state = selectedItems[item.id]
              const isSelected = state?.selected || false
              const convertedAmount =
                paymentMethod === "paystack" && exchangeRate
                  ? item.amount * exchangeRate
                  : item.amount

              return (
                <div key={item.id} className="p-4 border border-border rounded-lg">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(item.id)}
                      className="w-4 h-4 mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-primary flex items-center">
                        
                        <span className="">{item.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                      <div className="text-sm font-semibold text-primary mt-1">
                        {paymentMethod === "paystack"
                          ? `₦${convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                          : `$${item.amount}`}
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-primary/30 dark:bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition">
                    <IconRenderer icon={item.icon} size={22} className="text-primary" />
                    </div>
                  </label>

                  {isSelected && (
                    <div className="mt-3 flex items-center justify-between">
                      <label className="text-sm text-foreground font-medium">Quantity:</label>
                      <input
                        type="number"
                        min="1"
                        value={state.quantity}
                        onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-border rounded-md text-center"
                      />
                      <span className="text-sm text-primary font-semibold">
                        {paymentMethod === "paystack" && exchangeRate
                          ? `₦${(convertedAmount * state.quantity).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                          : `$${(item.amount * state.quantity).toLocaleString()}`}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Donor Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-foreground font-semibold mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-foreground font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">Select Payment Method</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
             <button
              type="button"
              onClick={() => setPaymentMethod("paystack")}
              className={`p-6 rounded-lg border-2 transition text-center ${
                paymentMethod === "paystack" ? "border-primary bg-primary/5" : "border-border hover:border-primary"
              }`}
            >
              <div className="font-bold text-lg text-primary mb-2">Paystack</div>
              <div className="text-sm text-foreground">Card/Bank Transfer (NGN)</div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("kora")}
              className={`p-6 rounded-lg border-2 transition text-center ${
                paymentMethod === "kora" ? "border-primary bg-primary/5" : "border-border hover:border-primary"
              }`}
            >
              <div className="font-bold text-lg text-primary mb-2">Kora</div>
              <div className="text-sm text-foreground">Credit/Debit Card (USD)</div>
            </button>
          </div>

          {paymentMethod === "paystack" && exchangeRate && (
            <p className="text-sm text-muted-foreground mt-2">
              💱 Current rate: 1 USD = ₦{exchangeRate.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          )}
        </div>

        {/* Total */}
        <div className="text-right font-semibold text-lg text-primary">
          Total:{" "}
          {paymentMethod === "paystack"
            ? `₦${totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
            : `$${totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={totalAmount === 0 || isSubmitting}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : "Proceed to Payment"}
        </button>
      </form>
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
