import { ObjectId } from "mongodb"
import { getCollection } from "./mongodb"

export type ProcurementStage =
  | "awaiting_authorization"
  | "approved"
  | "rejected"
  | "purchased"
  | "in_transit"
  | "delivered"
  | "distributed"
  | "completed"

export type ProcurementEvidence = {
  id: string
  stage: ProcurementStage
  note?: string
  files: Array<{
    url: string
    kind: "image" | "video" | "document" | "link"
    label?: string
  }>
  uploadedByUserId: string
  uploadedByRole: string
  createdAt: string
}

export type ProcurementStageHistoryEntry = {
  stage: ProcurementStage
  updatedByUserId: string
  updatedByName: string
  updatedByRole: string
  updatedAt: string
}

export type ProcurementBatch = {
  _id?: ObjectId
  id: string
  sponsorItemId: string
  sponsorItemName: string
  sponsorItemImage?: string
  categoryKey?: string
  quantity: number
  quantityFundedSnapshot: number
  quantityAvailableSnapshot: number
  note?: string
  assignedVolunteerId?: string
  assignedVolunteerName?: string
  assignedVolunteerEmail?: string
  requestedByUserId: string
  requestedByRole: string
  requestedAt: string
  approvedByUserId?: string
  approvedAt?: string
  rejectedByUserId?: string
  rejectedAt?: string
  rejectionReason?: string
  status: ProcurementStage
  evidence: ProcurementEvidence[]
  stageHistory: ProcurementStageHistoryEntry[]
  receiptConfirmedAt?: string
  receiptConfirmedBy?: string
  updatedAt: string
}

type SponsorItem = {
  id: string
  name: string
  icon?: string
  images?: string[]
  categoryKey?: string
  totalNeeded?: number
  funded?: number
  unit?: string
  procurementThreshold?: number
  isActive?: boolean
}

type Sponsorship = {
  id: string
  sponsorName?: string
  sponsorEmail?: string
  amount?: number
  currency?: string
  status?: string
  createdAt?: string
  items?: Array<{
    id?: string
    itemId?: string
    itemName?: string
    quantity: number
    totalUSD?: number
  }>
}

type Volunteer = {
  id: string
  name: string
  email: string
  status?: string
}

export type SponsorshipItemSummary = {
  itemId: string
  itemName: string
  image?: string
  categoryKey?: string
  unit?: string
  totalNeeded: number
  totalSponsoredQuantity: number
  totalSponsoredAmount: number
  totalAllocatedQuantity: number
  totalDeliveredQuantity: number
  totalDistributedQuantity: number
  availableForProcurement: number
  procurementThreshold: number
  status: string
  statusLabel: string
}

function stageLabel(stage: ProcurementStage | string) {
  switch (stage) {
    case "awaiting_authorization":
      return "Awaiting Authorization"
    case "approved":
      return "Approved / Ready for Purchase"
    case "rejected":
      return "Rejected"
    case "purchased":
      return "Purchased"
    case "in_transit":
      return "In Transit"
    case "delivered":
      return "Delivered"
    case "distributed":
      return "Distributed"
    case "completed":
      return "Completed"
    default:
      return "Due for Procurement"
  }
}

const PURCHASE_BATCH_STATUS_FLOW: ProcurementStage[] = [
  "approved",
  "purchased",
  "in_transit",
  "delivered",
  "distributed",
  "completed",
]

async function getSponsorItems() {
  const items = await getCollection("sponsorItems")
  return (await items.find({ isActive: { $ne: false } }).toArray()) as unknown as SponsorItem[]
}

async function getSponsorships() {
  const sponsorships = await getCollection("sponsorships")
  return (await sponsorships.find({}).toArray()) as unknown as Sponsorship[]
}

async function getUserDisplayName(userId: string) {
  const users = await getCollection("users")
  const user = await users.findOne(
    { id: userId },
    { projection: { _id: 0, id: 1, name: 1, email: 1 } }
  )

  if (!user) {
    return "Unknown user"
  }

  return (typeof user.name === "string" && user.name.trim()) || String(user.email || "Unknown user")
}

export async function getProcurementBatches(filter: Record<string, unknown> = {}) {
  const batches = await getCollection("procurementBatches")
  return (await batches.find(filter).sort({ requestedAt: -1 }).toArray()) as unknown as ProcurementBatch[]
}

export async function getProcurementBatchById(batchId: string) {
  const batches = await getCollection("procurementBatches")
  return (await batches.findOne({ id: batchId })) as ProcurementBatch | null
}

export async function listApprovedVolunteers() {
  const volunteers = await getCollection("volunteers")
  return (await volunteers
    .find({ status: "approved" }, { projection: { _id: 0, id: 1, name: 1, email: 1, status: 1 } })
    .sort({ name: 1 })
    .toArray()) as unknown as Volunteer[]
}

export function getProcurementThreshold(item: SponsorItem) {
  return Math.max(Number(item.procurementThreshold || 1), 1)
}

type SponsorshipLine = NonNullable<Sponsorship["items"]>[number]

function lineMatchesItem(line: SponsorshipLine, itemId: string) {
  return line.itemId === itemId || line.id === itemId
}

function getBatchPrefix(itemName: string) {
  const normalized = itemName.toLowerCase()

  if (normalized.includes("football")) return "FC"
  if (normalized.includes("stem")) return "SK"
  if (normalized.includes("kit")) return "KT"
  if (normalized.includes("book")) return "BK"

  const words = itemName
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase()
  }

  return itemName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "BT"
}

export async function generateProcurementBatchId(itemName: string) {
  const prefix = getBatchPrefix(itemName)
  const batches = await getProcurementBatches()
  const count = batches.filter((batch) => batch.id.startsWith(`${prefix}-`)).length + 1
  return `${prefix}-${String(count).padStart(4, "0")}`
}

export async function aggregateSponsorshipItems() {
  const [items, sponsorships, batches] = await Promise.all([
    getSponsorItems(),
    getSponsorships(),
    getProcurementBatches(),
  ])

  return items.map((item) => {
    const sponsorshipLines = sponsorships.flatMap((sponsorship) =>
      (sponsorship.items || [])
        .filter((line) => lineMatchesItem(line, item.id))
        .map((line) => ({
          sponsorName: sponsorship.sponsorName || "Anonymous",
          quantity: Number(line.quantity || 0),
          amount: Number(line.totalUSD || Number(item.funded || 0)),
        }))
    )

    const itemBatches = batches.filter((batch) => batch.sponsorItemId === item.id)
    const totalSponsoredQuantity = sponsorshipLines.reduce((sum, line) => sum + line.quantity, 0)
    const totalSponsoredAmount = sponsorshipLines.reduce((sum, line) => sum + Number(line.amount || 0), 0)
    const totalAllocatedQuantity = itemBatches
      .filter((batch) => batch.status !== "rejected")
      .reduce((sum, batch) => sum + Number(batch.quantity || 0), 0)
    const totalDeliveredQuantity = itemBatches
      .filter((batch) => ["delivered", "distributed", "completed"].includes(batch.status))
      .reduce((sum, batch) => sum + Number(batch.quantity || 0), 0)
    const totalDistributedQuantity = itemBatches
      .filter((batch) => ["distributed", "completed"].includes(batch.status))
      .reduce((sum, batch) => sum + Number(batch.quantity || 0), 0)
    const availableForProcurement = Math.max(totalSponsoredQuantity - totalAllocatedQuantity, 0)
    const threshold = getProcurementThreshold(item)

    let status = "awaiting_funding"
    if (availableForProcurement >= threshold) {
      status = "due_for_procurement"
    } else if (itemBatches.length > 0) {
      status = [...itemBatches].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0].status
    }

    return {
      itemId: item.id,
      itemName: item.name,
      image: item.images?.[0] || item.icon,
      categoryKey: item.categoryKey,
      unit: item.unit || "units",
      totalNeeded: Number(item.totalNeeded || 0),
      totalSponsoredQuantity,
      totalSponsoredAmount,
      totalAllocatedQuantity,
      totalDeliveredQuantity,
      totalDistributedQuantity,
      availableForProcurement,
      procurementThreshold: threshold,
      status,
      statusLabel:
        status === "due_for_procurement" ? "Due for Procurement" : stageLabel(status),
    } satisfies SponsorshipItemSummary
  })
}

export async function getSponsorshipItemDetail(itemId: string, page = 1, pageSize = 20) {
  const [items, sponsorships, batches] = await Promise.all([
    getSponsorItems(),
    getSponsorships(),
    getProcurementBatches(),
  ])

  const item = items.find((entry) => entry.id === itemId)
  if (!item) {
    return null
  }

  const sponsors = sponsorships
    .flatMap((sponsorship) =>
      (sponsorship.items || [])
        .filter((line) => lineMatchesItem(line, itemId))
        .map((line) => ({
          sponsorshipId: sponsorship.id,
          sponsorName: sponsorship.sponsorName || "Anonymous",
          sponsorEmail: sponsorship.sponsorEmail || "",
          quantity: Number(line.quantity || 0),
          amount: Number(line.totalUSD || 0),
          createdAt: sponsorship.createdAt || "",
        }))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const start = (page - 1) * pageSize
  const paginatedSponsors = sponsors.slice(start, start + pageSize)

  return {
    item,
    sponsors: paginatedSponsors,
    pagination: {
      page,
      pageSize,
      total: sponsors.length,
      totalPages: Math.max(Math.ceil(sponsors.length / pageSize), 1),
    },
    batches: batches.filter((batch) => batch.sponsorItemId === itemId),
  }
}

export async function createPurchaseRequest(input: {
  sponsorItemId: string
  quantity: number
  note?: string
  requester: {
    id: string
    role: string
  }
}) {
  const summary = await aggregateSponsorshipItems()

  const itemSummary = summary.find((item) => item.itemId === input.sponsorItemId)

  if (!itemSummary) {
    throw new Error("Sponsor item not found")
  }

  if (input.quantity <= 0) {
    throw new Error("Purchase quantity must be greater than zero")
  }

  if (input.quantity > itemSummary.availableForProcurement) {
    throw new Error("Requested quantity exceeds funded quantity available for procurement")
  }

  const batches = await getCollection("procurementBatches")
  const id = await generateProcurementBatchId(itemSummary.itemName)
  const now = new Date().toISOString()

  const batch: ProcurementBatch = {
    _id: new ObjectId(),
    id,
    sponsorItemId: itemSummary.itemId,
    sponsorItemName: itemSummary.itemName,
    sponsorItemImage: itemSummary.image,
    categoryKey: itemSummary.categoryKey,
    quantity: input.quantity,
    quantityFundedSnapshot: itemSummary.totalSponsoredQuantity,
    quantityAvailableSnapshot: itemSummary.availableForProcurement,
    note: input.note,
    assignedVolunteerId: undefined,
    assignedVolunteerName: undefined,
    assignedVolunteerEmail: undefined,
    requestedByUserId: input.requester.id,
    requestedByRole: input.requester.role,
    requestedAt: now,
    status: "awaiting_authorization",
    evidence: [],
    stageHistory: [],
    updatedAt: now,
  }

  await batches.insertOne(batch)
  return batch
}

export async function getApprovalQueue() {
  return getProcurementBatches({ status: "awaiting_authorization" })
}

export async function decidePurchaseRequest(input: {
  batchId: string
  decision: "approve" | "reject"
  actorId: string
  rejectionReason?: string
}) {
  const batches = await getCollection("procurementBatches")
  const batch = await getProcurementBatchById(input.batchId)

  if (!batch) {
    throw new Error("Purchase request not found")
  }

  const now = new Date().toISOString()
  const updates: Partial<ProcurementBatch> =
    input.decision === "approve"
      ? {
          status: "approved",
          approvedByUserId: input.actorId,
          approvedAt: now,
          updatedAt: now,
        }
      : {
          status: "rejected",
          rejectedByUserId: input.actorId,
          rejectedAt: now,
          rejectionReason: input.rejectionReason || "Rejected by management",
          updatedAt: now,
        }

  if (input.decision === "approve") {
    const actorName = await getUserDisplayName(input.actorId)
    updates.stageHistory = [
      ...(batch.stageHistory || []),
      {
        stage: "approved",
        updatedByUserId: input.actorId,
        updatedByName: actorName,
        updatedByRole: "superAdmin",
        updatedAt: now,
      },
    ]
  }

  await batches.updateOne({ id: input.batchId }, { $set: updates })
  return { ...batch, ...updates }
}

export async function updateProcurementBatch(
  batchId: string,
  input: {
    status?: ProcurementStage
    note?: string
    evidence?: ProcurementEvidence[]
    receiptConfirmedBy?: string
    actorId?: string
    actorRole?: string
    assignedVolunteerId?: string
  }
) {
  const batches = await getCollection("procurementBatches")
  let batch = await getProcurementBatchById(batchId)

  if (!batch) {
    throw new Error("Procurement batch not found")
  }

  if (input.status) {
    batch = await updateStatus(batchId, input.status, input.actorId, input.actorRole)
  }

  let assignedVolunteerUpdates: Partial<ProcurementBatch> = {}

  if (input.assignedVolunteerId !== undefined) {
    const volunteers = await listApprovedVolunteers()
    const volunteer = volunteers.find((entry) => entry.id === input.assignedVolunteerId)

    if (!volunteer) {
      throw new Error("Assigned volunteer not found")
    }

    assignedVolunteerUpdates = {
      assignedVolunteerId: volunteer.id,
      assignedVolunteerName: volunteer.name,
      assignedVolunteerEmail: volunteer.email,
    }
  }

  const now = new Date().toISOString()
  const updates: Partial<ProcurementBatch> = {
    ...(input.status ? { status: input.status } : {}),
    ...(input.note !== undefined ? { note: input.note } : {}),
    ...(input.evidence ? { evidence: [...batch.evidence, ...input.evidence] } : {}),
    ...assignedVolunteerUpdates,
    ...(input.receiptConfirmedBy
      ? {
          receiptConfirmedAt: now,
          receiptConfirmedBy: input.receiptConfirmedBy,
        }
      : {}),
    updatedAt: now,
  }

  await batches.updateOne({ id: batchId }, { $set: updates })
  return { ...batch, ...updates }
}

export async function updateStatus(
  batchId: string,
  newStatus: ProcurementStage,
  actorId?: string,
  actorRole?: string
) {
  const batches = await getCollection("procurementBatches")
  const batch = await getProcurementBatchById(batchId)

  if (!batch) {
    throw new Error("Procurement batch not found")
  }

  const currentIndex = PURCHASE_BATCH_STATUS_FLOW.indexOf(batch.status)
  const nextStatus = currentIndex >= 0 ? PURCHASE_BATCH_STATUS_FLOW[currentIndex + 1] : null

  if (nextStatus !== newStatus) {
    throw new Error(`Invalid status transition from ${batch.status} to ${newStatus}`)
  }

  if (!actorId || !actorRole) {
    throw new Error("Missing actor for status update")
  }

  const actorName = await getUserDisplayName(actorId)
  const updatedAt = new Date().toISOString()

  const updates: Partial<ProcurementBatch> = {
    status: newStatus,
    updatedAt,
    stageHistory: [
      ...(batch.stageHistory || []),
      {
        stage: newStatus,
        updatedByUserId: actorId,
        updatedByName: actorName,
        updatedByRole: actorRole,
        updatedAt,
      },
    ],
  }

  await batches.updateOne({ id: batchId }, { $set: updates })
  return { ...batch, ...updates }
}

export function canVolunteerManageBatch(batch: ProcurementBatch, volunteerId?: string) {
  return Boolean(volunteerId && batch.assignedVolunteerId === volunteerId)
}
