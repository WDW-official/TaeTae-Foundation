"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  X,
  Search,
  Filter,
  Download,
  Calendar,
  Building2,
  MapPin,
  ArrowLeft,
  Users,
  DollarSign,
  Eye,
  Heart,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Banknote,
  PackagePlus,
  Handshake
} from "lucide-react";
import BackButton from "@/components/backButton";
import { useAuthStore } from "@/app/store/auth.store";
import { AdminDataTable } from "@/components/admin/admin-data-table";

interface Sponsorship {
  _id: string;
  id: string;
  sponsorName: string;
  sponsorEmail: string;
  sponsorPhone: string | null;
  company: string | null;
  amount: number;
  currency: string;
  paymentMethod: string;
  rateUsed: number;
  boyId: string | null;
  boyName?: string;
  items: Array<{
    id: string;
    quantity: number;
  }>;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

export default function SponsorsPage() {
  const role = useAuthStore((s) => s.role)
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [filteredSponsorships, setFilteredSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSponsorship, setSelectedSponsorship] = useState<Sponsorship | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  

  useEffect(() => {
    fetchSponsorships();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sponsorships, searchQuery, filterStatus, filterPayment]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterPayment]);

  const fetchSponsorships = async () => {
    try {
      const res = await fetch("/api/sponsorships");
      const data = await res.json();
      if (res.ok) setSponsorships(data.sponsorships || []);
    } catch (error) {
      console.error("Error fetching sponsorships:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...sponsorships];

    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.sponsorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.sponsorEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.boyName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((s) => s.status === filterStatus);
    }

    if (filterPayment !== "all") {
      filtered = filtered.filter((s) => s.paymentMethod === filterPayment);
    }

    setFilteredSponsorships(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sponsorship?")) return;
    try {
      const res = await fetch(`/api/sponsorships/${id}`, { method: "DELETE" });
      if (res.ok) fetchSponsorships();
    } catch (error) {
      console.error("Error deleting sponsorship:", error);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Sponsor Name",
      "Email",
      "Phone",
      "Company",
      "Amount",
      "Currency",
      "Boy",
      "Status",
      "Payment Method",
      "Date"
    ];
    const rows = filteredSponsorships.map((s) => [
      s.sponsorName,
      s.sponsorEmail,
      s.sponsorPhone || "",
      s.company || "",
      s.amount,
      s.currency,
      s.boyName || "Not assigned",
      s.status,
      s.paymentMethod,
      new Date(s.createdAt).toLocaleDateString()
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sponsorships-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const stats = {
    total: sponsorships.length,
    completed: sponsorships.filter((s) => s.status === "completed").length,
    pending: sponsorships.filter((s) => s.status === "pending").length,
    totalAmount: sponsorships
      .filter((s) => s.status === "completed")
      .reduce((sum, s) => sum + s.amount, 0),
    withBoys: sponsorships.filter((s) => s.boyId).length,
    thisMonth: sponsorships.filter((s) => {
      const date = new Date(s.createdAt);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length
  };

  const uniquePaymentMethods = Array.from(
    new Set(sponsorships.map((s) => s.paymentMethod).filter(Boolean))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading sponsorships...</p>
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
            <Handshake className="w-8 h-8 text-primary" />
            Sponsorships
          </h1>
          <div className="flex gap-3">
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-2 py-2 bg-primary hover:bg-secondary/80 border border-border rounded-lg transition font-medium"
            >
              <Download className="w-4 h-4" /> <span className="hidden md:block">Export CSV </span>
            </button>
            <button className="">
              <Link href="/admin/dashboard/sponsors/add-sponsorship"
                 className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Add Items
              </Link> 
            </button>
            <button className="">
              <Link
              href="/admin/dashboard/sponsors/procurement"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              <PackagePlus className="h-4 w-4" />
              Procure
            </Link>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Banknote className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xs text-muted-foreground">Total Amount</p>
            </div>
            <p className="text-2xl font-bold text-foreground">₦{stats.totalAmount.toLocaleString()}</p>
          </div>
          {/* <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs text-muted-foreground">With Boys</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.withBoys}</p>
          </div> */}
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.thisMonth}</p>
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
                placeholder="Search by name, email, company, or boy..."
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            >
              <option value="all">All Payment Methods</option>
              {uniquePaymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
          {(searchQuery || filterStatus !== "all" || filterPayment !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredSponsorships.length} of {sponsorships.length} sponsorships
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                  setFilterPayment("all");
                }}
                className="text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Sponsorships Table */}
        {filteredSponsorships.length === 0 ? (
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No sponsorships found</h3>
            <p className="text-muted-foreground">
              {sponsorships.length === 0
                ? "No sponsorships have been recorded yet"
                : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <AdminDataTable
            data={filteredSponsorships}
            page={currentPage}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            totalLabel="sponsorships"
            getRowKey={(sponsorship) => sponsorship._id}
            emptyTitle="No sponsorships found"
            emptyDescription={
              sponsorships.length === 0
                ? "No sponsorships have been recorded yet"
                : "Try adjusting your filters"
            }
            rowClassName={(_, index) =>
              index % 2 === 0 ? "bg-card dark:bg-gray-900" : "bg-secondary/10"
            }
            columns={[
              {
                id: "sponsor",
                header: "Sponsor",
                render: (sponsorship) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{sponsorship.sponsorName}</p>
                      {sponsorship.company && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {sponsorship.company}
                        </p>
                      )}
                    </div>
                  </div>
                ),
              },
              {
                id: "contact",
                header: "Contact",
                render: (sponsorship) => (
                  <div className="space-y-1">
                    <a
                      href={`mailto:${sponsorship.sponsorEmail}`}
                      className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition"
                    >
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      {sponsorship.sponsorEmail}
                    </a>
                    {sponsorship.sponsorPhone && (
                      <a
                        href={`tel:${sponsorship.sponsorPhone}`}
                        className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition"
                      >
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        {sponsorship.sponsorPhone}
                      </a>
                    )}
                  </div>
                ),
              },
              {
                id: "amount",
                header: "Amount",
                render: (sponsorship) => (
                  <div className="text-primary text-sm">
                    <div>{sponsorship.currency} {sponsorship.amount.toLocaleString()}</div>
                    {sponsorship.rateUsed && sponsorship.currency !== "₦" && (
                      <p className="text-xs text-muted-foreground">Rate: {sponsorship.rateUsed}</p>
                    )}
                  </div>
                ),
              },
              {
                id: "payment",
                header: "Payment",
                render: (sponsorship) => (
                  <span className="inline-flex items-center px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium capitalize">
                    {sponsorship.paymentMethod}
                  </span>
                ),
              },
              {
                id: "status",
                header: "Status",
                render: (sponsorship) => (
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      sponsorship.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : sponsorship.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {sponsorship.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {sponsorship.status === "pending" && <AlertCircle className="w-3 h-3 mr-1" />}
                    {sponsorship.status}
                  </span>
                ),
              },
              {
                id: "date",
                header: "Date",
                render: (sponsorship) => (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(sponsorship.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ),
              },
              {
                id: "actions",
                header: "Actions",
                headerClassName: "text-right",
                cellClassName: "text-right",
                render: (sponsorship) => (
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedSponsorship(sponsorship);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 rounded-lg hover:bg-primary/10 transition group"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    </button>
                    {role === "superAdmin" && (
                      <button
                        onClick={() => handleDelete(sponsorship._id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition group"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedSponsorship && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-card dark:bg-gray-900 border border-border rounded-2xl p-8 shadow-2xl max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setShowDetailsModal(false);
                setSelectedSponsorship(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Heart className="w-6 h-6 text-primary" />
              Sponsorship Details
            </h2>

            <div className="space-y-6">
              {/* Sponsor Information */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Sponsor Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Name</p>
                    <p className="font-medium text-foreground">{selectedSponsorship.sponsorName}</p>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium text-foreground">{selectedSponsorship.sponsorEmail}</p>
                  </div>
                  {selectedSponsorship.sponsorPhone && (
                    <div className="p-3 bg-secondary/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Phone</p>
                      <p className="font-medium text-foreground">{selectedSponsorship.sponsorPhone}</p>
                    </div>
                  )}
                  {selectedSponsorship.company && (
                    <div className="p-3 bg-secondary/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Company</p>
                      <p className="font-medium text-foreground">{selectedSponsorship.company}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sponsorship Details */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Sponsorship Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Amount</p>
                    <p className="font-bold text-primary text-xl">
                      {selectedSponsorship.currency}{selectedSponsorship.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                    <p className="font-medium text-foreground capitalize">{selectedSponsorship.paymentMethod}</p>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        selectedSponsorship.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : selectedSponsorship.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedSponsorship.status}
                    </span>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedSponsorship.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                  {selectedSponsorship.boyName && (
                    <div className="p-3 bg-secondary/20 rounded-lg md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Boy Sponsored</p>
                      <p className="font-medium text-foreground">{selectedSponsorship.boyName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items if available */}
              {selectedSponsorship.items && selectedSponsorship.items.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Items</h3>
                  <div className="space-y-2">
                    {selectedSponsorship.items.map((item, idx) => (
                      <div key={idx} className="p-3 bg-secondary/20 rounded-lg flex justify-between">
                        <span className="text-foreground">Item ID: {item.id}</span>
                        <span className="font-medium text-foreground">Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedSponsorship(null);
                }}
                className="px-6 py-2.5 border-2 border-border text-foreground rounded-lg font-semibold hover:bg-secondary/40 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
