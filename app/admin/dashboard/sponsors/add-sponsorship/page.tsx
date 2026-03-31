"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type CategoryKey = "skill" | "sport" | "education" | "nutrient" 

type Section = {
  id: string
  title: string
  categoryKey: CategoryKey
}

type Item = {
  id: string
  name: string
  description?: string
  icon: string
  categoryKey: CategoryKey
  sectionId: string
  priceUSD: number
  totalNeeded: number
  funded: number
  unit?: string
  isActive: boolean
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })
}

export default function AdminSponsorshipPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  const [newSection, setNewSection] = useState({
    title: "",
    categoryKey: "equipment" as CategoryKey,
  })

  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    categoryKey: "equipment" as CategoryKey,
    sectionId: "",
    priceUSD: 0,
    totalNeeded: 0,
    funded: 0,
    unit: "",
    isActive: true,
    images_base64: [] as string[],
  })

  async function loadData() {
    try {
      const [sectionsRes, itemsRes] = await Promise.all([
        fetch("/api/admin/sponsor/sections"),
        fetch("/api/admin/sponsor/items"),
      ])

      const sectionsData = await sectionsRes.json()
      const itemsData = await itemsRes.json()

      setSections(sectionsData.sections || [])
      setItems(itemsData.items || [])
    } catch (error) {
      console.error("Failed to load admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredSections = useMemo(() => {
    return sections.filter((s) => s.categoryKey === newItem.categoryKey)
  }, [sections, newItem.categoryKey])

  async function handleCreateSection() {
    const res = await fetch("/api/admin/sponsor/sections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSection),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || "Failed to create section")
      return
    }

    setNewSection({
      title: "",
      categoryKey: "skill",
    })

    await loadData()
  }

  async function handleCreateItem() {
    const res = await fetch("/api/admin/sponsor/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || "Failed to create item")
      return
    }

    setNewItem({
      name: "",
      description: "",
      categoryKey: "skill",
      sectionId: "",
      priceUSD: 0,
      totalNeeded: 0,
      funded: 0,
      unit: "",
      isActive: true,
      images_base64: [] as string[],
    })

    await loadData()
  }

  async function handleFundingUpdate(itemId: string, funded: number) {
    const res = await fetch("/api/admin/sponsor/items", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: itemId,
        funded,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || "Failed to update funding")
      return
    }

    await loadData()
  }

  if (loading) {
    return <div className="p-8">Loading admin sponsorship setup...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <Link href="/admin/dashboard/sponsors" className="text-primary hover:underline mb-6 inline-block">
        ← Back
      </Link> 
      <h1 className="text-3xl font-bold">Sponsorship Item Setup</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="border dark:bg-gray-900 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Create Section</h2>

        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
            Section Title
            </label>
            <input
            type="text"
            value={newSection.title}
            onChange={(e) =>
                setNewSection((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full border rounded-lg px-4 py-2"
            />
        </div>

        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
            Category
            </label>
            <select
            value={newSection.categoryKey}
            onChange={(e) =>
                setNewSection((prev) => ({
                ...prev,
                categoryKey: e.target.value as CategoryKey,
                }))
            }
            className="w-full border rounded-lg px-4 py-2"
            >
            <option value="skill">Skill</option>
            <option value="sport">Sport</option>
            <option value="education">Education</option>
            <option value="nutrient">Nutrient</option>
            </select>
        </div>

        <button
            onClick={handleCreateSection}
            className="px-4 py-2 rounded-lg bg-green-700 text-white"
        >
            Save Section
        </button>
        </div>


        <div className="border rounded-2xl dark:bg-gray-900 p-6 space-y-4">
          <h2 className="text-xl font-semibold">Create Item</h2>

          <div className="space-y-1">
              <label className="text-sm  font-medium ">
              Item Name
              </label>
              <input
              type="text"
              value={newItem.name}
              onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full border rounded-lg px-4 py-2"
              />
          </div>

          <div className="space-y-1">
              <label className="text-sm font-medium ">
              Description
              </label>
              <textarea
              value={newItem.description}
              onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full border rounded-lg px-4 py-2"
              />
          </div>

          <div className="space-y-1">
              <label className="text-sm font-medium ">
              Upload Icon
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files || [])

                  if (!files.length) return

                  const base64Images = await Promise.all(
                    files.map((file) => fileToBase64(file))
                  )

                  setNewItem((prev) => ({
                    ...prev,
                    images_base64: base64Images,
                  }))
                }}
                className="w-full"
              />

          </div>
          {newItem.images_base64.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {newItem.images_base64.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`Preview ${index}`}
                    className="w-full h-24 object-cover rounded-xl border"
                  />

                  {/* Remove button */}
                  <button
                    onClick={() =>
                      setNewItem((prev) => ({
                        ...prev,
                        images_base64: prev.images_base64.filter((_, i) => i !== index),
                      }))
                    }
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}


          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
              <label className="text-sm font-medium ">
                  Price (USD)
              </label>
              <input
                  type="number"
                  value={newItem.priceUSD}
                  onChange={(e) =>
                  setNewItem((prev) => ({
                      ...prev,
                      priceUSD: Number(e.target.value),
                  }))
                  }
                  className="w-full border rounded-lg px-4 py-2"
              />
              </div>

              <div className="space-y-1">
              <label className="text-sm font-medium ">
                  Total Needed
              </label>
              <input
                  type="number"
                  value={newItem.totalNeeded}
                  onChange={(e) =>
                  setNewItem((prev) => ({
                      ...prev,
                      totalNeeded: Number(e.target.value),
                  }))
                  }
                  className="w-full border rounded-lg px-4 py-2"
              />
              </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
              <label className="text-sm font-medium ">
                  Already Funded
              </label>
              <input
                  type="number"
                  value={newItem.funded}
                  onChange={(e) =>
                  setNewItem((prev) => ({
                      ...prev,
                      funded: Number(e.target.value),
                  }))
                  }
                  className="w-full border rounded-lg px-4 py-2"
              />
              </div>

              {/* <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                  Unit
              </label>
              <input
                  type="text"
                  value={newItem.unit}
                  onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, unit: e.target.value }))
                  }
                  className="w-full border rounded-lg px-4 py-2"
              />
              </div> */}
          </div>

          <div className="space-y-1">
              <label className="text-sm font-medium ">
              Category
              </label>

              <select
              value={newItem.categoryKey}
              onChange={(e) =>
                  setNewItem((prev) => ({
                  ...prev,
                  categoryKey: e.target.value as CategoryKey,
                  sectionId: "",
                  }))
              }
              className="w-full border rounded-lg px-4 py-2"
              >
              <option value="equipment">Equipment</option>
              <option value="materials">Materials</option>
              <option value="support">Support</option>
              </select>
          </div>

          <div className="space-y-1">
              <label className="text-sm font-medium ">
              Section
              </label>

              <select
              value={newItem.sectionId}
              onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, sectionId: e.target.value }))
              }
              className="w-full border rounded-lg px-4 py-2"
              >
              <option value="">Select section</option>

              {filteredSections.map((section) => (
                  <option key={section.id} value={section.id}>
                  {section.title}
                  </option>
              ))}
              </select>
          </div>

          <label className="flex items-center gap-2">
              <input
              type="checkbox"
              checked={newItem.isActive}
              onChange={(e) =>
                  setNewItem((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                  }))
              }
              />
              Active
          </label>

          <button
              onClick={handleCreateItem}
              className="px-4 py-2 rounded-lg bg-green-700 text-white"
          >
              Save Item
          </button>
          </div>

        </div>

      <div className="border rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Items Overview</h2>

        <div className="space-y-4">
          {items.map((item) => {
            const remaining = Math.max(item.totalNeeded - item.funded, 0)
            const progress =
              item.totalNeeded > 0
                ? Math.min((item.funded / item.totalNeeded) * 100, 100)
                : 0

            return (
              <div key={item.id} className="border rounded-xl p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    {item.icon ? (
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded-xl bg-[#eef5e9] p-2"
                      />
                    ) : null}

                    <div>
                      <div className="font-semibold text-lg">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                      <div className="text-sm mt-1">
                        Category: {item.categoryKey} | Needed: {item.totalNeeded} | Funded: {item.funded} | Remaining: {remaining}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      defaultValue={item.funded}
                      min={0}
                      max={item.totalNeeded}
                      onBlur={(e) =>
                        handleFundingUpdate(item.id, Number(e.target.value))
                      }
                      className="w-24 border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div className="mt-3 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-green-700 h-3 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
