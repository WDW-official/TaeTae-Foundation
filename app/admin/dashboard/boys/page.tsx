"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Eye, Trash2, TrendingUp, X, Search, Filter, Download, UserPlus } from "lucide-react";
import BackButton from "@/components/backButton";
import { useAuthStore } from "@/app/store/auth.store";

interface Boy {
  _id: string;
  id: string;
  fullName: string;
  first_name: string;
  last_name: string;
  age_at_enrolment: number;
  program_start_date: string;
  program_track: string;
  school_name?: string;
  class_level?: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_email?: string | null;
  address_city?: string;
  address_country?: string;
  emergency_contact?: string;
  status: string;
  sponsor_name?: string;
  consent_form_signed: boolean;
  profile_photo_url: string;
  guardian_signature_url?: string;
  notes?: string;
  background?: string;
  goals?: string;
  createdAt: string;
  updatedAt: string;
  growthMetrics?: {
    skillsLevel: number;
    educationScore: number;
    athleticAbility: number;
    totalScore: number;
  };
}

export default function AdminBoysPage() {
  const role = useAuthStore((s) => s.role)
  const [boys, setBoys] = useState<Boy[]>([]);
  const [filteredBoys, setFilteredBoys] = useState<Boy[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBoy, setEditingBoy] = useState<Boy | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProgram, setFilterProgram] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchBoys();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [boys, searchQuery, filterProgram, filterStatus]);

  const fetchBoys = async () => {
    try {
      const res = await fetch("/api/boys");
      if (res.ok) {
        const data = await res.json();
        setBoys(data.boys);
      }
    } catch (error) {
      console.error("Error fetching boys:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...boys];

    if (searchQuery) {
      filtered = filtered.filter(boy =>
        boy.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        boy.guardian_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        boy.sponsor_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterProgram !== "all") {
      filtered = filtered.filter(boy => boy.program_track === filterProgram);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(boy => boy.status === filterStatus);
    }

    setFilteredBoys(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this boy's profile?")) return;
    try {
      const res = await fetch(`/api/boys/${id}`, { method: "DELETE" });
      if (res.ok) fetchBoys();
    } catch (error) {
      console.error("Error deleting boy:", error);
    }
  };

  const exportData = () => {
    const csv = [
      ["Name", "Age", "Program", "Growth Score", "Sponsor", "Status", "Guardian"],
      ...filteredBoys.map(boy => [
        boy.fullName,
        boy.age_at_enrolment,
        boy.program_track,
        boy.growthMetrics?.totalScore || 0,
        boy.sponsor_name || "None",
        boy.status,
        boy.guardian_name
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `boys-data-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const stats = {
    total: boys.length,
    skills: boys.filter(b => b.program_track === "skills").length,
    education: boys.filter(b => b.program_track === "education").length,
    sports: boys.filter(b => b.program_track === "sports").length,
    sponsored: boys.filter(b => b.sponsor_name).length,
    avgGrowth: boys.length > 0 
      ? (boys.reduce((sum, b) => sum + (b.growthMetrics?.totalScore || 0), 0) / boys.length).toFixed(1)
      : "0"
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading boys data...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(139,201,127,0.18),transparent_35%),linear-gradient(135deg,rgba(10,26,26,0.04),transparent_55%)] ">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* <BackButton label="Back"/> */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" /> Manage Boys
          </h1>
          <div className="flex gap-3">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 text-black py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition font-medium"
            >
              <Download className="w-4 h-4" /> Export
            </button>
            <Link
              href="/admin/dashboard/boys/onboard"
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition font-medium"
            >
              <UserPlus className="w-4 h-4" /> Add Boy
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <p className="text-xs text-muted-foreground mb-1">Total Boys</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <p className="text-xs text-muted-foreground mb-1">Skills Track</p>
            <p className="text-2xl font-bold text-blue-600">{stats.skills}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <p className="text-xs text-muted-foreground mb-1">Education</p>
            <p className="text-2xl font-bold text-green-600">{stats.education}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <p className="text-xs text-muted-foreground mb-1">Sports</p>
            <p className="text-2xl font-bold text-orange-600">{stats.sports}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <p className="text-xs text-muted-foreground mb-1">Sponsored</p>
            <p className="text-2xl font-bold text-purple-600">{stats.sponsored}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <p className="text-xs text-muted-foreground mb-1">Avg Growth</p>
            <p className="text-2xl font-bold text-primary">{stats.avgGrowth}</p>
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
                placeholder="Search by name, guardian, or sponsor..."
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
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
            </select>
          </div>
          {(searchQuery || filterProgram !== "all" || filterStatus !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredBoys.length} of {boys.length} boys
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterProgram("all");
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
        <div className="bg-card dark:bg-gray-900 border border-border rounded-xl overflow-hidden shadow-sm">
          {filteredBoys.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No boys found</h3>
              <p className="text-muted-foreground mb-6">
                {boys.length === 0 
                  ? "Start by adding your first boy to the program" 
                  : "Try adjusting your filters"}
              </p>
              {boys.length === 0 && (
                <Link
                  href="/admin/boys/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition font-medium"
                >
                  <UserPlus className="w-4 h-4" /> Add First Boy
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/40">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Age</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Program</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Growth</th>
                    {/* <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Sponsor</th> */}
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBoys.map((boy, idx) => (
                    <tr
                      key={boy.id}
                      className={`border-b border-border hover:bg-secondary/20 transition ${
                        idx % 2 === 0 ? "bg-card dark:bg-gray-900" : "bg-secondary/10"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full italic bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {boy.first_name[0]}{boy.last_name[0]}
                          </div>
                          <div>
                            <p className="font- text-sm italic text-foreground">{boy.first_name} {boy.last_name}</p>
                            {/* <p className="text-xs text-muted-foreground">{boy.guardian_name}</p> */}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{boy.age_at_enrolment} years</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          boy.program_track === "skills" ? "bg-blue-100 text-blue-800" :
                          boy.program_track === "education" ? "bg-green-100 text-green-800" :
                          "bg-orange-100 text-orange-800"
                        }`}>
                          {boy.program_track}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${(boy.growthMetrics?.totalScore || 0) * 10}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-foreground min-w-12">
                            {boy.growthMetrics?.totalScore || 0}/10
                          </span>
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 text-foreground">{boy.sponsor_name || <span className="text-muted-foreground italic">Unsponsored</span>}</td> */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          boy.status === "active" ? "bg-green-100 text-green-800" :
                          boy.status === "inactive" ? "bg-gray-100 text-gray-800" :
                          "bg-purple-100 text-purple-800"
                        }`}>
                          {boy.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/dashboard/boys/boy/${boy.id}`}
                            className="p-2 rounded-lg hover:bg-primary/10 transition group"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          </Link>
                          {/* <button
                            onClick={() => setEditingBoy(boy)}
                            className="p-2 hover:bg-primary/10 rounded-lg transition group"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          </button> */}
                          {role === "superAdmin" && (
                            <button
                              onClick={() => handleDelete(boy.id)}
                              className="p-2 hover:bg-destructive/10 rounded-lg transition group"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editingBoy && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <EditBoyModal
            boy={editingBoy}
            onClose={() => setEditingBoy(null)}
            onSaved={() => {
              setEditingBoy(null);
              fetchBoys();
            }}
          />
        </div>
      )}
    </main>
  );
}

function EditBoyModal({
  boy,
  onClose,
  onSaved,
}: {
  boy: Boy;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(boy);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof Boy, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/boys/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        onSaved();
      } else {
        const errorText = await res.text();
        setError(errorText || "Failed to update profile");
      }
    } catch (error) {
      setError("Network error occurred");
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card dark:bg-gray-900 border border-border rounded-2xl p-8 shadow-2xl max-w-2xl w-full relative overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition"
      >
        <X className="w-5 h-5" />
      </button>

      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
        <Edit className="w-6 h-6 text-primary" />
        Edit Boy Profile
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <input
              disabled
              value={form.fullName}
              className="w-full px-4 py-2.5 bg-secondary/30 border border-border rounded-lg text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Age at Enrollment</label>
            <input
              type="number"
              value={form.age_at_enrolment}
              onChange={(e) => handleChange("age_at_enrolment", Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Program Track</label>
            <select
              value={form.program_track}
              onChange={(e) => handleChange("program_track", e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            >
              <option value="skills">Skills Track</option>
              <option value="education">Education Track</option>
              <option value="sports">Sports Track</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Status</label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Sponsor Name</label>
          <input
            type="text"
            value={form.sponsor_name || ""}
            onChange={(e) => handleChange("sponsor_name", e.target.value)}
            placeholder="Enter sponsor name (optional)"
            className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Background</label>
          <textarea
            value={form.background || ""}
            onChange={(e) => handleChange("background", e.target.value)}
            placeholder="Tell us about this boy's background..."
            className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Goals</label>
          <textarea
            value={form.goals || ""}
            onChange={(e) => handleChange("goals", e.target.value)}
            placeholder="What are the goals for this boy?"
            className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
          <textarea
            value={form.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Additional notes..."
            className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none h-20"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
        <button
          onClick={onClose}
          disabled={saving}
          className="px-6 py-2.5 border-2 border-border text-foreground rounded-lg font-semibold hover:bg-secondary/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}