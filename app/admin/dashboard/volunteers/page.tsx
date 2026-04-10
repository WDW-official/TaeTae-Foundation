"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Mail,
  Phone,
  Filter,
  Search,
  Download,
  UserPlus,
  Clock,
  Award
} from "lucide-react";
import BackButton from "@/components/backButton";
import { useAuthStore } from "@/app/store/auth.store";

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
  availability?: string;
  experience?: string;
}

export default function AdminVolunteers() {
  const role = useAuthStore((s) => s.role)
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const router = useRouter();

  /** ---------------- Pagination ---------------- */
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // Example filter (replace with your real filter logic)

  const totalPages = Math.ceil(filteredVolunteers.length / ITEMS_PER_PAGE);

  const paginatedVolunteers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVolunteers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVolunteers, currentPage]);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [volunteers, searchQuery, filterStatus, filterCategory]);

  const fetchVolunteers = async () => {
    try {
      const res = await fetch("/api/volunteers");
      if (res.ok) {
        const data = await res.json();
        setVolunteers(data.volunteers);
      }
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...volunteers];

    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.phone.includes(searchQuery)
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((v) => v.status === filterStatus);
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((v) => v.category === filterCategory);
    }

    setFilteredVolunteers(filtered);
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/volunteers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" })
      });
      if (res.ok) {
        setVolunteers((prev) =>
          prev.map((v) => (v.id === id ? { ...v, status: "approved" } : v))
        );
      }
    } catch (error) {
      console.error("Error approving volunteer:", error);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this volunteer application?")) return;
    try {
      const res = await fetch(`/api/admin/volunteers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" })
      });
      if (res.ok) {
        setVolunteers((prev) =>
          prev.map((v) => (v.id === id ? { ...v, status: "rejected" } : v))
        );
      }
    } catch (error) {
      console.error("Error rejecting volunteer:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this volunteer record?")) return;
    try {
      const res = await fetch(`/api/admin/volunteers?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setVolunteers((prev) => prev.filter((v) => v.id !== id));
      }
    } catch (error) {
      console.error("Error deleting volunteer:", error);
    }
  };

  const exportData = () => {
    const csv = [
      ["Name", "Email", "Phone", "Category", "Status"],
      ...filteredVolunteers.map((v) => [v.name, v.email, v.phone, v.category, v.status])
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `volunteers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const stats = {
    total: volunteers.length,
    pending: volunteers.filter((v) => v.status === "pending").length,
    approved: volunteers.filter((v) => v.status === "approved").length,
    rejected: volunteers.filter((v) => v.status === "rejected").length
  };

  const categories = [...new Set(volunteers.map((v) => v.category))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading volunteers...</p>
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
          <h1 className="text-xl md:text-4xl  font-bold text-foreground flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" /> Manage Volunteers
          </h1>
          <div className="flex gap-3">
            <button
              onClick={exportData}
              className="flex items-center text-black gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition font-medium"
            >
              <Download className="w-4 h-4" /> Export
            </button>
            <Link
              href="/admin/dashboard/volunteers/mediaManagement"
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition font-medium"
            >
              <UserPlus className="w-4 h-4" /> Add Media
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.rejected}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Filters & Search</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {(searchQuery || filterStatus !== "all" || filterCategory !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredVolunteers.length} of {volunteers.length} volunteers
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                  setFilterCategory("all");
                }}
                className="text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-card dark:bg-gray-900 border border-border rounded-xl overflow-hidden shadow-sm">
          {filteredVolunteers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No volunteers found</h3>
              <p className="text-muted-foreground mb-6">
                {volunteers.length === 0
                  ? "No volunteers have registered yet"
                  : "Try adjusting your filters"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* TABLE */}
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/40">
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Volunteer
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedVolunteers.map((volunteer, idx) => (
                      <tr
                        key={volunteer.id}
                        className={`border-b border-border hover:bg-secondary/20 transition ${
                          idx % 2 === 0
                            ? "bg-card dark:bg-gray-900"
                            : "bg-secondary/10"
                        }`}
                      >
                        {/* Volunteer */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                              {volunteer.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <button
                                onClick={() =>
                                  router.push(`/admin/dashboard/volunteers/${volunteer.id}`)
                                }
                                className="font-semibold hover:text-primary transition"
                              >
                                {volunteer.name}
                              </button>
                              {volunteer.experience && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <Award className="w-3 h-3" />
                                  {volunteer.experience}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              {volunteer.email}
                            </p>
                            <p className="text-sm flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              {volunteer.phone}
                            </p>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {volunteer.category}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              volunteer.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : volunteer.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {volunteer.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/dashboard/volunteers/${volunteer.id}`
                                )
                              }
                              className="p-2 rounded-lg hover:bg-primary/10 transition"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* {volunteer.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApprove(volunteer.id)}
                                  className="p-2 rounded-lg hover:bg-green-50 transition"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                </button>
                                <button
                                  onClick={() => handleReject(volunteer.id)}
                                  className="p-2 rounded-lg hover:bg-red-50 transition"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4 text-red-600" />
                                </button>
                              </>
                            )} */}
                            {role === "superAdmin" && (
                            <button
                              onClick={() => handleDelete(volunteer.id)}
                              className="p-2 rounded-lg hover:bg-destructive/10 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {paginatedVolunteers.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-10 text-muted-foreground"
                        >
                          No volunteers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>

                  <div className="flex gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 hover:bg-secondary transition"
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition ${
                            currentPage === page
                              ? "bg-primary text-primary-foreground"
                              : "border hover:bg-secondary"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 hover:bg-secondary transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}