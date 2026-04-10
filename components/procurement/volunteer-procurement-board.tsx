"use client"

import { ChangeEvent, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Batch = {
  id: string
  sponsorItemName: string
  sponsorItemImage?: string
  quantity: number
  status: string
  note?: string
  requestedAt: string
  evidence: Array<{
    id: string
    stage: string
    createdAt: string
    files: Array<{ url: string; kind: string; label?: string }>
  }>
}

const stageOptions = [
  { value: "delivered", label: "Delivered" },
  { value: "distributed", label: "Distributed" },
]

export default function VolunteerProcurementBoard() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStage, setSelectedStage] = useState<Record<string, string>>({})
  const [noteById, setNoteById] = useState<Record<string, string>>({})
  const [linksById, setLinksById] = useState<Record<string, string>>({})
  const [filesById, setFilesById] = useState<Record<string, string[]>>({})
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    void loadBatches()
  }, [])

  async function loadBatches() {
    const res = await fetch("/api/procurement/volunteer")
    const payload = await res.json()
    if (res.ok) setBatches(payload.batches || [])
    setLoading(false)
  }

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

    setFilesById((current) => ({ ...current, [batchId]: encoded }))
  }

  async function submitUpdate(batchId: string) {
    const status = selectedStage[batchId]
    if (!status) return

    setSavingId(batchId)
    try {
      const res = await fetch(`/api/procurement/batches/${batchId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          note: noteById[batchId],
          links: (linksById[batchId] || "")
            .split(",")
            .map((entry) => entry.trim())
            .filter(Boolean),
          filesBase64: filesById[batchId] || [],
        }),
      })
      if (res.ok) {
        setFilesById((current) => ({ ...current, [batchId]: [] }))
        setLinksById((current) => ({ ...current, [batchId]: "" }))
        setNoteById((current) => ({ ...current, [batchId]: "" }))
        await loadBatches()
      }
    } finally {
      setSavingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border bg-[radial-gradient(circle_at_top_left,_rgba(139,201,127,0.16),_transparent_35%)] p-6 md:p-8">
        <Badge className="rounded-full px-3 py-1 uppercase tracking-[0.22em]" variant="secondary">
          Assigned Batches
        </Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Distribution tracking board</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          Every batch assigned to you appears here. Upload proof at the delivered and distributed stages so the full sponsorship journey stays transparent.
        </p>
      </div>

      <div className="grid gap-4">
        {batches.map((batch) => (
          <Card key={batch.id} className="overflow-hidden border-border/80">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle className="text-xl">{batch.sponsorItemName}</CardTitle>
                  <CardDescription>
                    Batch {batch.id} · Quantity {batch.quantity} · Requested {new Date(batch.requestedAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant="outline">{batch.status.replaceAll("_", " ")}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid gap-4 lg:grid-cols-[180px,1fr]">
                <div className="overflow-hidden rounded-3xl border bg-muted">
                  {batch.sponsorItemImage ? (
                    <img src={batch.sponsorItemImage} alt={batch.sponsorItemName} className="h-full min-h-40 w-full object-cover" />
                  ) : (
                    <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                    {batch.note || "No procurement note was added for this batch."}
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stage update</label>
                      <Select
                        value={selectedStage[batch.id] || ""}
                        onValueChange={(value) =>
                          setSelectedStage((current) => ({ ...current, [batch.id]: value }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {stageOptions.map((stage) => (
                            <SelectItem key={stage.value} value={stage.value}>
                              {stage.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Evidence uploads</label>
                      <Input type="file" accept="image/*,video/*,.pdf" multiple onChange={(event) => void handleFiles(batch.id, event)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Social or external links</label>
                    <Input
                      placeholder="Comma-separated links"
                      value={linksById[batch.id] || ""}
                      onChange={(event) => setLinksById((current) => ({ ...current, [batch.id]: event.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Update note</label>
                    <Textarea
                      rows={3}
                      value={noteById[batch.id] || ""}
                      onChange={(event) => setNoteById((current) => ({ ...current, [batch.id]: event.target.value }))}
                      placeholder="Describe what happened at this stage"
                    />
                  </div>

                  <Button disabled={!selectedStage[batch.id] || savingId === batch.id} onClick={() => submitUpdate(batch.id)}>
                    {savingId === batch.id ? "Uploading..." : "Save stage evidence"}
                  </Button>
                </div>
              </div>

              {batch.evidence.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {batch.evidence.map((entry) => (
                    <div key={entry.id} className="rounded-2xl border border-border/80 bg-background p-4">
                      <p className="text-sm font-medium">{entry.stage.replaceAll("_", " ")}</p>
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
            </CardContent>
          </Card>
        ))}

        {batches.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center text-sm text-muted-foreground">
              No procurement batches have been assigned to you yet.
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
