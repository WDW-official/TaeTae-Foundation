"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { TrendingUp, Award, Heart, Zap, Home } from "lucide-react"
import BackButton from "@/components/backButton"
import LoadingLogo from "@/components/loading-logo"

interface Boy {
  id: string
  fullName: string
  age: number
  program: string
  growthMetrics: {
    skillsLevel: number
    educationScore: number
    athleticAbility: number
    totalScore: number
  }
  background: string
  goals: string
}

export default function SponsorDashboard() {
  const params = useParams()
  const boyId = typeof params?.id === "string" ? params.id : ""
  const [boy, setBoy] = useState<Boy | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBoy = async () => {
      if (!boyId) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/boys/${boyId}`)
        if (res.ok) {
          const data = await res.json()
          setBoy(data)
        }
      } catch (error) {
        console.error(" Error fetching boy:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBoy()
  }, [boyId])

  if (loading) {
    return (
      <div className="min-h-screen bg-card dark:bg-gray-900 flex items-center justify-center">
        <LoadingLogo label="Loading profile..." />
      </div>
    )
  }

  if (!boy) {
    return (
      <div className="min-h-screen bg-card dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground mb-4">Boy not found</p>
          <BackButton label="Back"/>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-card dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
       <BackButton label="Back"/>

        <div className="bg-linear-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-primary flex items-center gap-3 mb-4">
            <Heart className="w-10 h-10" />
            Your Sponsored Boy
          </h1>
          <p className="text-foreground">Track {boy.fullName}'s growth and achievements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card dark:bg-gray-900 border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">{boy.fullName}</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="text-foreground font-semibold">{boy.age} years old</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Program</p>
                <p className="text-foreground font-semibold capitalize">{boy.program}</p>
              </div>
            </div>
          </div>

          <div className="bg-card dark:bg-gray-900 border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">About Him</h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Background</p>
                <p className="text-foreground">{boy.background || "Not shared"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Goals</p>
                <p className="text-foreground">{boy.goals || "Not shared"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-gray-900 border border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6" />
            Growth Progress
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-secondary rounded-lg p-6 border border-border">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Skills Level</p>
                  <p className="text-3xl font-bold text-primary">{boy.growthMetrics.skillsLevel}/10</p>
                </div>
                <Zap className="w-6 h-6 text-primary/50" />
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${(boy.growthMetrics.skillsLevel / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-secondary rounded-lg p-6 border border-border">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Education Score</p>
                  <p className="text-3xl font-bold text-primary">{boy.growthMetrics.educationScore}/10</p>
                </div>
                <Award className="w-6 h-6 text-primary/50" />
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${(boy.growthMetrics.educationScore / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-secondary rounded-lg p-6 border border-border">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Athletic Ability</p>
                  <p className="text-3xl font-bold text-primary">{boy.growthMetrics.athleticAbility}/10</p>
                </div>
                <Heart className="w-6 h-6 text-primary/50" />
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${(boy.growthMetrics.athleticAbility / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-primary/10 rounded-lg p-6 border border-primary/20 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overall Score</p>
                <p className="text-3xl font-bold text-primary">{boy.growthMetrics.totalScore}/10</p>
              </div>
              <Award className="w-8 h-8 text-primary/50" />
            </div>
          </div>

          <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-sm font-semibold text-foreground">
              Your sponsorship is making a real difference! Keep following {boy.fullName}'s journey.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
