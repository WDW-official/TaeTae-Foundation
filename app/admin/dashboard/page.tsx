"use client";

import { useState, useEffect } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import {
  BarChart3,
  LogOut,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Download,
  Calendar,
  Activity,
  Heart,
  Target,
  ArrowUpRight,
  Trophy,
  Package,
  Moon,
  Sun,
  Medal,
  Clock,
  Banknote,
  KeyRound
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
import { X, UserPlus } from "lucide-react"
import { useAuthStore } from "@/app/store/auth.store";
import ChangePasswordModal from "@/components/ChangePasswordModal";


interface DashboardStats {
  totals: {
    totalDonations: number;
    donationCount: number;
    totalVolunteers: number;
    totalSponsors: number;
    totalBoys: number;
  };
  donationsByProgram: {
    skills: number;
    education: number;
    sports: number;
  };
  topDonors: Array<{
    name: string;
    amount: number;
  }>;
  topSponsors: Array<{
    name: string;
    amount: number;
  }>;
  hallOfFame: Array<{
    name: string;
    amount: number;
    type: "sponsor" | "donor";
  }>;
  topVolunteers: Array<{
    id: string;
    name: string;
    category: string;
    profilePhoto: string;
    createdAt: string;
  }>;
  barChartItems: Array<{
    itemId: string;
    quantity: number;
  }>;
  quarterly: Record<string, number>;
  yearly: Record<string, number>;
}

export default function AdminDashboard() {
  const role = useAuthStore((s) => s.role)

  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [creatingAdmin, setCreatingAdmin] = useState(false)
  const [adminMessage, setAdminMessage] = useState<string | null>(null)
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false)

  useEffect(() => {
    fetchStats();
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", (!darkMode).toString());
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingAdmin(true)
    setAdminMessage(null)

    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setAdminMessage(data.error || "Failed to create admin")
      } else {
        setAdminMessage("Admin created successfully")
        setAdminEmail("")
        setAdminPassword("")
        setShowAddAdmin(false)
      }
    } catch {
      setAdminMessage("Something went wrong")
    } finally {
      setCreatingAdmin(false)
    }
  }


  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const quarterlyLabels = Object.keys(stats.quarterly);
  const quarterlyData = Object.values(stats.quarterly);
  const yearlyLabels = Object.keys(stats.yearly);
  const yearlyData = Object.values(stats.yearly);

  const donationTrendData = {
    labels: quarterlyLabels,
    datasets: [
      {
        label: "Quarterly Donations",
        data: quarterlyData,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  const programDistributionData = {
    labels: ["Skills", "Education", "Sports"],
    datasets: [
      {
        data: [
          stats.donationsByProgram.skills,
          stats.donationsByProgram.education,
          stats.donationsByProgram.sports
        ],
        backgroundColor: ["#2261c5ff", "#10b981", "#cc6e16ff"],
        borderWidth: 0
      }
    ]
  };

  const itemsChartData = {
    labels: stats.barChartItems.map(item => item.itemId.charAt(0).toUpperCase() + item.itemId.slice(1)),
    datasets: [
      {
        label: "Items Sponsored",
        data: stats.barChartItems.map(item => item.quantity),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderRadius: 8
      }
    ]
  };

  const getMedalColor = (index: number) => {
    if (index === 0) return "bg-yellow-500";
    if (index === 1) return "bg-gray-400";
    if (index === 2) return "bg-orange-600";
    return "bg-primary/20 text-primary";
  };

  return (
    <div className="min-h-screen dark:bg-gray-800 ">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-xl md:text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Overview of your foundation's programs, volunteers, and contributions
            </p>
          </div>
            <button
              onClick={() => setShowChangePassword(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-primary/90 transition"
            >
              <KeyRound size={16} />
              Change Password
            </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Banknote className="w-6 h-6" />
              </div>
              <span className="flex items-center text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                {stats.totals.donationCount}
              </span>
            </div>
            <h3 className="text-white/80 text-sm mb-1">Total Donations</h3>
            <p className="text-xl font-bold">₦{stats.totals.totalDonations.toLocaleString()}</p>
            <p className="text-white/70 text-xs mt-2">{stats.totals.donationCount} donations</p>
          </div>

          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-white/80 text-sm mb-1">Total Volunteers</h3>
            <p className="text-xl font-bold">{stats.totals.totalVolunteers}</p>
            <p className="text-white/70 text-xs mt-2">Active members</p>
          </div>

          <div className="bg-linear-to-br from-lime-800 to-lime-900 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-white/80 text-sm mb-1">Boys in Program</h3>
            <p className="text-xl font-bold">{stats.totals.totalBoys}</p>
            <p className="text-white/70 text-xs mt-2">Across all tracks</p>
          </div>

          {/* <div className="bg-linear-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Heart className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-white/80 text-sm mb-1">Active Sponsors</h3>
            <p className="text-xl font-bold">{stats.totals.totalSponsors}</p>
            <p className="text-white/70 text-xs mt-2">Supporting boys</p>
          </div> */}

          <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Trophy className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-white/80 text-sm mb-1">Total Impact</h3>
            <p className="text-xl font-bold">₦{yearlyData.reduce((a, b) => a + b, 0).toLocaleString()}</p>
            <p className="text-white/70 text-xs mt-2">All time</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/admin/dashboard/boys"
            className="bg-card dark:bg-gray-900 dark:bg-gray-900 border border-border rounded-xl p-4 hover:shadow-lg transition text-center group"
          >
            <Users className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition" />
            <p className="font-semibold text-foreground">Manage Boys</p>
          </Link>
          <Link
            href="/admin/dashboard/volunteers"
            className="bg-card dark:bg-gray-900 dark:bg-gray-900 border border-border rounded-xl p-4 hover:shadow-lg transition text-center group"
          >
            <Activity className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition" />
            <p className="font-semibold text-foreground">Volunteers</p>
          </Link>
          <Link
            href="/admin/dashboard/donations"
            className="bg-card dark:bg-gray-900 dark:bg-gray-900 border border-border rounded-xl p-4 hover:shadow-lg transition text-center group"
          >
            <Banknote className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition" />
            <p className="font-semibold text-foreground">Donations</p>
          </Link>
          <Link
            href="/admin/dashboard/sponsors"
            className="bg-card dark:bg-gray-900 dark:bg-gray-900 border border-border rounded-xl p-4 hover:shadow-lg transition text-center group"
          >
            <Heart className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition" />
            <p className="font-semibold text-foreground">Sponsors</p>
          </Link>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Donation Trends */}
          <div className="lg:col-span-2 bg-card dark:bg-gray-900 dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-border">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground">Donation Trends</h2>
              <p className="text-sm text-muted-foreground">Quarterly performance</p>
            </div>
            <Line
              data={donationTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    padding: 12,
                    cornerRadius: 8
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: "rgba(0, 0, 0, 0.05)" },
                    ticks: { color: "#6b7280" }
                  },
                  x: {
                    grid: { display: false },
                    ticks: { color: "#6b7280" }
                  }
                }
              }}
            />
          </div>

          {/* Program Distribution */}
          <div className="bg-card dark:bg-gray-900 dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-border">
            <h2 className="text-xl font-bold text-foreground mb-2">Program Distribution</h2>
            <p className="text-sm text-muted-foreground mb-6">Donations by track</p>
            <div className="h-64">
              <Doughnut
                data={programDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { 
                        padding: 15, 
                        font: { size: 12 },
                        color: "#374151"
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Top 5 Lists Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 🥇 Top 5 Donors */}
          <div className="bg-card dark:bg-gray-900 dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Medal className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">🥇 Top 5 Donors</h2>
                <p className="text-sm text-muted-foreground">Highest contributors</p>
              </div>
            </div>
            <div className="space-y-3">
              {stats.topDonors?.slice(0, 5).map((donor, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl hover:bg-secondary/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${getMedalColor(idx)}`}>
                      {idx + 1}
                    </div>
                    <p className="font-semibold text-foreground">{donor.name}</p>
                  </div>
                  <p className="font-bold text-green-600">₦{donor.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 🥈 Top 5 Sponsors */}
          <div className="bg-card dark:bg-gray-900 dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">🥈 Top 5 Sponsors</h2>
                <p className="text-sm text-muted-foreground">Most active sponsors</p>
              </div>
            </div>
            <div className="space-y-3">
              {stats.topSponsors?.slice(0, 5).map((sponsor, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl hover:bg-secondary/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${getMedalColor(idx)}`}>
                      {idx + 1}
                    </div>
                    <p className="font-semibold text-foreground">{sponsor.name}</p>
                  </div>
                  <p className="font-bold text-emerald-600">₦{sponsor.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 🏆 Hall of Fame */}
          <div className="bg-card dark:bg-gray-900 dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Trophy className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">🏆 Hall of Fame</h2>
                <p className="text-sm text-muted-foreground">All-time top contributors</p>
              </div>
            </div>
            <div className="space-y-3">
              {stats.hallOfFame?.slice(0, 5).map((entry, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl hover:bg-secondary/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${getMedalColor(idx)}`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{entry.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        entry.type === "sponsor" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {entry.type}
                      </span>
                    </div>
                  </div>
                  <p className="font-bold text-orange-600">₦{entry.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 🧑‍🤝‍🧑 Top 5 Volunteers */}
          <div className="bg-card dark:bg-gray-900 dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">🧑‍🤝‍🧑 Top 5 Volunteers</h2>
                <p className="text-sm text-muted-foreground">Longest serving members</p>
              </div>
            </div>
            <div className="space-y-3">
              {stats.topVolunteers?.slice(0, 5).map((volunteer, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl hover:bg-secondary/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${getMedalColor(idx)}`}>
                      {idx + 1}
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        src={volunteer.profilePhoto || '/placeholder-avatar.png'}
                        alt={volunteer.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect fill="%23e5e7eb" width="40" height="40"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="16">?</text></svg>';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-foreground">{volunteer.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{volunteer.category}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {volunteer.createdAt ? Math.floor((new Date().getTime() - new Date(volunteer.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365)) : 0}year(s)
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Items Sponsored Chart */}
        <div className="bg-card dark:bg-gray-900 dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Items Sponsored</h2>
          </div>
          <Bar
            data={itemsChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  padding: 12,
                  cornerRadius: 8
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: "rgba(0, 0, 0, 0.05)" },
                  ticks: { color: "#6b7280" }
                },
                x: {
                  grid: { display: false },
                  ticks: { color: "#6b7280" }
                }
              }
            }}
          />
        </div>
      </div>
      <ChangePasswordModal
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </div>
  );
}