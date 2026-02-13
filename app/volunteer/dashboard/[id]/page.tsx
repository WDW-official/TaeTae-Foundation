"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  BookOpen,
  Target,
  User,
  Briefcase,
  Heart,
  TrendingUp,
  Download,
  Activity,
  Users,
  FileText,
  Trash2,
  Video,
  Eye,
  KeyRound
} from "lucide-react";
import BackButton from "@/components/backButton";
import EditVolunteerModal from "@/components/EditVolunteerModal";
import ChangePasswordModal from "@/components/ChangePasswordModal";

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio:string;
  category: string;
  status: "pending" | "approved" | "rejected";
  profile_photo_url?: string;
  location?: string;
  skills?: string[];
  learning?: string[];
  experience?: string;
  availability?: string;
  background?: string;
  motivation?: string;
  createdAt?: string;
  occupation?:string;
  approvedAt?: string;
  assignedBoys?: number;
  hoursContributed?: number;
  emergencyContact?: string;
  emergencyPhone?: string;
  certifications?: string[];
  languages?: string[];
  preferredAge?: string;
}
interface MediaItem {
  id: string;
  fileName?: string;
  publicId?: string;
  fileUrl?: string;
  secureUrl?: string;
  fileType?: string;
  format?: string;
  resourceType?: string;
  fileSize?: number;
  bytes?: number;
  boyId?: string;
  boyName?: string;
  uploadType: "session" | "assessment" | "profile" | "other";
  uploadedBy: string;
  description?: string;
  createdAt: string;
  width?: number;
  height?: number;
  duration?: number;
}

export default function VolunteerDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!id) return;
    fetchVolunteer();
  }, [id]);

  const [learningVideos, setLearningVideos] = useState<MediaItem[]>([]);
  const [learningFiles, setLearningFiles] = useState<MediaItem[]>([]);
  const [showVideos, setShowVideos] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [openVideoId, setOpenVideoId] = useState<string | null>(null)
  const [openFileId, setOpenFileId] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false);
   const [showChangePassword, setShowChangePassword] = useState(false)


  useEffect(() => {
    if (!id) return;
    fetchVolunteer();
    fetchLearningMedia();
  }, [id]);

  const fetchLearningMedia = async () => {
    try {
      const res = await fetch(`/api/media?volunteerId=${id}`);
      const data = await res.json();
      const media: MediaItem[] = data.media || [];
      const isYouTube = (url: string) =>
        /youtube\.com|youtu\.be/.test(url)

      const getYouTubeEmbedUrl = (url: string) => {
        const match = url.match(
          /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/,
        )
        return match
          ? `https://www.youtube.com/embed/${match[1]}?rel=0`
          : null
      }

      const videos = media.filter((m: MediaItem) => {
        const url = m.secureUrl || m.fileUrl || "";
        const isYouTube = url.includes("youtube") || url.includes("youtu.be");

        const isVideoFile =
          m.resourceType === "video" ||
          m.fileType?.startsWith("video/");

        return isYouTube || isVideoFile;
      });

      const files = media.filter((m: MediaItem) => {
        const url = m.secureUrl || m.fileUrl || "";
        const isYouTube = url.includes("youtube") || url.includes("youtu.be");

        const isVideoFile =
          m.resourceType === "video" ||
          m.fileType?.startsWith("video/");

        // EXCLUDE YOUTUBE + VIDEOS
        return !isYouTube && !isVideoFile;
      });

      setLearningVideos(videos);
      setLearningFiles(files);

    } catch (err) {
      console.error("Error loading volunteer media:", err);
    }
  };

  const renderMedia = (item: MediaItem) => {
    const url = item.secureUrl || item.fileUrl;
    if (!url) return null;

    const isYouTube = url.includes("youtube") || url.includes("youtu.be");
    const isVideo =
      item.resourceType === "video" ||
      item.fileType?.startsWith("video/");

    const isPDF = item.fileType?.includes("pdf") || url.endsWith(".pdf");
    const isImage =
      item.resourceType === "image" ||
      item.fileType?.startsWith("image/");

    // YouTube
    if (isYouTube) {
      const videoId =
        url.split("v=")[1]?.split("&")[0] ||
        url.split("youtu.be/")[1]?.split("?")[0];
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-64 rounded-xl"
          allowFullScreen
        />
      );
    }

    // Video
    if (isVideo) {
      return (
        <video
          src={url}
          controls
          className="w-full h-64 rounded-xl object-cover"
        />
      );
    }

    // Image
    if (isImage) {
      return (
        <img
          src={url}
          className="w-full rounded-xl object-cover"
        />
      );
    }

    // PDF
    if (isPDF) {
      return (
        <embed
          src={url}
          type="application/pdf"
          className="w-full h-96 rounded-xl border"
        />
      );
    }

    return <p className="text-sm text-muted-foreground">Unsupported file type</p>;
  };




  const fetchVolunteer = async () => {
    try {
        const res = await fetch(`/api/volunteers/${id}`);
        if (res.ok) {
        const data = await res.json();

        // FIX: Use the first volunteer object if array
        const v = Array.isArray(data.volunteer)
            ? data.volunteer[0]
            : data.volunteer;

        setVolunteer(v);
        console.log("Fetched volunteer:", v);
        }
    } catch (error) {
        console.error("Error fetching volunteer:", error);
    } finally {
        setLoading(false);
    }
    };

  const handleApprove = async () => {
    try {
      const res = await fetch(`/api/volunteers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" })
      });
      if (res.ok) {
        setVolunteer((prev) => prev ? { ...prev, status: "approved", approvedAt: new Date().toISOString() } : null);
      }
    } catch (error) {
      console.error("Error approving volunteer:", error);
    }
  };

  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this volunteer?")) return;
    try {
      const res = await fetch(`/api/volunteers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" })
      });
      if (res.ok) {
        setVolunteer((prev) => prev ? { ...prev, status: "rejected" } : null);
      }
    } catch (error) {
      console.error("Error rejecting volunteer:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this volunteer? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/volunteers/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/volunteers");
      }
    } catch (error) {
      console.error("Error deleting volunteer:", error);
    }
  };

  const exportProfile = () => {
    if (!volunteer) return;
    
    const profileData = `
        VOLUNTEER PROFILE
        ==========================================

        Name: ${volunteer.name}
        Email: ${volunteer.email}
        Phone: ${volunteer.phone}
        Category: ${volunteer.category}
        Status: ${volunteer.status}
        Location: ${volunteer.location || "N/A"}
        Experience: ${volunteer.experience || "N/A"}
        Availability: ${volunteer.availability || "N/A"}

        STATISTICS
        ------------------------------------------
        Boys Assigned: ${volunteer.assignedBoys || 0}
        Hours Contributed: ${volunteer.hoursContributed || 0}
        Joined: ${volunteer.createdAt ? new Date(volunteer.createdAt).toLocaleDateString() : "N/A"}

        SKILLS
        ------------------------------------------
        ${volunteer.skills?.join(", ") || "None listed"}

        LEARNING GOALS
        ------------------------------------------
        ${volunteer.learning?.join(", ") || "None listed"}

        BACKGROUND
        ------------------------------------------
        ${volunteer.background || "Not provided"}

        MOTIVATION
        ------------------------------------------
        ${volunteer.motivation || "Not provided"}

        ==========================================
    `;

    const blob = new Blob([profileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `volunteer-${volunteer.name.replace(/\s+/g, "-")}.txt`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading volunteer details...</p>
        </div>
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Volunteer Not Found</h2>
          <p className="text-muted-foreground mb-6">The volunteer you're looking for doesn't exist.</p>
          <BackButton label="Back"/>
        </div>
      </div>
    );
  }

  const yearsOfService = volunteer.createdAt 
    ? Math.floor((new Date().getTime() - new Date(volunteer.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365))
    : 0;
  
  const monthsOfService = volunteer.createdAt 
    ? Math.floor((new Date().getTime() - new Date(volunteer.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30))
    : 0;

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto lg:px-4 ">
        {/* Header */}
        {/* <BackButton label="Back"/> */}
        {/* Action Buttons at Top */}
        <div className="flex justify-end gap-3 mb-6">
          {/* <button
            onClick={exportProfile}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition font-medium"
          >
            <Download className="w-4 h-4" /> Export Profile
          </button> */}
          {/* <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition font-medium"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button> */}
        </div>

        {/* Profile Header */}
        
        <div className="bg-card dark:bg-gray-900 border border-border rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent h-32"></div>
          <div className="md:px-8 px-2 pb-8">
            <div className="flex flex-col flex-row gap-6 -mt-16">
              {/* Profile Image */}
              <div className="shrink-0">
                <div className="lg:w-32 lg:h-32 w-28 h-28 rounded-2xl overflow-hidden border-4 border-card shadow-lg bg-primary/10">
                  {volunteer.profile_photo_url ? (
                    <img
                      src={volunteer.profile_photo_url}
                      alt={volunteer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary text-4xl font-bold">
                      {volunteer?.name?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 pt-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="md:text-3xl text-xl font-bold text-foreground mb-2">{volunteer.name}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {volunteer.category}
                      </span>
                      {monthsOfService > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {yearsOfService > 0 ? `${yearsOfService} ${yearsOfService === 1 ? "Year" : "Years"}` : `${monthsOfService} ${monthsOfService === 1 ? "Month" : "Months"}`} of Service
                        </span>
                      )}
                      {volunteer.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {volunteer.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="md:flex hidden  gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold ${
                        volunteer.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : volunteer.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {volunteer.status === "pending" && <Clock className="w-4 h-4 mr-1" />}
                      {volunteer.status === "approved" && <CheckCircle className="w-4 h-4 mr-1" />}
                      {volunteer.status === "rejected" && <XCircle className="w-4 h-4 mr-1" />}
                      {volunteer?.status ? volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1): "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center gap-2 px-2 md:px-4 text-sm md:text-base py-2 bg-secondary dark:bg-primary hover:bg-secondary/80 border border-border text-foreground rounded-lg transition font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-primary/90 transition"
                  >
                    <KeyRound size={16} />
                    <span className="hidden md:block">
                    Change Password
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {/* <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs text-muted-foreground">Boys Assigned</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{volunteer.assignedBoys || 0}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground">Hours</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{volunteer.hoursContributed || 0}</p>
          </div> */}
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xs text-muted-foreground">Experience</p>
            </div>
            <p className="text-sm font-bold text-foreground">{volunteer.experience || "N/A"}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-xs text-muted-foreground">Availability</p>
            </div>
            <p className="text-sm font-bold text-foreground">{volunteer.availability || "N/A"}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Activity className="w-5 h-5 text-pink-600" />
              </div>
              <p className="text-xs text-muted-foreground">Active Since</p>
            </div>
            <p className="text-sm font-bold text-foreground">
              {volunteer.createdAt ? new Date(volunteer.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card dark:bg-gray-900 border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-border">
            <div className="flex gap-1 p-2 overflow-x-auto">
              {[
                { id: "overview", label: "Overview", icon: User },
                { id: "contact", label: "Contact", icon: Mail },
                { id: "skills", label: "Learning Hub", icon: Award },
                // { id: "certifications", label: "Certifications", icon: FileText }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {/* <Icon className="w-4 h-4" /> */}
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="py-6 px-2">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {volunteer.occupation && (
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Occupation
                      </h3>
                      <div className="p-4 bg-secondary/20 rounded-lg">
                        <p className="text-foreground leading-relaxed">{volunteer.occupation}</p>
                      </div>
                    </div>
                  )}
                  {volunteer.bio && (
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Background
                      </h3>
                      <div className="p-4 bg-secondary/20 rounded-lg">
                        <p className="text-foreground leading-relaxed">{volunteer.bio}</p>
                      </div>
                    </div>
                  )}
                </div>
                {!volunteer.occupation && !volunteer.bio && (
                  <div className="p-12 text-center bg-secondary/20 rounded-lg">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No background information available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "contact" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                    <a
                      href={`mailto:${volunteer.email}`}
                      className="text-foreground font-medium hover:text-primary transition break-all"
                    >
                      {volunteer.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                    <a
                      href={`tel:${volunteer.phone}`}
                      className="text-foreground font-medium hover:text-primary transition"
                    >
                      {volunteer.phone}
                    </a>
                  </div>
                </div>
                {volunteer.location && (
                  <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="text-foreground font-medium">{volunteer.location}</p>
                    </div>
                  </div>
                )}
                {volunteer.emergencyContact && (
                  <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <User className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Emergency Contact</p>
                      <p className="text-foreground font-medium">{volunteer.emergencyContact}</p>
                      {volunteer.emergencyPhone && (
                        <a
                          href={`tel:${volunteer.emergencyPhone}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {volunteer.emergencyPhone}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "skills" && (
              <div className="space-y-8">
                {/* LEARNING VIDEOS */}
                <div className="border border-border rounded-xl overflow-hidden bg-card dark:bg-gray-800">
                  {/* SECTION HEADER */}
                  <button
                    onClick={() => setShowVideos(!showVideos)}
                    className="w-full flex items-center justify-between px-4 py-4 hover:bg-secondary/30 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-primary" />
                      <span className="text-lg font-semibold text-foreground">
                        Learning Videos
                      </span>
                    </div>

                    <svg
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        showVideos ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* SECTION BODY */}
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      showVideos ? "max-h-500 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="py-4 space-y-4">
                      {learningVideos.length === 0 ? (
                        <div className="p-8 text-center bg-secondary/20 rounded-lg">
                          <Video className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground">
                            No learning videos available
                          </p>
                        </div>
                      ) : (
                        learningVideos.map((item: MediaItem) => {
                          const isOpen = openVideoId === item.id

                          return (
                            <div
                              key={item.id}
                              className="border border-border mb-0 rounded-xl overflow-hidden bg-card dark:bg-gray-900"
                            >
                              {/* VIDEO HEADER */}
                              <button
                                onClick={() =>
                                  setOpenVideoId(isOpen ? null : item.id)
                                }
                                className="w-full flex items-center justify-between px-2 py-2 hover:bg-secondary/20 transition"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Video className="w-3 h-3 text-primary" />
                                  </div>

                                  <p className="text-sm text-foreground text-left">
                                    {item.description || "Learning Video"}
                                  </p>
                                </div>

                                <svg
                                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                                    isOpen ? "rotate-180" : ""
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>

                              {/* VIDEO BODY */}
                              <div
                                className={`transition-all duration-300 overflow-hidden ${
                                  isOpen
                                    ? "max-h-250 opacity-100"
                                    : "max-h-0 opacity-0"
                                }`}
                              >
                                <div className="p-4 space-y-4">
                                  {renderMedia(item)}

                                  <div className="flex gap-3">
                                    <a
                                      href={item.secureUrl || item.fileUrl}
                                      target="_blank"
                                      className="flex-1 flex items-center justify-center px-3 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg text-primary font-medium"
                                    >
                                      <Eye className="w-4 h-4 mr-1" />
                                      View
                                    </a>

                                    <a
                                      href={item.secureUrl || item.fileUrl}
                                      download
                                      className="p-2 rounded-lg bg-secondary dark:bg-primary hover:bg-secondary/50"
                                    >
                                      <Download className="w-4 h-4" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>


                {/* LEARNING MATERIALS */}
                <div className="border border-border rounded-xl overflow-hidden bg-card dark:bg-gray-800">
                  <button
                    onClick={() => setShowFiles(!showFiles)}
                    className="w-full flex items-center justify-between px-4 py-4 hover:bg-secondary/30 transition"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-lg font-semibold text-foreground">Learning Materials (Files)</span>
                    </div>

                    <svg
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        showFiles ? "rotate-180" : "rotate-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      showFiles ? "max-h-500 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-4 grid grid-cols-1 md:grid-cols-6 gap-6">
                      {learningFiles.length === 0 ? (
                        <div className="p-8 text-center bg-secondary/20 rounded-lg col-span-full">
                          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground">No learning materials available</p>
                        </div>
                      ) : (
                        learningFiles.map((item: MediaItem) => (
                          <div
                            key={item.id}
                            className="bg-card dark:bg-gray-900 border border-border rounded-xl shadow-sm p-4"
                          >
                            {renderMedia(item)}

                            <p className="mt-3 font-semibold text-foreground">
                              {item.description || "Learning Material"}
                            </p>

                            <div className="flex gap-3 mt-4">
                              <a
                                href={item.secureUrl || item.fileUrl}
                                target="_blank"
                                className="flex-1 flex items-center justify-center px-3 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg text-primary font-medium"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Open
                              </a>

                              <a
                                href={item.secureUrl || item.fileUrl}
                                download
                                className="p-2 rounded-lg bg-secondary dark:bg-primary hover:bg-secondary/50"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "certifications" && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Certifications & Qualifications
                </h3>
                {volunteer.certifications && volunteer.certifications.length > 0 ? (
                  <div className="space-y-3">
                    {volunteer.certifications.map((cert, idx) => (
                      <div key={idx} className="p-4 bg-secondary/20 rounded-lg border-l-4 border-primary">
                        <p className="font-medium text-foreground">{cert}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-secondary/20 rounded-lg">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No certifications listed</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Timeline Section */}
        {volunteer.createdAt && (
          <div className="mt-6 bg-card dark:bg-gray-900 border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
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
                    {volunteer.approvedAt && <div className="w-0.5 h-full bg-border"></div>}
                  </div>
                  <div className="flex-1 pb-8">
                    <p className="font-semibold text-foreground">Joined as Volunteer</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(volunteer.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
                {volunteer.approvedAt && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Application Approved</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(volunteer.approvedAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-card dark:bg-gray-900 border border-border rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl">

              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary/50 transition"
              >
                <XCircle className="w-5 h-5 text-muted-foreground" />
              </button>

              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Edit className="w-6 h-6 text-primary" /> Edit Volunteer
              </h2>

              <EditVolunteerModal
                volunteer={volunteer}
                onClose={() => setShowEditModal(false)}
                onSave={(updatedVolunteer) => {
                  setVolunteer(updatedVolunteer);
                  setShowEditModal(false);
                }}
              />
            </div>
            </div>
          </div>
        )}

      </div>
      <ChangePasswordModal
          open={showChangePassword}
          onClose={() => setShowChangePassword(false)}
        />
    </div>
    
  );
  
}


