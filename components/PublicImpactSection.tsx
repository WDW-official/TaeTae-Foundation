"use client";

import { useEffect, useState } from "react";
import LoadingLogo from "@/components/loading-logo";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import Project100Progress from "@/components/Project100Progress"

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend);

type PublicStats = {
  totals?: {
    totalVolunteers?: number
    totalSponsors?: number
    totalBoys?: number
    totalDonations?: number
  }
  donationsByProgram?: {
    skills?: number
    education?: number
    sports?: number
  }
  boysByProgram?: {
    skills?: number
    sports?: number
    education?: number
  }
  topVolunteers?: Array<{
    name: string
    category: string
    profilePhoto?: string | null
    joined?: string
    createdAt?: string
  }>
  itemsSponsored?: Array<{
    itemName: string
    quantity: number
  }>
  project100Funding?: {
    target: number
    raised: number
    progress: number
    remaining: number
  }
}

function getVolunteerServiceDuration(joinedAt?: string) {
  if (!joinedAt) return "Recently"

  const startDate = new Date(joinedAt)
  if (Number.isNaN(startDate.getTime())) return "Recently"

  const diffMs = Date.now() - startDate.getTime()
  const yearsOfService = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365))
  const monthsOfService = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30))

  if (monthsOfService <= 0) return "Recently"

  return yearsOfService > 0
    ? `${yearsOfService} ${yearsOfService === 1 ? "Year" : "Years"} `
    : `${monthsOfService} ${monthsOfService === 1 ? "Month" : "Months"} `
}

export default function PublicStatsSection() {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    fetchPublicStats();
  }, []);

  async function fetchPublicStats() {
    const res = await fetch("/api/public/stats", { cache: "no-store" });
    const data = await res.json();
    setStats(data as PublicStats);
  }

  if (!stats) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-100">
          <LoadingLogo label="Loading impact data..." />
        </div>
      </section>
    );
  }

  const boysBarData = {
    labels: ["Skills", "Sports", "Education"],
    datasets: [
      {
        label: "Registered Boys",
        data: [
          stats.boysByProgram?.skills || 0,
          stats.boysByProgram?.sports || 0,
          stats.boysByProgram?.education || 0,
        ],
        backgroundColor: ["#8bc97f", "#f97316", "#10b981"],
        borderRadius: 10,
        maxBarThickness: 60,
      },
    ],
  };

  const donationPieData = {
    labels: ["Skills", "Education", "Sports"],
    datasets: [
      {
        data: [
          stats.donationsByProgram?.skills || 0,
          stats.donationsByProgram?.education || 0,
          stats.donationsByProgram?.sports || 0,
        ],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  const impactItems = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2m14-10a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      value: stats.totals?.totalVolunteers || 0,
      label: "Dedicated Volunteers ",
      color: "blue"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7" />
        </svg>
      ),
      value: stats.totals?.totalSponsors || 0,
      label: "Active Sponsors",
      color: "purple"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
        </svg>
      ),
      value: stats.totals?.totalBoys || 0,
      label: "Registered Boys",
      color: "green"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c1.657 0 3-.895 3-2s-1.343-2-3-2-3 .895-3 2 1.343 2 3 2zm0 0v12m-4-6h8" />
        </svg>
      ),
      value: stats.totals?.totalDonations || 0,
      label: "Donations received",
      color: "orange"
    }
  ];

  return (
    <section className="container mx-auto py-5 md:py-10">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-block">
          <h2 className="text-3xl md:text-6xl text-gray-800 dark:text-white font-bold md:mb-4">
            OUR IMPACT SO FAR...
          </h2>
          <div className="h-1 w-full rounded-full"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-4 md:text-xl max-w-2xl mx-auto">
          Below is a glance at our progress thus far. Together, we're making a difference in young lives through education, skills, sports, and mentorship programs.
        </p>
      </div>

      {/* =============== TOTAL STATS CARDS =============== */}
      <div className="bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-900 rounded-2xl p-3 mb-8 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center mt-6 gap-3 mb-8">
          <div className="h-1 w-12 bg-primary rounded-full"></div>
          <h3 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">OUR IMPACT AT A GLANCE</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4  md:gap-6">
          {impactItems.map((item, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center text-center md:p-6 p-3 rounded-xl border-2 border-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/20 dark:hover:border-primary/40"
            >
              <div className={`w-16 h-16 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm mb-4 ${
                item.color === "blue"
                  ? "bg-blue-100 dark:bg-blue-900"
                  : item.color === "purple"
                    ? "bg-purple-100 dark:bg-purple-900"
                    : item.color === "green"
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-orange-100 dark:bg-orange-900"
              }`}>
                <div className={`${
                  item.color === "blue"
                    ? "text-blue-700 dark:text-blue-300"
                    : item.color === "purple"
                      ? "text-purple-700 dark:text-purple-300"
                      : item.color === "green"
                        ? "text-green-700 dark:text-green-300"
                        : "text-orange-700 dark:text-orange-300"
                }`}>
                  {item.icon}
                </div>
              </div>

              <p className={`text-4xl font-bold mb-2 ${
                item.color === "blue"
                  ? "text-blue-700 dark:text-blue-300"
                  : item.color === "purple"
                    ? "text-purple-700 dark:text-purple-300"
                    : item.color === "green"
                      ? "text-green-700 dark:text-green-300"
                      : "text-orange-700 dark:text-orange-300"
              }`}>
                {item.value?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.label}
              </p>

              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 ${
                item.color === "blue"
                  ? "bg-linear-to-br from-blue-50 to-transparent dark:from-blue-950 dark:to-transparent"
                  : item.color === "purple"
                    ? "bg-linear-to-br from-purple-50 to-transparent dark:from-purple-950 dark:to-transparent"
                    : item.color === "green"
                      ? "bg-linear-to-br from-green-50 to-transparent dark:from-green-950 dark:to-transparent"
                      : "bg-linear-to-br from-orange-50 to-transparent dark:from-orange-950 dark:to-transparent"
              }`}></div>
            </div>
          ))}
        </div>
      </div>

      {stats.project100Funding ? (
        <div className="mb-8">
          <Project100Progress raised={stats.project100Funding.raised} />
        </div>
      ) : null}

      {/* =============== CHARTS =============== */}
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 mb-8">
        
        {/* Boys per program */}
        <div className="bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Boys Registered by Program</h3>
          </div>
          <div className="relative w-full h-65 sm:h-80 md:h-80">
            <Bar
              data={boysBarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(156, 163, 175, 0.1)',
                    }
                  },
                  x: {
                    grid: {
                      display: false,
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Donations by program */}
        <div className="bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Donation Distribution</h3>
          </div>
          <div className="h-80 flex items-center justify-center">
            <Pie 
              data={donationPieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      font: {
                        size: 13,
                      }
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                  }
                }
              }}
            />
          </div>
        </div>

      </div>

      {/* =============== VOLUNTEERS & SPONSORED ITEMS SECTION =============== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ⭐ LEFT CARD — VOLUNTEERS */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl md:p-3 p-2 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-700 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Volunteers</h3>
          </div>

          {stats.topVolunteers?.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">No volunteers yet. Be the first to join!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.topVolunteers?.map((vol: any, idx: number) => (
                <div
                  key={idx}
                  className="group flex items-center gap-4 bg-linear-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-600 dark:to-gray-850 md:p-5 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                >
                  <div className="relative">
                    <img
                      src={(vol.profilePhoto || "/placeholder-avatar.png").replace("/upload/", "/upload/f_auto,q_auto/")}
                      alt={vol.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-200 dark:border-purple-800 shadow-sm group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </div>

                  <div className="flex-1">
                    <p className="font-bold text-lg text-gray-900 dark:text-white">{vol.name}</p>
                    <p className="text-sm text-purple-600 dark:text-purple-400 capitalize font-medium">{vol.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-1">
                      {getVolunteerServiceDuration(vol.joined ?? vol.createdAt)}
                    </p>
                  </div>

                  <div className="opacity-0 hidden md:flex group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ⭐ RIGHT CARD — SPONSORED ITEMS */}
        <div className="bg-white dark:to-gray-600 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Sponsored Items</h3>
          </div>

          {stats.itemsSponsored && stats.itemsSponsored.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">No sponsored items yet. Start sponsoring today!</p>
            </div>
          ) : (
            <div className="space-y-5">
              {stats.itemsSponsored?.map((item: any, idx: number) => {
                const maxQty = Math.max(
                  ...(stats.itemsSponsored?.map((x: any) => x.quantity) ?? [0])
                );
                const percentage = (item.quantity / maxQty) * 100;

                return (
                  <div key={idx} className="group bg-linear-to-r from-gray-50 dark:to-gray-600 to-white dark:from-gray-800 dark:to-gray-850 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-gray-900 dark:text-white capitalize flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-700 rounded-full group-hover:scale-150 transition-transform"></span>
                        {item.itemName}
                      </span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {item.quantity} <span className="text-sm" >Qty</span>
                      </span>
                    </div>

                    <div className="relative w-full h-1 bg-gray-200 dark:bg-gray-400 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="h-full w-full bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </section>
  );
}
