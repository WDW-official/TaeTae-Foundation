"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, FilePenLine, Save, X } from "lucide-react"
import LoadingLogo from "@/components/loading-logo"

type Project100Application = {
  id: string
  childName: string
  dateOfBirth: string
  schoolAttended?: string
  guardianName: string
  guardianPhone: string
  guardianEmail: string
  profilePhotoUrl?: string
  status: "new" | "reviewed" | "converted" | "rejected"
  notes?: string
  convertedBoyId?: string
  createdAt: string
}

export default function Project100ApplicationPage() {
  const params = useParams<{ id: string }>()
  const applicationId = params?.id || ""
  const router = useRouter()
  const [application, setApplication] = useState<Project100Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [isPhotoOpen, setIsPhotoOpen] = useState(false)

  useEffect(() => {
    async function loadApplication() {
      if (!applicationId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/project-100/${applicationId}`, { cache: "no-store" })
        const data = await response.json()
        if (response.ok) {
          setApplication(data.application)
        }
      } catch (error) {
        console.error("Error loading Project 100 application:", error)
      } finally {
        setLoading(false)
      }
    }

    void loadApplication()
  }, [applicationId])

  const handleFieldChange = (name: keyof Project100Application, value: string) => {
    setApplication((prev) => (prev ? { ...prev, [name]: value } : prev))
  }

  const handleSave = async () => {
    if (!application) return

    setSaving(true)
    setMessage("")

    try {
      const response = await fetch(`/api/project-100/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(application),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || "Could not save application.")
        return
      }

      setApplication(data.application)
      setMessage("Application updated.")
    } catch (error) {
      console.error("Error saving Project 100 application:", error)
      setMessage("Something went wrong while saving.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingLogo label="Loading application..." />
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Application not found.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(139,201,127,0.18),transparent_35%),linear-gradient(135deg,rgba(10,26,26,0.04),transparent_55%)]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link
          href="/admin/dashboard/project-100"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Project 100 intake
        </Link>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-24 w-24 overflow-hidden rounded-2xl border border-border bg-secondary">
                {application.profilePhotoUrl ? (
                  <button
                    type="button"
                    onClick={() => setIsPhotoOpen(true)}
                    className="h-full w-full"
                    aria-label={`View ${application.childName}'s photo`}
                  >
                    <img
                      src={application.profilePhotoUrl}
                      alt={application.childName}
                      className="h-full w-full object-cover transition hover:scale-105"
                    />
                  </button>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground">
                    {application.childName.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Project 100 Application</p>
              <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold">
                <FilePenLine className="h-7 w-7 text-primary" />
                {application.childName}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Submitted on {new Date(application.createdAt).toLocaleDateString()}
              </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              {[
                ["childName", "Child's Name", application.childName],
                ["dateOfBirth", "Date of Birth", application.dateOfBirth],
                ["schoolAttended", "School Attended", application.schoolAttended || ""],
                ["guardianName", "Parent/Guardian's Name", application.guardianName],
                ["guardianPhone", "Phone Number", application.guardianPhone],
                ["guardianEmail", "Guardian Email", application.guardianEmail],
              ].map(([name, label, value]) => (
                <div key={name}>
                  <label className="mb-2 block text-sm font-semibold text-foreground">{label}</label>
                  <input
                    type={name === "dateOfBirth" ? "date" : name === "guardianEmail" ? "email" : "text"}
                    value={value}
                    onChange={(event) => handleFieldChange(name as keyof Project100Application, event.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              ))}

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Admin Notes</label>
                <textarea
                  value={application.notes || ""}
                  onChange={(event) => handleFieldChange("notes", event.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Add internal review notes or context for onboarding."
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-secondary/50 p-5">
                <label className="mb-2 block text-sm font-semibold text-foreground">Application Status</label>
                <select
                  value={application.status}
                  onChange={(event) => handleFieldChange("status", event.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="converted">Converted</option>
                  <option value="rejected">Rejected</option>
                </select>
                <p className="mt-3 text-sm text-muted-foreground">
                  Use statuses to track where this intake sits before or after onboarding.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-[#0d1a14] p-6 text-white">
                <p className="text-sm uppercase tracking-[0.3em] text-[#d5ebba]">Conversion Flow</p>
                <h2 className="mt-2 text-2xl font-bold">Continue To Onboarding</h2>
                <p className="mt-3 text-sm leading-6 text-white/80">
                  This keeps your existing signature, volunteer assignment, password, and profile creation flow intact while pre-filling the Project 100 submission.
                </p>

                {application.convertedBoyId ? (
                  <div className="mt-5 rounded-xl bg-white/10 p-4 text-sm text-white/90">
                    Already converted to boy ID: {application.convertedBoyId}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => router.push(`/admin/dashboard/boys/onboard?intakeId=${application.id}`)}
                  disabled={application.status === "converted"}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6f954a] disabled:opacity-60"
                >
                  Continue to Onboarding
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {message ? (
                <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                  {message}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {isPhotoOpen && application.profilePhotoUrl ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsPhotoOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-4xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsPhotoOpen(false)}
              className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white transition hover:bg-black"
              aria-label="Close photo preview"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={application.profilePhotoUrl}
              alt={application.childName}
              className="max-h-[90vh] w-auto rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      ) : null}
    </main>
  )
}
