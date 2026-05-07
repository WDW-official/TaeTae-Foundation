"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, ClipboardCheck, Filter, Search, UserPlus, X } from "lucide-react"
import { AdminDataTable } from "@/components/admin/admin-data-table"

type Project100Application = {
  _id: string
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

const statusClassName: Record<Project100Application["status"], string> = {
  new: "bg-amber-100 text-amber-800",
  reviewed: "bg-blue-100 text-blue-800",
  converted: "bg-green-100 text-green-800",
  rejected: "bg-rose-100 text-rose-800",
}

const pageSize = 8

export default function Project100AdminPage() {
  const [applications, setApplications] = useState<Project100Application[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; alt: string } | null>(null)

  useEffect(() => {
    async function fetchApplications() {
      try {
        const response = await fetch("/api/project-100", { cache: "no-store" })
        const data = await response.json()
        if (response.ok) {
          setApplications(Array.isArray(data.applications) ? data.applications : [])
        }
      } catch (error) {
        console.error("Error fetching Project 100 applications:", error)
      } finally {
        setLoading(false)
      }
    }

    void fetchApplications()
  }, [])

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase()

    return applications.filter((application) => {
      const matchesStatus = status === "all" || application.status === status
      const matchesSearch =
        !query ||
        [application.childName, application.guardianName, application.guardianEmail, application.guardianPhone]
          .some((value) => String(value || "").toLowerCase().includes(query))

      return matchesStatus && matchesSearch
    })
  }, [applications, search, status])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, status])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading Project 100 applications...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(139,201,127,0.18),transparent_35%),linear-gradient(135deg,rgba(10,26,26,0.04),transparent_55%)]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-foreground md:text-4xl">
              <ClipboardCheck className="h-8 w-8 text-primary" />
              Project 100 Intake
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Review public submissions before moving them into full onboarding.
            </p>
          </div>

          <Link
            href="/admin/dashboard/boys/onboard"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4" />
            Manual Onboarding
          </Link>
        </div>

        <div className="mb-6 grid gap-4 grid-cols-2 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs text-muted-foreground">Total Submissions</p>
            <p className="mt-1 text-2xl font-bold">{applications.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs text-muted-foreground">New</p>
            <p className="mt-1 text-2xl font-bold text-amber-600">
              {applications.filter((application) => application.status === "new").length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs text-muted-foreground">Reviewed</p>
            <p className="mt-1 text-2xl font-bold text-blue-600">
              {applications.filter((application) => application.status === "reviewed").length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs text-muted-foreground">Converted</p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {applications.filter((application) => application.status === "converted").length}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by child, guardian, email, or phone..."
                className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All statuses</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="converted">Converted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <AdminDataTable
          data={filteredApplications}
          page={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          totalLabel="applications"
          getRowKey={(application) => application.id}
          emptyTitle="No Project 100 applications found."
          emptyDescription="New public submissions will appear here for review."
          rowClassName={(_, index) =>
            index % 2 === 0 ? "bg-card dark:bg-gray-900" : "bg-secondary/10"
          }
          columns={[
            {
              id: "child",
              header: "Child",
              render: (application) => (
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 overflow-hidden rounded-full bg-secondary">
                    {application.profilePhotoUrl ? (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedPhoto({
                            url: application.profilePhotoUrl!,
                            alt: application.childName,
                          })
                        }
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
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                        {application.childName.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{application.childName}</p>
                    <p className="text-sm text-muted-foreground">
                      {application.schoolAttended || "School not provided"}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              id: "guardian",
              header: "Guardian",
              render: (application) => (
                <div className="text-sm text-muted-foreground">
                  <p>{application.guardianName}</p>
                  <p>{application.guardianPhone}</p>
                  <p className="truncate">{application.guardianEmail}</p>
                </div>
              ),
            },
            {
              id: "submitted",
              header: "Submitted",
              render: (application) => (
                <span className="text-sm text-muted-foreground">
                  {new Date(application.createdAt).toLocaleDateString()}
                </span>
              ),
            },
            {
              id: "status",
              header: "Status",
              render: (application) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusClassName[application.status]}`}>
                  {application.status}
                </span>
              ),
            },
            {
              id: "actions",
              header: "Actions",
              headerClassName: "text-right",
              cellClassName: "text-right",
              render: (application) => (
                <div className="flex justify-end">
                  <Link
                    href={`/admin/dashboard/project-100/${application.id}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-primary/30 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5"
                  >
                    Review
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ),
            },
          ]}
        />
      </div>

      {selectedPhoto ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-h-[90vh] max-w-4xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white transition hover:bg-black"
              aria-label="Close photo preview"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.alt}
              className="max-h-[90vh] w-auto rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      ) : null}
    </main>
  )
}
