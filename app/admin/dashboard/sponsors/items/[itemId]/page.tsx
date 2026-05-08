"use client"

import { ChangeEvent, useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { ArrowLeft, Boxes } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import LoadingLogo from "@/components/loading-logo"

type BatchStage = "approved" | "purchased" | "in_transit" | "delivered" | "distributed" | "completed"

const batchStageFlow: Array<{ value: BatchStage; label: string }> = [
  { value: "approved", label: "Approved" },
  { value: "purchased", label: "Purchased" },
  { value: "in_transit", label: "In Transit" },
  { value: "delivered", label: "Delivered" },
  { value: "distributed", label: "Distributed" },
  { value: "completed", label: "Completed" },
]

type DetailResponse = {
  item: {
    id: string
    name: string
    images?: string[]
    icon?: string
    totalNeeded?: number
  }
  sponsors: Array<{
    sponsorshipId: string
    sponsorName: string
    sponsorEmail: string
    quantity: number
    amount: number
    createdAt: string
  }>
  pagination: {
    page: number
    total: number
    totalPages: number
  }
  batches: Array<{
    id: string
    quantity: number
    status: string
    assignedVolunteerId?: string
    assignedVolunteerName?: string
    requestedAt: string
    note?: string
    stageHistory?: Array<{
      stage: string
      updatedByName: string
      updatedByRole: string
      updatedAt: string
    }>
    evidence: Array<{
      id: string
      stage: string
      note?: string
      createdAt: string
      files: Array<{ url: string; kind: string; label?: string }>
    }>
  }>
}

type VolunteerOption = {
  id: string
  name: string
  email: string
}

const adminEvidenceStages: Record<string, { next: BatchStage; title: string; helper: string; accept: string }> = {
  approved: {
    next: "purchased",
    title: "Purchased",
    helper: "Upload payment proof such as receipts or supplier screenshots.",
    accept: "image/*,.pdf",
  },
  purchased: {
    next: "in_transit",
    title: "In Transit",
    helper: "Upload shipment evidence for the batch.",
    accept: "image/*,video/*,.pdf",
  },
  in_transit: {
    next: "delivered",
    title: "Delivered",
    helper: "Upload delivery confirmation images for the batch.",
    accept: "image/*",
  },
}

export default function SponsorshipItemDetailPage() {
  const params = useParams<{ itemId: string }>()
  const searchParams = useSearchParams()
  const page = Number(searchParams?.get("page") || "1")
  const [data, setData] = useState<DetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [noteByBatchId, setNoteByBatchId] = useState<Record<string, string>>({})
  const [filesByBatchId, setFilesByBatchId] = useState<Record<string, string[]>>({})
  const [assignedVolunteerByBatchId, setAssignedVolunteerByBatchId] = useState<Record<string, string>>({})
  const [volunteers, setVolunteers] = useState<VolunteerOption[]>([])
  const [savingBatchId, setSavingBatchId] = useState<string | null>(null)
  const itemId = params?.itemId

  useEffect(() => {
    if (!itemId) {
      setLoading(false)
      return
    }

    async function loadDetail() {
      const res = await fetch(`/api/procurement/items/${itemId}?page=${page}&pageSize=20`)
      const payload = await res.json()
      if (res.ok) {
        setData(payload)
        setAssignedVolunteerByBatchId((current) => {
          const next = { ...current }
          for (const batch of payload.batches || []) {
            if (batch.id && batch.assignedVolunteerId && !next[batch.id]) {
              next[batch.id] = batch.assignedVolunteerId
            }
          }
          return next
        })
      }
      setLoading(false)
    }

    void loadDetail()
  }, [itemId, page])

  useEffect(() => {
    async function loadVolunteers() {
      const res = await fetch("/api/volunteers")
      const payload = await res.json()

      if (!res.ok || !Array.isArray(payload.volunteers)) return

      setVolunteers(
        payload.volunteers
          .filter((entry: any) => entry.status === "approved")
          .map((entry: any) => ({
            id: entry.id,
            name: entry.name || `${entry.firstName || ""} ${entry.lastName || ""}`.trim() || entry.email,
            email: entry.email,
          }))
      )
    }

    void loadVolunteers()
  }, [])

  async function handleFiles(batchId: string, event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || [])
    const encoded = await Promise.all(
      selectedFiles.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(String(reader.result || ""))
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
      )
    )

    setFilesByBatchId((current) => ({ ...current, [batchId]: encoded }))
  }

  async function submitStageUpdate(batchId: string, nextStatus: BatchStage) {
    setSavingBatchId(batchId)

    try {
      const res = await fetch(`/api/procurement/batches/${batchId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          note: noteByBatchId[batchId],
          filesBase64: filesByBatchId[batchId] || [],
          assignedVolunteerId: assignedVolunteerByBatchId[batchId],
        }),
      })

      if (!res.ok) return

      setFilesByBatchId((current) => ({ ...current, [batchId]: [] }))
      setNoteByBatchId((current) => ({ ...current, [batchId]: "" }))

      if (itemId) {
        const refreshed = await fetch(`/api/procurement/items/${itemId}?page=${page}&pageSize=20`)
        const payload = await refreshed.json()
        if (refreshed.ok) setData(payload)
      }
    } finally {
      setSavingBatchId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingLogo label="Loading item..." />
      </div>
    )
  }

  if (!data) {
    return <div className="py-12 text-center text-muted-foreground">Item not found.</div>
  }

  const image = data.item.images?.[0] || data.item.icon

  return (
    <div className="space-y-6 px-4 py-3">
      <Link href="/admin/dashboard/sponsors/procurement" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to procurement dashboard
      </Link>

      <Card className="overflow-hidden border-border/80">
        <CardContent className="grid gap-6 px-6 py-6 lg:grid-cols-[240px,1fr]">

          <div className="space-y-4">
            <Badge variant="secondary">Sponsored Item</Badge>
            <div className="flex">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-muted">
                {image ? (
                  <img src={image} alt={data.item.name} className="h-full w-full object-cover" />
                ) : (
                  <Boxes className="h-7 w-7 text-muted-foreground" />
                )}
              </div>
              <div>
                <h1 className="mt-3 pl-3 text-3xl font-semibold tracking-tight">{data.item.name}</h1>
                <p className="pl-3 text-sm text-muted-foreground">
                  {data.pagination.total} sponsor entries recorded for this item.
                </p>
              </div>
            </div>

            <div className="grid gap-3 grid-cols-3">
              <MetricCard label="Total needed" value={String(data.item.totalNeeded || 0)} />
              <MetricCard label="Current page" value={String(data.pagination.page)} />
              <MetricCard label="Tracked batches" value={String(data.batches.length)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle>Sponsor breakdown</CardTitle>
            <CardDescription>Each sponsor contribution tied to this item.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.sponsors.map((sponsor) => (
              <div key={`${sponsor.sponsorshipId}-${sponsor.createdAt}`} className="rounded-2xl border border-border/80 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{sponsor.sponsorName || "Anonymous"}</p>
                    <p className="text-sm text-muted-foreground">{sponsor.sponsorEmail || "No email available"}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-semibold">{sponsor.quantity} units</p>
                    <p className="text-sm text-muted-foreground">{sponsor.amount.toLocaleString()} USD</p>
                  </div>
                </div>
              </div>
            ))}

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href={data.pagination.page > 1 ? `?page=${data.pagination.page - 1}` : "#"} />
                </PaginationItem>
                {Array.from({ length: data.pagination.totalPages }, (_, index) => index + 1).map((entry) => (
                  <PaginationItem key={entry}>
                    <PaginationLink href={`?page=${entry}`} isActive={entry === data.pagination.page}>
                      {entry}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href={data.pagination.page < data.pagination.totalPages ? `?page=${data.pagination.page + 1}` : "#"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle>Procurement history</CardTitle>
            <CardDescription>Purchase batches and their assigned volunteers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.batches.map((batch) => (
              <div key={batch.id} className="rounded-2xl border border-border/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{batch.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {batch.quantity} units · {batch.assignedVolunteerName || "Volunteer not assigned yet"}
                    </p>
                  </div>
                  <Badge variant="outline">{batch.status.replaceAll("_", " ")}</Badge>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Requested {new Date(batch.requestedAt).toLocaleString()}
                </p>

                <div className="mt-4 rounded-2xl border border-border/70 bg-muted/20 p-4">
                  <p className="text-sm font-medium">Batch progress</p>
                  <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-0">
                    {batchStageFlow.map((stage, index) => (
                      <BatchProgressNode
                        key={`${batch.id}-${stage.value}`}
                        label={stage.label}
                        isCompleted={isBatchStageCompleted(batch.status, stage.value)}
                        showConnector={index < batchStageFlow.length - 1}
                      />
                    ))}
                  </div>
                </div>

                {adminEvidenceStages[batch.status] ? (
                  <div className="mt-4 space-y-3 rounded-2xl border border-border/70 bg-muted/30 p-4">
                    <div>
                      <p className="text-sm font-medium">
                        {adminEvidenceStages[batch.status].title} evidence
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {adminEvidenceStages[batch.status].helper}
                      </p>
                    </div>

                    {batch.status === "approved" ? (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Assign volunteer</label>
                        <Select
                          value={assignedVolunteerByBatchId[batch.id] || ""}
                          onValueChange={(value) =>
                            setAssignedVolunteerByBatchId((current) => ({
                              ...current,
                              [batch.id]: value,
                            }))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select one volunteer" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {volunteers.map((volunteer) => (
                              <SelectItem key={volunteer.id} value={volunteer.id}>
                                {volunteer.name} · {volunteer.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : null}

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Upload files</label>
                      <Input
                        type="file"
                        multiple
                        accept={adminEvidenceStages[batch.status].accept}
                        onChange={(event) => void handleFiles(batch.id, event)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stage note</label>
                      <Textarea
                        rows={3}
                        value={noteByBatchId[batch.id] || ""}
                        onChange={(event) => setNoteByBatchId((current) => ({ ...current, [batch.id]: event.target.value }))}
                        placeholder={`Add a note for the ${adminEvidenceStages[batch.status].title.toLowerCase()} stage`}
                      />
                    </div>

                    <Button
                      disabled={
                        savingBatchId === batch.id ||
                        (batch.status === "approved" && !assignedVolunteerByBatchId[batch.id])
                      }
                      onClick={() => submitStageUpdate(batch.id, adminEvidenceStages[batch.status].next)}
                    >
                      {savingBatchId === batch.id ? "Uploading..." : `Save ${adminEvidenceStages[batch.status].title} evidence`}
                    </Button>
                  </div>
                ) : null}

                {batch.evidence.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {batch.evidence.map((entry) => (
                      <div key={entry.id} className="rounded-2xl border border-border/70 bg-background p-3">
                        <p className="text-sm font-medium">{entry.stage.replaceAll("_", " ")}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {entry.stage.replaceAll("_", " ")} by {getStageActorLabel(batch.stageHistory, entry.stage as BatchStage) || "Not yet assigned"}
                        </p>
                        {entry.note ? <p className="mt-1 text-sm text-muted-foreground">{entry.note}</p> : null}
                        <p className="mt-1 text-xs text-muted-foreground">{new Date(entry.createdAt).toLocaleString()}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {entry.files.map((file) => (
                            <a
                              key={`${entry.id}-${file.url}`}
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full border px-3 py-1 text-xs transition hover:bg-muted"
                            >
                              {file.label || file.kind}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            {data.batches.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                No procurement batches have been raised for this item yet.
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-muted/40 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  )
}

function isBatchStageCompleted(currentStatus: string, stage: BatchStage) {
  const currentIndex = batchStageFlow.findIndex((entry) => entry.value === currentStatus)
  const stageIndex = batchStageFlow.findIndex((entry) => entry.value === stage)

  if (currentIndex === -1 || stageIndex === -1) {
    return false
  }

  return stageIndex <= currentIndex
}

function BatchProgressNode({
  label,
  isCompleted,
  showConnector,
}: {
  label: string
  isCompleted: boolean
  showConnector: boolean
}) {
  return (
    <div className="flex items-center">
      <div className="flex min-w-[96px] flex-col items-center gap-2 text-center">
        <div
          className={`h-4 w-4 rounded-full border-2 ${
            isCompleted ? "border-emerald-600 bg-emerald-500" : "border-slate-300 bg-slate-200"
          }`}
        />
        <p className={`text-xs font-medium ${isCompleted ? "text-emerald-700" : "text-muted-foreground"}`}>
          {label}
        </p>
      </div>
      {showConnector ? (
        <div className="mx-2 hidden h-px w-12 border-t border-dashed border-slate-300 md:block" />
      ) : null}
    </div>
  )
}

function getStageActorLabel(
  stageHistory: Array<{ stage: string; updatedByName: string; updatedByRole: string }> | undefined,
  stage: BatchStage
) {
  const entry = stageHistory?.find((item) => item.stage === stage)

  if (!entry) {
    return ""
  }

  if (entry.updatedByRole === "superAdmin") {
    return `${entry.updatedByName} (Super Admin)`
  }

  if (entry.updatedByRole === "admin") {
    return `${entry.updatedByName} (Admin)`
  }

  return entry.updatedByName
}
