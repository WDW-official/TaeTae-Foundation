"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Boxes, CircleAlert, HeartHandshake, PackageCheck, PackagePlus, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/app/store/auth.store"

type SummaryItem = {
  itemId: string
  itemName: string
  image?: string
  unit?: string
  totalNeeded: number
  totalSponsoredQuantity: number
  totalSponsoredAmount: number
  totalAllocatedQuantity: number
  availableForProcurement: number
  procurementThreshold: number
  status: string
  statusLabel: string
}

type SummaryResponse = {
  items: SummaryItem[]
  queue: SummaryItem[]
  counters: {
    totalItems: number
    dueForProcurement: number
    awaitingAuthorization: number
    activeBatches: number
    distributedBatches: number
  }
}

const statusClassName: Record<string, string> = {
  due_for_procurement: "bg-amber-500/15 text-amber-700 border-amber-300",
  awaiting_authorization: "bg-slate-500/15 text-slate-700 border-slate-300",
  approved: "bg-blue-500/15 text-blue-700 border-blue-300",
  purchased: "bg-violet-500/15 text-violet-700 border-violet-300",
  in_transit: "bg-cyan-500/15 text-cyan-700 border-cyan-300",
  delivered: "bg-emerald-500/15 text-emerald-700 border-emerald-300",
  distributed: "bg-green-600/15 text-green-800 border-green-300",
  rejected: "bg-red-500/15 text-red-700 border-red-300",
  awaiting_funding: "bg-muted text-muted-foreground border-border",
}

export default function ProcurementDashboard() {
  const role = useAuthStore((s) => s.role)
  const [data, setData] = useState<SummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<SummaryItem | null>(null)
  const [quantity, setQuantity] = useState("")
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    void loadData()
  }, [])

  async function loadData() {
    const res = await fetch("/api/procurement/summary")
    const payload = await res.json()
    if (res.ok) setData(payload)
    setLoading(false)
  }

  const filteredItems = useMemo(() => {
    if (!data) return []
    if (!query.trim()) return data.items
    const value = query.toLowerCase()
    return data.items.filter((item) => item.itemName.toLowerCase().includes(value))
  }, [data, query])

  async function handleCreateRequest() {
    if (!selectedItem) return

    setSubmitting(true)
    setFeedback(null)

    try {
      const res = await fetch("/api/procurement/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sponsorItemId: selectedItem.itemId,
          quantity: Number(quantity),
          note,
        }),
      })

      const payload = await res.json()
      if (!res.ok) {
        setFeedback(payload.error || "Could not create purchase request.")
        return
      }

      setSelectedItem(null)
      setQuantity("")
      setNote("")
      setFeedback("Purchase request sent for authorization.")
      await loadData()
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-5">
      <section className=" bg-[radial-gradient(circle_at_top_left,rgba(139,201,127,0.18),transparent_35%),linear-gradient(135deg,rgba(10,26,26,0.04),transparent_55%)] p-6 md:p-8">
        <Link href="/admin/dashboard/sponsors" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back 
        </Link> 
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <Badge className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.24em]" variant="secondary">
              Sponsorship Operations
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Procurement and sponsorship control center</h1>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              Track funded items, raise purchase batches, route approvals, and move every sponsored item from funding to distribution with evidence at each step.
            </p>
          </div>

          <div className="flex  gap-3">
            <Button asChild variant="outline">
              <Link href="/admin/dashboard/sponsors/add-sponsorship">Manage Items</Link>
            </Button>
            {role === "superAdmin" && (
              <Button asChild>
                <Link href="/admin/dashboard/sponsors/procurement/approvals">Approval Queue</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-4 grid-cols-2 xl:grid-cols-5">
          <StatsCard icon={HeartHandshake} label="Sponsored items" value={String(data?.counters.totalItems || 0)} />
          <StatsCard icon={CircleAlert} label="Due for procurement" value={String(data?.counters.dueForProcurement || 0)} />
          <StatsCard icon={ShieldCheck} label="Awaiting approval" value={String(data?.counters.awaitingAuthorization || 0)} />
          <StatsCard icon={PackagePlus} label="Active batches" value={String(data?.counters.activeBatches || 0)} />
          <StatsCard icon={PackageCheck} label="Distributed batches" value={String(data?.counters.distributedBatches || 0)} />
        </div>
      </section>

      {feedback ? <p className="text-sm text-primary">{feedback}</p> : null}

      <section className="grid px-4 gap-6 xl:grid-cols-[1.25fr,0.75fr]">
        <Card className="overflow-hidden border-border/80 py-0">
          <CardHeader className="border-b px-6 py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-xl">Sponsorship Summary</CardTitle>
                <CardDescription>Every sponsored item, aggregated and ready for procurement review.</CardDescription>
              </div>
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search sponsored items"
                className="w-full md:w-72"
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-4 grid md:grid-cols-2 px-0 py-0">
            {filteredItems.map((item) => (
              <Link
                key={item.itemId}
                href={`/admin/dashboard/sponsors/items/${item.itemId}`}
                className="group flex flex-col gap-4 border-b px-6 py-5 transition hover:bg-muted/40 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-muted">
                    {item.image ? (
                      <img src={item.image} alt={item.itemName} className="h-full w-full object-cover" />
                    ) : (
                      <Boxes className="h-7 w-7 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-base font-semibold">{item.itemName}</p>
                      <Badge className={statusClassName[item.status] || statusClassName.awaiting_funding} variant="outline">
                        {item.statusLabel}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.totalSponsoredQuantity} funded · {item.totalAllocatedQuantity} allocated · {item.availableForProcurement} available
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.totalSponsoredAmount.toLocaleString()} USD</p>
                    <p className="text-xs text-muted-foreground">
                      Threshold {item.procurementThreshold} {item.unit}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-[linear-gradient(180deg,rgba(139,201,127,0.08),transparent_22%)]">
          <CardHeader>
            <CardTitle className="text-xl">Procurement Queue</CardTitle>
            <CardDescription>Items with funded quantity ready to be converted into a purchase batch.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 space-y-4">
            {(data?.queue || []).map((item) => (
              <div key={item.itemId} className="rounded-2xl border border-border/80 bg-background/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.itemName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.availableForProcurement}/{item.totalNeeded || item.availableForProcurement} {item.unit} funded
                    </p>
                  </div>
                  <Badge className={statusClassName[item.status] || statusClassName.awaiting_funding} variant="outline">
                    {item.statusLabel}
                  </Badge>
                </div>

                <div className="mt-4 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${Math.min(
                        100,
                        item.totalNeeded > 0 ? (item.totalSponsoredQuantity / item.totalNeeded) * 100 : 100
                      )}%`,
                    }}
                  />
                </div>

                <Button
                  className="mt-4 w-full"
                  disabled={item.availableForProcurement <= 0}
                  onClick={() => {
                    setSelectedItem(item)
                    setQuantity(String(item.availableForProcurement))
                  }}
                >
                  Purchase
                </Button>
              </div>
            ))}

            {data?.queue.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                No items are ready for procurement yet.
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>

      <Dialog open={Boolean(selectedItem)} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-h-[calc(100vh-3rem)] max-w-[calc(100%-1.5rem)] overflow-hidden p-0 sm:max-w-2xl">
          <div className="max-h-[calc(100vh-3rem)] overflow-y-auto px-5 py-6 sm:px-6 sm:py-6">
          <DialogHeader>
            <DialogTitle>Create purchase request</DialogTitle>
            <DialogDescription>
              Raise a procurement batch, assign one volunteer, and send it to management for approval.
            </DialogDescription>
          </DialogHeader>

          {selectedItem ? (
            <div className="grid gap-6 pt-2 md:grid-cols-[140px,1fr] lg:grid-cols-[160px,1fr]">
              <div className="overflow-hidden rounded-3xl border bg-muted">
                {selectedItem.image ? (
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.itemName}
                    className="h-40 w-full object-cover md:h-44"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center md:h-44">
                    <Boxes className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailPill label="Item" value={selectedItem.itemName} />
                  <DetailPill label="Funded quantity" value={`${selectedItem.availableForProcurement} ${selectedItem.unit}`} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity to purchase</label>
                  <Input
                    type="number"
                    min={1}
                    max={selectedItem.availableForProcurement}
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Note</label>
                  <Textarea
                    rows={4}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Optional purchasing or delivery note"
                  />
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedItem(null)}>
              Cancel
            </Button>
            <Button disabled={!selectedItem || !quantity || submitting} onClick={handleCreateRequest}>
              {submitting ? "Submitting..." : "Send for authorization"}
            </Button>
          </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatsCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="rounded-3xl border border-border/80 bg-background/80 dark:bg-gray-900 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl hidden md:block bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  )
}

function DetailPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-muted/40 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  )
}
