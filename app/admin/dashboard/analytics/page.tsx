"use client"

import BackButton from "@/components/backButton"
import Link from "next/link"

export default function AdminAnalytics() {
  return (
    <div className="max-w-6xl min-h-screen mx-auto px-4 py-12 bg-[radial-gradient(circle_at_top_left,rgba(139,201,127,0.18),transparent_35%),linear-gradient(135deg,rgba(10,26,26,0.04),transparent_55%)]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Analytics & Insights</h1>
        <BackButton label="Back"/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card dark:bg-gray-900 dark:bg-gray-900 border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-primary mb-4">Program Breakdown</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Skills</span>
                <span className="font-bold text-primary">35%</span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "35%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Education</span>
                <span className="font-bold text-primary">45%</span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "45%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Sports</span>
                <span className="font-bold text-primary">20%</span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "20%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-gray-900 dark:bg-gray-900 border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-primary mb-4">Impact Summary</h2>
          <div className="space-y-4">
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-3xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">Boys Impacted</div>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-3xl font-bold text-primary">45</div>
              <div className="text-sm text-muted-foreground">Active Volunteers</div>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-3xl font-bold text-primary">$15K+</div>
              <div className="text-sm text-muted-foreground">Total Donations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
