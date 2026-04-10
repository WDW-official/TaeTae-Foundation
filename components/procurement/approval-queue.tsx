"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

type Batch = {
  id: string
  sponsorItemName: string
  quantity: number
  assignedVolunteerName: string
  requestedAt: string
  note?: string
}

export default function ApprovalQueue() {
  const [queue, setQueue] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [reasonById, setReasonById] = useState<Record<string, string>>({})

  useEffect(() => {
    void loadQueue()
  }, [])

  async function loadQueue() {
    const res = await fetch("/api/procurement/approvals")
    const payload = await res.json()
    if (res.ok) setQueue(payload.queue || [])
    setLoading(false)
  }

  async function handleDecision(batchId: string, decision: "approve" | "reject") {
    setProcessingId(batchId)
    try {
      const res = await fetch(`/api/procurement/approvals/${batchId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          rejectionReason: reasonById[batchId],
        }),
      })
      if (res.ok) await loadQueue()
    } finally {
      setProcessingId(null)
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
    <div className="space-y-6 px-3">
      <Link href="/admin/dashboard/sponsors/procurement" className="text-primary hover:underline mb-4 inline-block">
        ← Back
      </Link> 
      <div className="rounded-[28px] bg-[radial-gradient(circle_at_top_right,_rgba(139,201,127,0.15),_transparent_35%)] p-6 md:p-8">
        <Badge className="rounded-full px-3 py-1 uppercase tracking-[0.22em]" variant="secondary">
          Approval Queue
        </Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Management authorization</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          Review procurement requests before any sponsored item is purchased. Each batch already has one volunteer assigned and will keep its audit trail from this point forward.
        </p>
      </div>

      <div className="grid gap-4">
        {queue.map((batch) => (
          <Card key={batch.id} className="border-border/80">
            <CardHeader>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle className="text-xl">{batch.sponsorItemName}</CardTitle>
                  <CardDescription>
                    Batch {batch.id} · {batch.quantity} units · Requested {new Date(batch.requestedAt).toLocaleString()}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-slate-300 bg-slate-500/10 text-slate-700">
                  Awaiting Authorization
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border bg-muted/40 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Assigned volunteer</p>
                  <p className="mt-2 font-medium">{batch.assignedVolunteerName}</p>
                </div>
                <div className="rounded-2xl border bg-muted/40 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Admin note</p>
                  <p className="mt-2 text-sm text-muted-foreground">{batch.note || "No note added."}</p>
                </div>
              </div>

              <Input
                value={reasonById[batch.id] || ""}
                onChange={(event) =>
                  setReasonById((current) => ({ ...current, [batch.id]: event.target.value }))
                }
                placeholder="Optional rejection reason"
              />

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button disabled={processingId === batch.id} onClick={() => handleDecision(batch.id, "approve")}>
                  {processingId === batch.id ? "Updating..." : "Approve"}
                </Button>
                <Button variant="outline" disabled={processingId === batch.id} onClick={() => handleDecision(batch.id, "reject")}>
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {queue.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center text-sm text-muted-foreground">
              No procurement requests are waiting for authorization right now.
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
