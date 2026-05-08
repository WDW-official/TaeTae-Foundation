"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  DollarSign,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
  XCircle,
  Heart,
  Users,
  Package,
  Download,
  Edit,
  Trash2,
  TrendingUp,
  Banknote
} from "lucide-react";
import BackButton from "@/components/backButton";
import LoadingLogo from "@/components/loading-logo";
import { useAuthStore } from "@/app/store/auth.store";
import { formatNaira, toNaira } from "@/lib/project100";

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
  rateUsed?: number | null;
  boyId: string | null;
  boyName?: string;
  items: Array<{
    id: string;
    name?: string;
    quantity: number;
    price?: number;
  }>;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export default function SponsorshipViewPage() {
  const role = useAuthStore((s) => s.role)
  const params = useParams();
  const router = useRouter();
  const [sponsorship, setSponsorship] = useState<Sponsorship | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const sponsorshipId = params?.id as string | undefined

  useEffect(() => {
    if (sponsorshipId) {
      fetchSponsorship();
    }
  }, [sponsorshipId]);

  const fetchSponsorship = async () => {
    if (!sponsorshipId) return
    try {
      const res = await fetch(`/api/sponsorships/${sponsorshipId}`);
      if (res.ok) {
        const data = await res.json();
        setSponsorship(data.sponsorship);
      }
    } catch (error) {
      console.error("Error fetching sponsorship:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: "pending" | "completed" | "cancelled") => {
    if (!confirm(`Are you sure you want to mark this sponsorship as ${newStatus}?`)) return;
    if (!sponsorshipId) return
    
    setUpdating(true);
    try {
      const res = await fetch(`/api/sponsorships/${sponsorshipId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchSponsorship();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this sponsorship? This action cannot be undone.")) return;
    if (!sponsorshipId) return
    
    try {
      const res = await fetch(`/api/sponsorships/${sponsorshipId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/dashboard/sponsors");
      }
    } catch (error) {
      console.error("Error deleting sponsorship:", error);
    }
  };

  const generateReceipt = () => {
    if (!sponsorship) return;
    
    const receiptContent = `
SPONSORSHIP RECEIPT
==========================================

Receipt ID: ${sponsorship.id}
Date: ${new Date(sponsorship.createdAt).toLocaleDateString()}

SPONSOR INFORMATION
------------------------------------------
Name: ${sponsorship.sponsorName}
Email: ${sponsorship.sponsorEmail}
Phone: ${sponsorship.sponsorPhone || "N/A"}
Company: ${sponsorship.company || "N/A"}

SPONSORSHIP DETAILS
------------------------------------------
          Amount: ${formatNaira(toNaira(sponsorship.amount, sponsorship.currency, sponsorship.rateUsed))}
          ${sponsorship.currency === "USD" ? `Converted from USD at rate ${sponsorship.rateUsed || "default"}` : "Recorded in NGN"}
Payment Method: ${sponsorship.paymentMethod}
Status: ${sponsorship.status.toUpperCase()}
${sponsorship.boyName ? `Boy Sponsored: ${sponsorship.boyName}` : ""}

${sponsorship.items.length > 0 ? `
ITEMS
------------------------------------------
${sponsorship.items.map(item => `- ${item.name || item.id} (Qty: ${item.quantity})`).join("\n")}
` : ""}

Thank you for your generous support!
==========================================
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sponsorship-receipt-${sponsorship.id}.txt`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <LoadingLogo label="Loading sponsorship details..." />
      </div>
    );
  }

  if (!sponsorship) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Sponsorship Not Found</h2>
          <p className="text-muted-foreground mb-6">The sponsorship you're looking for doesn't exist.</p>
          <BackButton label="Back"/>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      case "pending":
        return <AlertCircle className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <BackButton label="Back"/>
        {/* Title and Actions */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Sponsorship Details</h1>
            <p className="text-muted-foreground">ID: {sponsorship.id}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={generateReceipt}
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition font-medium"
            >
              <Download className="w-4 h-4" /> Download Receipt
            </button>
            {role === "superAdmin" && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition font-medium"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}
          </div>
        </div>

        {/* Status Card */}
        <div className={`p-6 rounded-2xl mb-6 border-2 ${
          sponsorship.status === "completed" ? "bg-green-50 border-green-200" :
          sponsorship.status === "pending" ? "bg-yellow-50 border-yellow-200" :
          "bg-red-50 border-red-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${
                sponsorship.status === "completed" ? "bg-green-200" :
                sponsorship.status === "pending" ? "bg-yellow-200" :
                "bg-red-200"
              }`}>
                {getStatusIcon(sponsorship.status)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sponsorship Status</p>
                <p className="text-2xl font-bold capitalize">{sponsorship.status}</p>
              </div>
            </div>
            {sponsorship.status !== "completed" && (
              <div className="flex gap-2">
                {sponsorship.status === "pending" && (
                  <button
                    onClick={() => handleStatusUpdate("completed")}
                    disabled={updating}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </button>
                )}
                {sponsorship.status !== "cancelled" && (
                  <button
                    onClick={() => handleStatusUpdate("cancelled")}
                    disabled={updating}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Amount Card */}
          <div className="lg:col-span-1 bg-linear-to-br from-primary to-primary/80 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Banknote className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">Total Amount</h3>
            </div>
            <p className="text-4xl font-bold mb-2">
              {formatNaira(toNaira(sponsorship.amount, sponsorship.currency, sponsorship.rateUsed))}
            </p>
            <div className="space-y-1 text-sm text-white/80">
              <p>Payment Method: {sponsorship.paymentMethod}</p>
              {sponsorship.currency === "USD" ? (
                <p>
                  Converted from USD{sponsorship.rateUsed ? ` at rate ${sponsorship.rateUsed}` : ""}
                </p>
              ) : (
                <p>Recorded in NGN</p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-muted-foreground">Date Created</p>
              </div>
              <p className="text-xl font-bold text-foreground">
                {new Date(sponsorship.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
            </div>
            <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
              </div>
              <p className="text-xl font-bold text-foreground capitalize">{sponsorship.paymentMethod}</p>
            </div>
            <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-sm text-muted-foreground">Items Count</p>
              </div>
              <p className="text-xl font-bold text-foreground">{sponsorship.items.length}</p>
            </div>
            <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {new Date(sponsorship.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sponsor Information */}
          <div className="bg-card dark:bg-gray-900 border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                <User className="w-6 h-6 text-primary" />
                Sponsor Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-foreground">{sponsorship.sponsorName}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                  <a
                    href={`mailto:${sponsorship.sponsorEmail}`}
                    className="text-foreground font-medium hover:text-primary transition break-all"
                  >
                    {sponsorship.sponsorEmail}
                  </a>
                </div>
              </div>

              {sponsorship.sponsorPhone && (
                <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                    <a
                      href={`tel:${sponsorship.sponsorPhone}`}
                      className="text-foreground font-medium hover:text-primary transition"
                    >
                      {sponsorship.sponsorPhone}
                    </a>
                  </div>
                </div>
              )}

              {sponsorship.company && (
                <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Company</p>
                    <p className="text-foreground font-medium">{sponsorship.company}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Boy Sponsored */}
          <div className="bg-card dark:bg-gray-900 border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                Boy Sponsored
              </h2>
            </div>
            <div className="p-6">
              {sponsorship.boyId && sponsorship.boyName ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-primary/10 to-transparent rounded-xl border border-primary/20">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Boy's Name</p>
                      <p className="text-2xl font-bold text-foreground">{sponsorship.boyName}</p>
                    </div>
                  </div>
                  {/* <Link
                    href={`/admin/boys/${sponsorship.boyId}`}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition font-medium"
                  >
                    <User className="w-4 h-4" />
                    View Boy's Profile
                  </Link> */}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Boy Assigned</h3>
                  <p className="text-muted-foreground mb-6">
                    This sponsorship hasn't been assigned to a specific boy yet
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition font-medium">
                    <Users className="w-4 h-4" />
                    Assign to Boy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Section */}
        {sponsorship.items.length > 0 && (
          <div className="mt-6 bg-card dark:bg-gray-900 border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                <Package className="w-6 h-6 text-primary" />
                Sponsored Items
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sponsorship.items.map((item, idx) => (
                  <div key={idx} className="p-4 bg-secondary/20 rounded-lg border border-border">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-foreground">{item.name || `Item ${idx + 1}`}</p>
                        <p className="text-xs text-muted-foreground">ID: {item.id}</p>
                      </div>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    {item.price && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-sm text-muted-foreground">Price per unit</p>
                        <p className="text-lg font-bold text-primary">
                          {sponsorship.currency}{item.price.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="mt-6 bg-card dark:bg-gray-900 border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
              <Calendar className="w-6 h-6 text-primary" />
              Timeline
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="w-0.5 h-full bg-border"></div>
                </div>
                <div className="flex-1 pb-8">
                  <p className="font-semibold text-foreground">Sponsorship Created</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(sponsorship.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    sponsorship.status === "completed" ? "bg-green-100" :
                    sponsorship.status === "pending" ? "bg-yellow-100" :
                    "bg-red-100"
                  }`}>
                    {getStatusIcon(sponsorship.status)}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Current Status: {sponsorship.status}</p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(sponsorship.updatedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
