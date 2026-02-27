"use client"

import type React from "react"
import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, User } from "lucide-react"
import { toast } from "react-toastify"
import SignatureCanvas from "react-signature-canvas"

function OnboardContent() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(true)
  const [formData, setFormData] = useState({
    fullName: "",
    date_of_birth: "",
    email: "",
    phone: "",
    program: "skills",
    background: "",
    goals: "",
    parentName: "",
    parentPhone: "",
    guardianName: "",
    guardianEmail: "",
    guardianPhone: "",
    profile_photo_base64: "",  // Added for image upload
    school_name: "",
    class_level: "",
    program_start_date: "",
    program_track: "",
    address_city: "",
    address_country: "",
    emergency_contact: "",
    consent_form_signed: false,  // Added to track consent form checkbox
    notes: "",
    guardian_signature: "", // To store the signature
  })

  const [signaturePad, setSignaturePad] = useState<any>(null); // to manage the signature canvas
  const programs = [
    { id: "skills", name: "Skills Training", description: "Learn vocational trades" },
    { id: "education", name: "Education", description: "Academic mentoring & tutoring" },
    { id: "sports", name: "Sports", description: "Athletics & team building" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle file input for profile photo
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

  // Function to handle saving signature as base64
  const handleSaveSignature = () => {
    if (signaturePad.isEmpty()) {
      toast.error("Please sign and save the consent form.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    const signature = signaturePad.toDataURL("image/png");  // Get the base64 image of the signature
    setFormData(prev => ({
      ...prev,
      guardian_signature: signature,  // Save the signature base64
    }));
    setIsSaving(false); // Mark signature as saved
    const id = toast.success("Signature saved.", {
      position: "top-right",
      autoClose: 3000,
      
    });

    let progress = 0;

    const interval = setInterval(() => {
      progress += 0.02;
      toast.update(id, { progress });

      if (progress >= 1) {
        clearInterval(interval);
      }
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Ensure the consent form is signed
    if (!formData.guardian_signature) {
      toast.error("You must sign the consent form to proceed.", {
        position: "top-right",
        autoClose: 5000,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/boys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.fullName.split(" ")[0],  // Assuming the first name is the first part
          last_name: formData.fullName.split(" ")[1],   // Assuming the second part is the last name
          date_of_birth: formData.date_of_birth,        // Using date of birth directly
          program_track: formData.program,
          guardian_name: formData.guardianName,
          guardian_Email: formData.guardianEmail,
          guardian_phone: formData.guardianPhone,
          school_name: formData.school_name,
          class_level: formData.class_level,
          goals: formData.goals,
          background: formData.background,
          address_city: formData.address_city,
          address_country: formData.address_country,
          emergency_contact: formData.emergency_contact,
          consent_form_signed: true, // consent is implied by the signature
          profile_photo_base64: formData.profile_photo_base64,  // Sending profile image
          notes: formData.notes,
          guardian_signature: formData.guardian_signature, // Sending the signature
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(data.message || "Boy successfully enrolled!", {
          position: "top-right",
          autoClose: 5000,
        });
        router.push(`/admin/dashboard/boys`)
      } else {
        alert("Error creating profile")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error creating profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-card dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/admin/dashboard/boys" className="text-primary hover:underline mb-6 inline-block">
          ← Back
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <User className="w-8 h-8 text-primary" />
          <h1 className="text-xl md:text-4xl font-bold text-primary">Join TaeTae Foundation</h1>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-1 rounded-full transition ${s <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-primary">Step 1: Personal Information</h2>

              <div>
                <label className="block text-foreground font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-foreground font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    placeholder="+234 000 000 000"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              {/* Image upload field */}
              <div>
                <label className="block text-foreground font-semibold mb-2">Profile Photo</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Program & Goals */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-primary">Step 2: Program & Goals</h2>

              <div>
                <label className="block text-foreground font-semibold mb-3">Select Program</label>
                <div className="space-y-2">
                  {programs.map((prog) => (
                    <label
                      key={prog.id}
                      className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary transition"
                    >
                      <input
                        type="radio"
                        name="program"
                        value={prog.id}
                        checked={formData.program === prog.id}
                        onChange={handleChange}
                        className="w-4 h-4 mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-primary">{prog.name}</div>
                        <div className="text-sm text-muted-foreground">{prog.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">Background</label>
                <textarea
                  name="background"
                  value={formData.background}
                  onChange={handleChange}
                  placeholder="Tell us about yourself and your background"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">Your Goals</label>
                <textarea
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  placeholder="What are your goals for this program?"
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
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Guardian Info with Signature Pad */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-primary">Step 3: Guardian Information & Consent</h2>

              <div className="bg-secondary p-4 rounded-lg border border-border">
                <p className="text-sm text-foreground">
                  We need parent/guardian contact information for your safety and wellbeing.
                </p>
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">Parent/Guardian Name</label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  placeholder="Guardian's full name"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">Guardian Email</label>
                <input
                  type="text"
                  name="guardianEmail"
                  value={formData.guardianEmail}
                  onChange={handleChange}
                  placeholder="Guardian's Email"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">Guardian Phone</label>
                <input
                  type="tel"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  placeholder="+234 000 000 000"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Signature Pad for Guardian Consent */}
              <div>
                <label className="block text-foreground font-semibold mb-2">Sign Consent Form</label>
                <SignatureCanvas
                  ref={(ref) => setSignaturePad(ref)}
                  penColor="black"
                  canvasProps={{
                    width: 500,
                    height: 200,
                    className: "border border-gray-300",
                  }}
                />
                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => signaturePad.clear()}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSignature}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                  >
                    Save Signature
                  </button>
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
                  disabled={isSubmitting || isSaving} // Disable submit while saving signature or submitting form
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Creating Profile..." : "Complete Onboarding"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default function OnboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardContent />
    </Suspense>
  )
}
