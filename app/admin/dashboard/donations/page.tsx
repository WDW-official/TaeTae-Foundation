"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DollarSign,
  ArrowLeft,
  Download,
  Trash2,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  Mail,
  User,
  Eye,
  Receipt,
  Banknote
} from "lucide-react";
import BackButton from "@/components/backButton";
import { AdminDataTable } from "@/components/admin/admin-data-table";

interface Donation {
  id: string;
  name: string;
  email?: string;
  program: "skills" | "education" | "sports" | "project 100";
  amount: number;
  createdAt: string;
  paymentMethod?: string;
  status?: "completed" | "pending" | "failed";
}

export default function AdminDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProgram, setFilterProgram] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [donations, searchQuery, filterProgram, filterStatus, dateRange]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterProgram, filterStatus, dateRange]);

  const fetchDonations = async () => {
    try {
      const res = await fetch("/api/admin/donations");
      if (res.ok) {
        const data = await res.json();
        setDonations(data.donations);
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...donations];

    if (searchQuery) {
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterProgram !== "all") {
      filtered = filtered.filter((d) => d.program === filterProgram);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((d) => d.status === filterStatus);
    }

    if (dateRange !== "all") {
      const now = new Date();
      filtered = filtered.filter((d) => {
        const donationDate = new Date(d.createdAt);
        const diffDays = Math.floor((now.getTime() - donationDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dateRange === "week") return diffDays <= 7;
        if (dateRange === "month") return diffDays <= 30;
        if (dateRange === "year") return diffDays <= 365;
        return true;
      });
    }

    setFilteredDonations(filtered);
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Program", "Amount", "Date", "Status"];
    const rows = filteredDonations.map((d) => [
      d.name,
      d.email || "N/A",
      d.program,
      `$${d.amount}`,
      new Date(d.createdAt).toLocaleDateString(),
      d.status || "completed"
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this donation record?")) return;
    try {
      const res = await fetch(`/api/admin/donations?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setDonations(donations.filter((d) => d.id !== id));
      }
    } catch (error) {
      console.error("Error deleting donation:", error);
    }
  };

  const stats = {
  total: donations.reduce((sum, d) => sum + Number(d.amount), 0),
  count: donations.length,
  skills: donations
    .filter(d => d.program === "skills")
    .reduce((sum, d) => sum + Number(d.amount), 0),
  education: donations
    .filter(d => d.program === "education")
    .reduce((sum, d) => sum + Number(d.amount), 0),
  sports: donations
    .filter(d => d.program === "sports")
    .reduce((sum, d) => sum + Number(d.amount), 0),
  project100: donations
    .filter(d => d.program === "project 100")
    .reduce((sum, d) => sum + Number(d.amount), 0),
  avgDonation:
    donations.length > 0
      ? (
          donations.reduce((sum, d) => sum + Number(d.amount), 0) /
          donations.length
        ).toFixed(2)
      : "0"
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading donations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(139,201,127,0.18),transparent_35%),linear-gradient(135deg,rgba(10,26,26,0.04),transparent_55%)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        {/* <BackButton label="Back"/> */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <Banknote className="w-8 h-8 text-primary" /> Manage Donations
          </h1>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition font-medium"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Banknote className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Total Raised</p>
            </div>
            <p className="text-2xl font-bold text-foreground">${stats.total.toLocaleString()}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Receipt className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs text-muted-foreground">Donations</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.count}</p>
          </div>
          {/* <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground">Average</p>
            </div>
            <p className="text-2xl font-bold text-foreground">${stats.avgDonation}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Banknote  className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
            $
            {donations
              .filter(d => {
                const date = new Date(d.createdAt);
                const now = new Date();
                return (
                  date.getMonth() === now.getMonth() &&
                  date.getFullYear() === now.getFullYear()
                );
              })
              .reduce((sum, d) => sum + Number(d.amount), 0)
              .toLocaleString()}
          </p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              ${donations.filter(d => {
                const diffDays = Math.floor((new Date().getTime() - new Date(d.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                return diffDays <= 7;
              }).reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
            </p>
          </div> */}
        </div>

        {/* Program Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <h3 className="text-white/80 text-sm mb-2">Skills Track</h3>
            <p className="text-3xl font-bold">${stats.skills.toLocaleString()}</p>
            <p className="text-white/70 text-xs mt-2">
              {donations.filter(d => d.program === "skills").length} donations
            </p>
          </div>
          <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <h3 className="text-white/80 text-sm mb-2">Education Track</h3>
            <p className="text-3xl font-bold">${stats.education.toLocaleString()}</p>
            <p className="text-white/70 text-xs mt-2">
              {donations.filter(d => d.program === "education").length} donations
            </p>
          </div>
          <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <h3 className="text-white/80 text-sm mb-2">Sports Track</h3>
            <p className="text-3xl font-bold">${stats.sports.toLocaleString()}</p>
            <p className="text-white/70 text-xs mt-2">
              {donations.filter(d => d.program === "sports").length} donations
            </p>
          </div>
          <div className="bg-linear-to-br from-violet-500 to-fuchsia-600 rounded-xl p-6 text-white shadow-lg">
            <h3 className="text-white/80 text-sm mb-2">Project 100</h3>
            <p className="text-3xl font-bold">${stats.project100.toLocaleString()}</p>
            <p className="text-white/70 text-xs mt-2">
              {donations.filter(d => d.program === "project 100").length} donations
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Filters & Search</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
            </div>
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            >
              <option value="all">All Programs</option>
              <option value="skills">Skills Track</option>
              <option value="education">Education Track</option>
              <option value="sports">Sports Track</option>
              <option value="project 100">Project 100</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          {(searchQuery || filterProgram !== "all" || dateRange !== "all" || filterStatus !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredDonations.length} of {donations.length} donations
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterProgram("all");
                  setDateRange("all");
                  setFilterStatus("all");
                }}
                className="text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <AdminDataTable
          data={filteredDonations}
          page={currentPage}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          totalLabel="donations"
          getRowKey={(donation) => donation.id}
          emptyTitle="No donations found"
          emptyDescription={
            donations.length === 0
              ? "No donations have been received yet"
              : "Try adjusting your filters"
          }
          rowClassName={(_, index) =>
            index % 2 === 0 ? "bg-card dark:bg-gray-900" : "bg-secondary/10"
          }
          columns={[
            {
              id: "donor",
              header: "Donor",
              render: (donation) => (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {donation.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-semibold text-foreground">{donation.name}</p>
                </div>
              ),
            },
            {
              id: "contact",
              header: "Contact",
              render: (donation) =>
                donation.email ? (
                  <p className="text-sm text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {donation.email}
                  </p>
                ) : (
                  <span className="text-muted-foreground italic text-sm">No email</span>
                ),
            },
            {
              id: "program",
              header: "Program",
              render: (donation) => (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    donation.program === "skills"
                      ? "bg-blue-100 text-blue-800"
                      : donation.program === "education"
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {donation.program}
                </span>
              ),
            },
            {
              id: "amount",
              header: "Amount",
              render: (donation) => (
                <span className="font-bold text-primary text-lg">
                  ${donation.amount.toLocaleString()}
                </span>
              ),
            },
            {
              id: "date",
              header: "Date",
              render: (donation) => (
                <span className="text-muted-foreground text-sm">
                  {new Date(donation.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              ),
            },
            {
              id: "status",
              header: "Status",
              render: (donation) => (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    donation.status === "completed" || !donation.status
                      ? "bg-green-100 text-green-800"
                      : donation.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {donation.status || "completed"}
                </span>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
