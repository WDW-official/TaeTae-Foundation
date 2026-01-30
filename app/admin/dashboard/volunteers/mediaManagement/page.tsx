"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Video,
  FileText,
  Image as ImageIcon,
  Trash2,
  Download,
  Eye,
  Filter,
  Search,
  X,
  Play,
  File,
  Calendar,
  User,
  Tag
} from "lucide-react";
import { useAuthStore } from "@/app/store/auth.store";

interface MediaItem {
  id: string;
  fileName?: string;
  publicId?: string;
  fileUrl?: string;
  fileTitle?:string;
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

export default function MediaManagementPage() {
   const role = useAuthStore((s) => s.role)
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterUploadedBy, setFilterUploadedBy] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  useEffect(() => {
    fetchMedia();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [media, searchQuery, filterType, filterUploadedBy]);

  const fetchMedia = async () => {
    try {
      const response = await fetch("/api/media");
      const data = await response.json();
      setMedia(data.media || []);
    } catch (error) {
      console.error("Error fetching media:", error);
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };
  const renderVideo = (item: MediaItem) => {
    const url = getFileUrl(item);
    if (!url) return null;

    // Detect types
    const isYouTube =
        url.includes("youtube.com") || url.includes("youtu.be");

    const isCloudinary = url.includes("res.cloudinary.com");

    const isVideoFile =
        /\.(mp4|mov|webm|ogg)$/i.test(url) ||
        item.resourceType === "video" ||
        item.fileType?.startsWith("video/");

    // 🎥 YouTube embed
    if (isYouTube) {
        const videoId =
        url.split("v=")[1]?.split("&")[0] ||
        url.split("youtu.be/")[1]?.split("?")[0];

        return (
        <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full h-full"
            allowFullScreen
        />
        );
    }

    // 🎥 Cloudinary or normal video file
    if (isCloudinary || isVideoFile) {
        return (
        <video
            src={url}
            controls
            className="w-full h-full object-cover"
        />
        );
    }

    return null;
    };

    const downloadFile = async (url: string, fileName: string) => {
      try {
        const res = await fetch(url);
        const blob = await res.blob();

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);

      } catch (err) {
        console.error("Download failed:", err);
        alert("Unable to download file.");
      }
    };

    const downloadYouTube = (url: string, fileName: string) => {
      const apiUrl = `/api/download-youtube?url=${encodeURIComponent(url)}`;

      const a = document.createElement("a");
      a.href = apiUrl;
      a.download = `${fileName}.mp4`;
      a.click();
    };



  const applyFilters = () => {
    let filtered = [...media];

    if (searchQuery) {
      filtered = filtered.filter(
        (m) =>
          (m.fileName || m.publicId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.boyName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((m) => m.uploadType === filterType);
    }

    if (filterUploadedBy !== "all") {
      filtered = filtered.filter((m) => m.uploadedBy === filterUploadedBy);
    }

    setFilteredMedia(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      const response = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (response.ok) {
        setMedia(media.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  const getFileIcon = (item: MediaItem) => {
    const type = item.resourceType || item.fileType || "";
    if (type === "video" || type.startsWith("video/")) return <Video className="w-5 h-5" />;
    if (type === "image" || type.startsWith("image/")) return <ImageIcon className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const getFileName = (item: MediaItem) => {
    return item.fileName || item.publicId?.split('/').pop() || 'Untitled';
  };

  const getFileUrl = (item: MediaItem) => {
    return item.secureUrl || item.fileUrl || '';
  };

  const getFileSize = (item: MediaItem) => {
    return item.bytes || item.fileSize || 0;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const stats = {
    total: media.length,
    videos: media.filter((m) => m.resourceType === "video" || m.fileType?.startsWith("video/")).length,
    documents: media.filter((m) => m.format === "pdf" || m.fileType?.includes("pdf") || m.fileType?.includes("document")).length,
    images: media.filter((m) => m.resourceType === "image" || m.fileType?.startsWith("image/")).length,
    sessions: media.filter((m) => m.uploadType === "session").length,
    assessments: media.filter((m) => m.uploadType === "assessment").length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading media...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <Link
          href="/admin/dashboard/volunteers"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition mb-3 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <Video className="w-8 h-8 text-primary" /> Media Library
          </h1>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition font-medium"
          >
            <Upload className="w-4 h-4" /> Upload Media
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <File className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Total Files</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Videos</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.videos}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ImageIcon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Images</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.images}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Documents</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.documents}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Play className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.sessions}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Assessments</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.assessments}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Filters & Search</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            >
              <option value="all">All Types</option>
              <option value="session">Session Videos</option>
              <option value="assessment">Assessments</option>
              <option value="profile">Profile Media</option>
              <option value="other">Other</option>
            </select>
            <select
              value={filterUploadedBy}
              onChange={(e) => setFilterUploadedBy(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            >
              <option value="all">All Uploaders</option>
              <option value="admin">Admin</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>
          {(searchQuery || filterType !== "all" || filterUploadedBy !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredMedia.length} of {media.length} files
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterType("all");
                  setFilterUploadedBy("all");
                }}
                className="text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Media Display */}
        {filteredMedia.length === 0 ? (
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <File className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No media found</h3>
            <p className="text-muted-foreground mb-6">
              {media.length === 0
                ? "Upload your first file to get started"
                : "Try adjusting your filters"}
            </p>
            {media.length === 0 && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition font-medium"
              >
                <Upload className="w-4 h-4" /> Upload First File
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="bg-card dark:bg-gray-900 border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition group"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-secondary/20 flex items-center justify-center relative overflow-hidden">

                    {/* VIDEO DISPLAY (FILE, CLOUDINARY, OR YOUTUBE) */}
                    {(item.resourceType === "video" ||
                      item.fileType?.startsWith("video/") ||
                      item.secureUrl?.includes("youtube") ||
                      item.secureUrl?.includes("youtu.be")
                    ) ? (
                      <div className="absolute inset-0">
                        {renderVideo(item)}
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    ) : item.resourceType === "image" ||
                      item.fileType?.startsWith("image/") ? (
                      <img
                        src={getFileUrl(item)}
                        alt={getFileName(item)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-primary">{getFileIcon(item)}</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 truncate">
                      {item.fileTitle}
                    </h3>

                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.uploadType === "session"
                            ? "bg-blue-100 text-blue-800"
                            : item.uploadType === "assessment"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {item.uploadType}
                      </span>

                      {item.boyName && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <User className="w-3 h-3 mr-1" />
                          {item.boyName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span>{formatFileSize(getFileSize(item))}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <a
                        href={getFileUrl(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" /> View
                      </a>

                      <button
                        onClick={() => {
                          const fileUrl = getFileUrl(item);
                          const fileName = getFileName(item) || "download";

                          const downloadUrl = `/api/download?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}`;

                          const a = document.createElement("a");
                          a.href = downloadUrl;
                          a.click();
                        }}
                        className="p-2 rounded-lg hover:bg-secondary transition"
                      >
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </button>

                      {role === "superAdmin" && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div className="bg-card dark:bg-gray-900 border border-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  <th className="px-6 py-4 text-left text-sm font-semibold">File</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  {/* <th className="px-6 py-4 text-left text-sm font-semibold">Boy</th> */}
                  <th className="px-6 py-4 text-left text-sm font-semibold">Uploaded By</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Size</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedia.map((item, idx) => (
                  <tr key={item.id} className={`border-b border-border hover:bg-secondary/20 transition ${
                    idx % 2 === 0 ? "bg-card dark:bg-gray-900" : "bg-secondary/10"
                  }`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          {getFileIcon(item)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.fileTitle}</p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-xs">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.uploadType === "session" ? "bg-blue-100 text-blue-800" :
                        item.uploadType === "assessment" ? "bg-green-100 text-green-800" :
                        "bg-purple-100 text-purple-800"
                      }`}>
                        {item.uploadType}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 text-foreground">{item.boyName || "-"}</td> */}
                    <td className="px-6 py-4 text-foreground capitalize">{item.uploadedBy}</td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">
                      {formatFileSize(getFileSize(item))}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <a
                          href={getFileUrl(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-primary/10 transition group"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        </a>
                        <button
                          onClick={() => {
                            const fileUrl = getFileUrl(item);
                            const fileName = getFileName(item) || "download";

                            const downloadUrl = `/api/download?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}`;

                            const a = document.createElement("a");
                            a.href = downloadUrl;
                            a.click();
                          }}
                          className="p-2 rounded-lg hover:bg-secondary transition"
                        >
                          <Download className="w-4 h-4 text-muted-foreground" />
                        </button>
                        {role === "superAdmin" && (
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 hover:bg-destructive/10 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
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

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={() => {
            setShowUploadModal(false);
            fetchMedia();
          }}
        />
      )}
    </div>
  );
}

function UploadModal({
  onClose,
  onUploadComplete,
}: {
  onClose: () => void;
  onUploadComplete: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [boyId, setBoyId] = useState("");
  const [uploadType, setUploadType] = useState<
    "session" | "assessment" | "profile" | "other"
  >("session");
  const [uploadedBy, setUploadedBy] = useState("admin");
  const [description, setDescription] = useState("");
  const [fileTitle, setfileTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (selected: File | null) => {
    setFile(selected);
    if (selected) setMediaUrl(""); // Disable URL when file chosen
  };

  const handleUrlChange = (url: string) => {
    setMediaUrl(url);
    if (url.length > 0) setFile(null); // Disable file when URL entered
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file && !mediaUrl) {
      alert("Please upload a file or enter a URL.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      if (file) formData.append("file", file);
      if (mediaUrl) formData.append("url", mediaUrl);

      formData.append("uploadType", uploadType);
      formData.append("uploadedBy", uploadedBy);
      if (boyId) formData.append("boyId", boyId);
      if (description) formData.append("description", description);
      if (fileTitle) formData.append("fileTitle", fileTitle);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        onUploadComplete();
      } else {
        console.error("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* SCROLLABLE MODAL CONTENT */}
      <div
        className="bg-card dark:bg-gray-900 border border-border rounded-2xl p-8 shadow-2xl max-w-2xl w-full relative 
                   max-h-[80vh] overflow-y-auto custom-scrollbar"
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground 
                     hover:text-foreground hover:bg-secondary/50 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Upload className="w-6 h-6 text-primary" />
          Upload Media
        </h2>

        <div className="space-y-6">

          {/* FILE UPLOAD AREA */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
              dragActive ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            {file ? (
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                  {file.type.startsWith("video/") ? (
                    <Video className="w-6 h-6 text-primary" />
                  ) : file.type.startsWith("image/") ? (
                    <ImageIcon className="w-6 h-6 text-primary" />
                  ) : (
                    <FileText className="w-6 h-6 text-primary" />
                  )}
                </div>

                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                <button
                  className="text-red-500 text-sm"
                  onClick={() => setFile(null)}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="font-medium">Drag & drop a file here</p>
                <p className="text-sm text-muted-foreground">or</p>

                <label className="inline-block px-4 py-2 bg-primary text-white rounded-lg cursor-pointer">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    disabled={mediaUrl.length > 0}
                    onChange={(e) =>
                      handleFileSelect(e.target.files?.[0] || null)
                    }
                  />
                </label>

                <p className="text-xs text-muted-foreground">
                  Supports videos, images, and PDFs
                </p>
              </div>
            )}
          </div>

          {/* URL INPUT */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Or Enter URL (YouTube or Cloudinary)
            </label>
            <input
              type="text"
              placeholder="https://youtube.com/..."
              value={mediaUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              disabled={file !== null}
              className="w-full px-4 py-2 border border-border rounded-lg bg-card dark:bg-gray-900 
                         focus:ring-2 focus:ring-primary outline-none transition"
            />
          </div>
            
          {/* FORM FIELDS */}
          <div>
            <label className="block text-sm font-medium mb-2">File Title</label>
            <input
              value={fileTitle}
              onChange={(e) => setfileTitle(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg resize-none"
              placeholder="Add a file title…"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Upload Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Upload Type</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value as any)}
                className="w-full px-4 py-2 border border-border rounded-lg"
              >
                <option value="session">Session Video</option>
                <option value="assessment">Assessment</option>
                <option value="profile">Profile Media</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Uploaded By */}
            <div>
              <label className="block text-sm font-medium mb-2">Uploaded By</label>
              <select
                value={uploadedBy}
                onChange={(e) => setUploadedBy(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg"
              >
                <option value="admin">Admin</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
          </div>

          {/* BOY ID */}
          <div>
            <label className="block text-sm font-medium mb-2">Boy ID (optional)</label>
            <input
              type="text"
              value={boyId}
              onChange={(e) => setBoyId(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg"
            />
          </div>

          
          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-border rounded-lg resize-none"
              placeholder="Add a description…"
            ></textarea>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={uploading}
              className="flex-1 py-3 border border-border rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleUpload}
              disabled={uploading || (!file && !mediaUrl)}
              className="flex-1 py-3 bg-primary text-white rounded-lg"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


