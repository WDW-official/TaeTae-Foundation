"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import IconRenderer from "@/components/icon-renderer"
import BackButton from "@/components/backButton"

export default function VolunteerPage() {
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState<"professional" | "helper" | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    occupation: "",
    location: "",
    bio: "",
    availability: "weekly",
    profile_photo_base64: "" // Added for image upload
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle input change for text fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle file input for image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profile_photo_base64: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          category,
        }),
      })

      if (res.ok) {
        alert("Thank you for volunteering! We will contact you soon.")
        setFormData({
          name: "",
          email: "",
          phone: "",
          occupation: "",
          location: "",
          bio: "",
          availability: "weekly",
          profile_photo_base64: "", // Clear image after submission
        })
        setStep(1)
        setCategory(null)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error submitting volunteer form")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        {/* LOGO */}
        <Link
          href="/"
          className="flex p-1 rounded-full bg-white border dark:border-white dark:bg-gray-900 items-center"
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

      <h1 className="text-4xl font-bold mb-4">Volunteer with <span className="text-primary dark:text-[#8bc97f]">Us</span></h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Join our community of mentors and helpers who are changing boys' lives.</p>

      {step === 1 && !category && (
        <div className="space-y-6">
          <div className=" flex items-center justify-between gap-4">
            <p className="text-primary mb-4">Choose your volunteer category:</p>
            <Link
              href="/login"
              className="text-primary mb-4"
            >
              I have an account
          </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PROFESSIONAL */}
            <button
              onClick={() => setCategory("professional")}
              className="p-8 border-2 border-border bg-white dark:bg-gray-900 rounded-lg hover:border-primary transition text-center"
            >
              <div className="flex justify-center mb-4">
                <IconRenderer
                  icon="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617681/Growth_dob1dn.svg"
                  size={48}
                  className="text-primary"
                />
              </div>

              <h3 className="text-xl font-bold text-primary mb-2">Professional</h3>
              <p className="text-sm text-foreground">Share your expertise and skills</p>
            </button>

            {/* HELPER */}
            <button
              onClick={() => setCategory("helper")}
              className="p-8 border-2 border-border bg-white dark:bg-gray-900 rounded-lg hover:border-primary transition text-center"
            >
              <div className="flex justify-center mb-4">
                <IconRenderer
                  icon="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764617580/Team_Bonding_chitrp.svg"
                  size={40}
                  className="text-primary"
                />
              </div>

              <h3 className="text-xl font-bold text-primary mb-2">Helper</h3>
              <p className="text-sm text-foreground">Support through mentoring and guidance</p>
            </button>
          </div>
        </div>
      )}

      {category && (
        <form onSubmit={handleSubmit} className="space-y-6 bg-[#edf5ecc1] dark:bg-gray-900 p-6 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-4">
            <button type="button" onClick={() => setCategory(null)} className="text-primary hover:underline">
              ← Change category
            </button>
          </div>

          <h2 className="text-2xl font-bold text-primary">
            {category === "professional" ? "Professional Volunteer" : "Helper Volunteer"}
          </h2>

          <div>
            <label className="block text-foreground font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-foreground font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-foreground font-semibold mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+234 000 000 000"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          {category === "professional" && (
            <div>
              <label className="block text-foreground font-semibold mb-2">Occupation / Expertise</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                placeholder="e.g., Software Engineer, Carpenter, Teacher"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-foreground font-semibold mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City / Region"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-foreground font-semibold mb-2">About You</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself and why you want to volunteer"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-foreground font-semibold mb-2">Availability</label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          <div>
            <label className="block text-foreground font-semibold mb-2">Profile Photo (Optional)</label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Volunteer Application"}
          </button>
        </form>
      )}
    </div>
  )
}
