"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  TrendingUp,
  Award,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  BookOpen,
  Target,
  Video,
  FileText,
  Activity,
  Users,
  CheckCircle,
  Edit,
  Upload,
  Clock,
  School,
  AlertCircle,
  X
} from "lucide-react";
import BackButton from "@/components/backButton";

interface Boy {
  _id: string;
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  age_at_enrolment: number;
  program_start_date: string;
  program_track: string;
  school_name?: string;
  class_level?: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_email?: string;
  sponsor_name?: string;
  address_city?: string;
  address_country?: string;
  profile_photo_base64?: string
  emergency_contact?: string;
  status: string;
  consent_form_signed: boolean;
  profile_photo_url: string;
  guardian_signature_url?: string;
  background?: string;
  goals?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  physicalAssessments: any[];
  cognitiveAssessments: any[];
  skills: any[];
  sessions: any[];
  media: any[];
}

export default function BoyDashboard() {
  const params = useParams();
  const [boy, setBoy] = useState<Boy | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCognitiveModal, setShowCognitiveModal] = useState(false);
  const [showPhysicalModal, setShowPhysicalModal] = useState(false);
  const [cognitiveAssessments, setCognitiveAssessments] = useState<any[]>([]);
  const [physicalAssessments, setPhysicalAssessments] = useState<any[]>([]);

  const fetchBoy = async () => {
    try {
      const res = await fetch(`/api/boys/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setBoy(data.boy);
      }
    } catch (error) {
      console.error("Error fetching boy:", error);
    } finally {
      setLoading(false);
    }
  };

  function getLatestRecord<T extends { createdAt?: string; assessment_date?: string }>(
      records: T[]
    ): T | null {
      if (!records || records.length === 0) return null

      return [...records].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.assessment_date || 0).getTime()
        const dateB = new Date(b.createdAt || b.assessment_date || 0).getTime()
        return dateB - dateA
      })[0]
  }

  const fetchAssessments = async () => {
    if (!params.id) return;
    
    try {
      // Fetch cognitive assessments
      const cogRes = await fetch(`/api/assessments/cognitive/${params.id}`);
      if (cogRes.ok) {
        const cogData = await cogRes.json();
        setCognitiveAssessments(cogData.assessments || []);
      }

      // Fetch physical assessments
      const physRes = await fetch(`/api/assessments/physical/${params.id}`);
      if (physRes.ok) {
        const physData = await physRes.json();
        setPhysicalAssessments(physData.assessments || []);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
    }
  };

  useEffect(() => {
    fetchBoy();
    fetchAssessments();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!boy) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground mb-6">The boy's profile you're looking for doesn't exist.</p>
          <BackButton label="Back"/>
        </div>
      </div>
    );
  }

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const currentAge = calculateAge(boy.date_of_birth);
  const programDuration = Math.floor(
    (new Date().getTime() - new Date(boy.program_start_date).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <main className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <BackButton label="Back"/>
        {/* Profile Header */}
        <div className="bg-card dark:bg-gray-900 dark:bg-gray-900 border border-border rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-6 -mt-16">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-card shadow-lg bg-primary/10">
                  {boy.profile_photo_url ? (
                    <img
                      src={boy.profile_photo_url}
                      alt={`${boy.first_name} ${boy.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary text-4xl font-bold">
                      {boy.first_name.charAt(0)}{boy.last_name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 pt-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {boy.first_name} {boy.last_name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {currentAge} years old
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        {boy.program_track.charAt(0).toUpperCase() + boy.program_track.slice(1)} Track
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {programDuration} days in program
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold ${
                        boy.status === "active"
                          ? "bg-green-100 text-green-800"
                          : boy.status === "inactive"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {boy.status.charAt(0).toUpperCase() + boy.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                  {/* <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border text-foreground rounded-lg transition font-medium">
                    <Upload className="w-4 h-4" />
                    Upload Media
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card dark:bg-gray-900 dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Video className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{boy.sessions?.length || 0}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground">Assessments</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {(boy.physicalAssessments?.length || 0) + (boy.cognitiveAssessments?.length || 0)}
            </p>
          </div>
          <div className="bg-card dark:bg-gray-900 dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xs text-muted-foreground">Skills</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{boy.skills?.length || 0}</p>
          </div>
          <div className="bg-card dark:bg-gray-900 dark:bg-gray-900 border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Video className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-xs text-muted-foreground">Media Files</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{boy.media?.length || 0}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card dark:bg-gray-900 dark:bg-gray-900 border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-border">
            <div className="flex gap-1 p-2 overflow-x-auto">
              {[
                { id: "overview", label: "Overview", icon: User },
                { id: "guardian", label: "Guardian", icon: Users },
                { id: "education", label: "Education", icon: School },
                { id: "assessments", label: "Assessments", icon: FileText },
                { id: "media", label: "Media", icon: Video }
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
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-4 p-3 bg-secondary/20 rounded-lg">
                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Date of Birth</p>
                          <p className="text-foreground font-medium">
                            {new Date(boy.date_of_birth).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-3 bg-secondary/20 rounded-lg">
                        <MapPin className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="text-foreground font-medium">
                            {boy.address_city && boy.address_country
                              ? `${boy.address_city}, ${boy.address_country}`
                              : boy.address_city || boy.address_country || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-3 bg-secondary/20 rounded-lg">
                        <Activity className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Program Track</p>
                          <p className="text-foreground font-medium capitalize">{boy.program_track}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Background & Goals */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Background & Goals
                    </h3>
                    <div className="p-4 bg-secondary/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Background</p>
                      <p className="text-foreground leading-relaxed">
                        {boy.background || "No background information provided"}
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Goals</p>
                      <p className="text-foreground leading-relaxed">
                        {boy.goals || "No goals set yet"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sponsor Information */}
                {/* {boy.sponsor_name ? (
                  <div className="p-6 bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Heart className="w-6 h-6 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Sponsored By</h3>
                    </div>
                    <p className="text-2xl font-bold text-primary">{boy.sponsor_name}</p>
                  </div>
                ) : (
                  <div className="p-6 bg-secondary/20 border border-border rounded-xl text-center">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Sponsor Yet</h3>
                    <p className="text-muted-foreground mb-4">This boy is waiting for a sponsor</p>
                    <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition font-medium">
                      Find Sponsor
                    </button>
                  </div>
                )} */}

                {/* Notes */}
                {boy.notes && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-900 mb-1">Notes</p>
                        <p className="text-yellow-800">{boy.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "guardian" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Guardian Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Guardian Name</p>
                      <p className="text-foreground font-medium">{boy.guardian_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                      <a
                        href={`tel:${boy.guardian_phone}`}
                        className="text-foreground font-medium hover:text-primary transition"
                      >
                        {boy.guardian_phone}
                      </a>
                    </div>
                  </div>
                  {boy.guardian_email && (
                    <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                        <a
                          href={`mailto:${boy.guardian_email}`}
                          className="text-foreground font-medium hover:text-primary transition"
                        >
                          {boy.guardian_email}
                        </a>
                      </div>
                    </div>
                  )}
                  {boy.emergency_contact && (
                    <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Emergency Contact</p>
                        <p className="text-foreground font-medium">{boy.emergency_contact}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Consent Form */}
                <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      boy.consent_form_signed ? "bg-green-100" : "bg-red-100"
                    }`}>
                      {boy.consent_form_signed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Consent Form</p>
                      <p className={`text-sm ${
                        boy.consent_form_signed ? "text-green-600" : "text-red-600"
                      }`}>
                        {boy.consent_form_signed ? "Signed" : "Not Signed"}
                      </p>
                    </div>
                  </div>
                  {boy.guardian_signature_url && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">Guardian Signature</p>
                      <img
                        src={boy.guardian_signature_url}
                        alt="Guardian Signature"
                        className="h-20 bg-white border border-border rounded-lg p-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "education" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <School className="w-5 h-5 text-primary" />
                  Education Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <School className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">School Name</p>
                      <p className="text-foreground font-medium">
                        {boy.school_name || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Class Level</p>
                      <p className="text-foreground font-medium">
                        {boy.class_level || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Age at Enrolment</p>
                      <p className="text-foreground font-medium">{boy.age_at_enrolment} years old</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Program Start Date</p>
                      <p className="text-foreground font-medium">
                        {new Date(boy.program_start_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "assessments" && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      Physical Assessments
                    </h3>
                    <button
                      onClick={() => setShowPhysicalModal(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition text-sm font-medium"
                    >
                      <Upload className="w-4 h-4" />
                      Add Assessment
                    </button>
                  </div>
                  {boy.physicalAssessments.length > 0 ? (
                    <div className="space-y-3">
                      {boy.physicalAssessments.map((assessment, idx) => (
                        <div key={idx} className="p-4 bg-secondary/20 rounded-lg border border-border">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold text-foreground">
                                {new Date(assessment.assessment_date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric"
                                })}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Assessed by: {assessment.assessed_by}
                              </p>
                            </div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {assessment.assessment_source}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="p-2 bg-card dark:bg-gray-900 rounded">
                              <p className="text-xs text-muted-foreground">Height</p>
                              <p className="font-semibold text-foreground">{assessment.height_cm} cm</p>
                            </div>
                            <div className="p-2 bg-card dark:bg-gray-900 rounded">
                              <p className="text-xs text-muted-foreground">Weight</p>
                              <p className="font-semibold text-foreground">{assessment.weight_kg} kg</p>
                            </div>
                            <div className="p-2 bg-card dark:bg-gray-900 rounded">
                              <p className="text-xs text-muted-foreground">BMI</p>
                              <p className="font-semibold text-foreground">{assessment.bmi}</p>
                            </div>
                            <div className="p-2 bg-card dark:bg-gray-900 rounded">
                              <p className="text-xs text-muted-foreground">Heart Rate</p>
                              <p className="font-semibold text-foreground">{assessment.resting_heart_rate} bpm</p>
                            </div>
                            <div className="p-2 bg-card dark:bg-gray-900 rounded">
                              <p className="text-xs text-muted-foreground">Push-ups</p>
                              <p className="font-semibold text-foreground">{assessment.pushups_count}</p>
                            </div>
                            <div className="p-2 bg-card dark:bg-gray-900 rounded">
                              <p className="text-xs text-muted-foreground">Sit-ups</p>
                              <p className="font-semibold text-foreground">{assessment.situps_count}</p>
                            </div>
                            <div className="p-2 bg-card dark:bg-gray-900 rounded">
                              <p className="text-xs text-muted-foreground">Shuttle Run</p>
                              <p className="font-semibold text-foreground">{assessment.shuttle_run_time}s</p>
                            </div>
                          </div>
                          {assessment.coach_comment && (
                            <div className="p-3 bg-card dark:bg-gray-900 rounded border-l-4 border-primary">
                              <p className="text-sm text-foreground italic">"{assessment.coach_comment}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-secondary/20 rounded-lg">
                      <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">No physical assessments yet</p>
                      <button
                        onClick={() => setShowPhysicalModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        Add First Assessment
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Cognitive Assessments
                    </h3>
                    <button
                      onClick={() => setShowCognitiveModal(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition text-sm font-medium"
                    >
                      <Upload className="w-4 h-4" />
                      Add Assessment
                    </button>
                  </div>
                  {boy.cognitiveAssessments.length > 0 ? (
                    <div className="space-y-3">
                      {boy.cognitiveAssessments.map((assessment, idx) => (
                        <div key={idx} className="p-4 bg-secondary/20 rounded-lg border border-border">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold text-foreground">
                                {new Date(assessment.assessment_date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric"
                                })}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Assessed by: {assessment.assessed_by}
                              </p>
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              {assessment.assessment_source}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="p-2 bg-card dark:bg-gray-900 rounded">
                              <p className="text-xs text-muted-foreground">Reading</p>
                              <p className="font-semibold text-foreground">{assessment.reading_level}/10</p>
                            </div>
                            <div className="p-2 bg-card dark:bg-gray-900 rounded">
                              <p className="text-xs text-muted-foreground">Numeracy</p>
                              <p className="font-semibold text-foreground">{assessment.numeracy_level}/10</p>
                            </div>
                            <div className="p-2 bg-card dark:bg-gray-900 rounded">
                              <p className="text-xs text-muted-foreground">Attention</p>
                              <p className="font-semibold text-foreground">{assessment.attention_focus_score}/10</p>
                            </div>
                            <div className="p-2 bg-card dark:bg-gray-900 rounded">
                              <p className="text-xs text-muted-foreground">Memory</p>
                              <p className="font-semibold text-foreground">{assessment.memory_score}/10</p>
                            </div>
                            <div className="p-2 bg-card dark:bg-gray-900 rounded">
                              <p className="text-xs text-muted-foreground">Problem Solving</p>
                              <p className="font-semibold text-foreground">{assessment.problem_solving_score}/10</p>
                            </div>
                            <div className="p-2 bg-card dark:bg-gray-900 rounded">
                              <p className="text-xs text-muted-foreground">School Exam Avg</p>
                              <p className="font-semibold text-foreground">{assessment.school_exam_average}%</p>
                            </div>
                          </div>
                          {assessment.teacher_comment && (
                            <div className="p-3 bg-card dark:bg-gray-900 rounded border-l-4 border-primary">
                              <p className="text-sm text-foreground italic">"{assessment.teacher_comment}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-secondary/20 rounded-lg">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">No cognitive assessments yet</p>
                      <button
                        onClick={() => setShowCognitiveModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        Add First Assessment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "media" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Video className="w-5 h-5 text-primary" />
                    Media Files
                  </h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition font-medium">
                    <Upload className="w-4 h-4" />
                    Upload Media
                  </button>
                </div>
                {boy.media && boy.media.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {boy.media.map((item, idx) => (
                      <div key={idx} className="p-4 bg-secondary/20 rounded-lg">
                        <Video className="w-12 h-12 text-primary mx-auto mb-3" />
                        <p className="text-foreground text-center">{item}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-secondary/20 rounded-lg">
                    <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-foreground mb-2">No media files yet</h4>
                    <p className="text-muted-foreground mb-6">Upload photos and videos of this boy's progress</p>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition font-medium">
                      <Upload className="w-4 h-4" />
                      Upload First File
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && boy && (
        <EditBoyModal
          boy={boy}
          onClose={() => setShowEditModal(false)}
          onSaved={() => {
            setShowEditModal(false);
            fetchBoy();
          }}
        />
      )}

      {/* Cognitive Assessment Modal */}
      {showCognitiveModal && boy && (
        <CognitiveAssessmentModal
          boyId={boy.id}
          onClose={() => setShowCognitiveModal(false)}
          onSaved={() => {
            setShowCognitiveModal(false);
            fetchAssessments();
          }}
        />
      )}

      {/* Physical Assessment Modal */}
      {showPhysicalModal && boy && (
        <PhysicalAssessmentModal
          boyId={boy.id}
          onClose={() => setShowPhysicalModal(false)}
          onSaved={() => {
            setShowPhysicalModal(false);
            fetchAssessments();
          }}
        />
      )}
    </main>
  );
}

// Edit Modal Component
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
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleChange = (field: keyof Boy, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onloadend = () => {
    const base64 = reader.result as string
    setPreviewImage(base64)

    handleChange("profile_photo_base64", base64)
  }
  reader.readAsDataURL(file)
}

  const handleSave = async () => {
  if (saving) return;

  setSaving(true);
  setError("");

  try {
    const payload = { ...form };

    if (!payload.profile_photo_base64) {
      delete payload.profile_photo_base64;
    }

    const res = await fetch(`/api/boys/${form.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to update profile");
    }

    onSaved();

  } catch (error: any) {
    setError(error.message || "Network error occurred");
  } finally {
    setSaving(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card dark:bg-gray-900 dark:bg-gray-900 border border-border rounded-2xl p-8 shadow-2xl max-w-4xl w-full relative overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
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
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Photo */}
<div className="flex flex-col items-center gap-4 mb-6">
  <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-border shadow bg-secondary/20">
    {previewImage ? (
      <img
        src={previewImage}
        alt="Profile Preview"
        className="w-full h-full object-cover"
      />
    ) : form.profile_photo_url ? (
      <img
        src={form.profile_photo_url}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground">
        {form.first_name?.charAt(0)}
        {form.last_name?.charAt(0)}
      </div>
    )}
  </div>

  <label className="cursor-pointer px-4 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/70 transition">
    Change Photo
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleImageChange}
    />
  </label>
</div>
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={form.date_of_birth.split("T")[0]}
                  onChange={(e) => handleChange("date_of_birth", e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Age at Enrolment</label>
                <input
                  type="number"
                  value={form.age_at_enrolment}
                  onChange={(e) => handleChange("age_at_enrolment", Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Program Track</label>
                <select
                  value={form.program_track}
                  onChange={(e) => handleChange("program_track", e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                >
                  <option value="skills">Skills</option>
                  <option value="education">Education</option>
                  <option value="sports">Sports</option>
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
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">City</label>
                <input
                  type="text"
                  value={form.address_city || ""}
                  onChange={(e) => handleChange("address_city", e.target.value)}
                  placeholder="Enter city"
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                <input
                  type="text"
                  value={form.address_country || ""}
                  onChange={(e) => handleChange("address_country", e.target.value)}
                  placeholder="Enter country"
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Guardian Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Guardian Name</label>
                <input
                  type="text"
                  value={form.guardian_name}
                  onChange={(e) => handleChange("guardian_name", e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Guardian Phone</label>
                <input
                  type="tel"
                  value={form.guardian_phone}
                  onChange={(e) => handleChange("guardian_phone", e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Guardian Email</label>
                <input
                  type="email"
                  value={form.guardian_email || ""}
                  onChange={(e) => handleChange("guardian_email", e.target.value)}
                  placeholder="guardian@example.com"
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Emergency Contact</label>
                <input
                  type="text"
                  value={form.emergency_contact || ""}
                  onChange={(e) => handleChange("emergency_contact", e.target.value)}
                  placeholder="Emergency contact number"
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <School className="w-5 h-5 text-primary" />
              Education
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">School Name</label>
                <input
                  type="text"
                  value={form.school_name || ""}
                  onChange={(e) => handleChange("school_name", e.target.value)}
                  placeholder="Enter school name"
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Class Level</label>
                <input
                  type="text"
                  value={form.class_level || ""}
                  onChange={(e) => handleChange("class_level", e.target.value)}
                  placeholder="e.g., Grade 5"
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Additional Information
            </h3>
            <div className="space-y-4">
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
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
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
                <>
                  <CheckCircle className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cognitive Assessment Modal
function CognitiveAssessmentModal({
  boyId,
  onClose,
  onSaved,
}: {
  boyId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    boy_id: boyId,
    assessment_date: new Date().toISOString().split("T")[0],
    reading_level: 5,
    numeracy_level: 5,
    attention_focus_score: 5,
    memory_score: 5,
    problem_solving_score: 5,
    school_exam_average: 50,
    teacher_comment: "",
    assessment_source: "school",
    assessed_by: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/assessments/cognitive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        onSaved();
      } else {
        const errorText = await res.text();
        setError(errorText || "Failed to create assessment");
      }
    } catch (error) {
      setError("Network error occurred");
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card dark:bg-gray-900 dark:bg-gray-900 border border-border rounded-2xl p-8 shadow-2xl max-w-3xl w-full relative overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-primary" />
          Add Cognitive Assessment
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Assessment Date</label>
              <input
                type="date"
                value={form.assessment_date}
                onChange={(e) => handleChange("assessment_date", e.target.value)}
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Assessed By</label>
              <input
                type="text"
                value={form.assessed_by}
                onChange={(e) => handleChange("assessed_by", e.target.value)}
                placeholder="Teacher/Assessor name"
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Assessment Source</label>
            <select
              value={form.assessment_source}
              onChange={(e) => handleChange("assessment_source", e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            >
              <option value="school">School</option>
              <option value="program">Program</option>
              <option value="external">External</option>
            </select>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Assessment Scores (1-10)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reading Level: {form.reading_level}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={form.reading_level}
                  onChange={(e) => handleChange("reading_level", Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Numeracy Level: {form.numeracy_level}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={form.numeracy_level}
                  onChange={(e) => handleChange("numeracy_level", Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Attention & Focus: {form.attention_focus_score}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={form.attention_focus_score}
                  onChange={(e) => handleChange("attention_focus_score", Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Memory Score: {form.memory_score}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={form.memory_score}
                  onChange={(e) => handleChange("memory_score", Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Problem Solving: {form.problem_solving_score}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={form.problem_solving_score}
                  onChange={(e) => handleChange("problem_solving_score", Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  School Exam Average (%): {form.school_exam_average}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.school_exam_average}
                  onChange={(e) => handleChange("school_exam_average", Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Teacher's Comment</label>
            <textarea
              value={form.teacher_comment}
              onChange={(e) => handleChange("teacher_comment", e.target.value)}
              placeholder="Add teacher's observations and comments..."
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none h-24"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
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
                <>
                  <CheckCircle className="w-4 h-4" />
                  Save Assessment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Physical Assessment Modal
function PhysicalAssessmentModal({
  boyId,
  onClose,
  onSaved,
}: {
  boyId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    boy_id: boyId,
    assessment_date: new Date().toISOString().split("T")[0],
    height_cm: 0,
    weight_kg: 0,
    resting_heart_rate: 0,
    pushups_count: 0,
    situps_count: 0,
    shuttle_run_time: 0,
    coach_comment: "",
    assessment_source: "program",
    assessed_by: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const calculateBMI = () => {
    if (form.height_cm > 0 && form.weight_kg > 0) {
      const heightInMeters = form.height_cm / 100;
      return (form.weight_kg / (heightInMeters * heightInMeters)).toFixed(2);
    }
    return "0";
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/assessments/physical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        onSaved();
      } else {
        const errorText = await res.text();
        setError(errorText || "Failed to create assessment");
      }
    } catch (error) {
      setError("Network error occurred");
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card dark:bg-gray-900 dark:bg-gray-900 border border-border rounded-2xl p-8 shadow-2xl max-w-3xl w-full relative overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Activity className="w-6 h-6 text-primary" />
          Add Physical Assessment
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Assessment Date</label>
              <input
                type="date"
                value={form.assessment_date}
                onChange={(e) => handleChange("assessment_date", e.target.value)}
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Assessed By</label>
              <input
                type="text"
                value={form.assessed_by}
                onChange={(e) => handleChange("assessed_by", e.target.value)}
                placeholder="Coach/Assessor name"
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Assessment Source</label>
            <select
              value={form.assessment_source}
              onChange={(e) => handleChange("assessment_source", e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            >
              <option value="program">Program</option>
              <option value="school">School</option>
              <option value="external">External</option>
            </select>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Body Measurements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={form.height_cm}
                  onChange={(e) => handleChange("height_cm", Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Weight (kg)</label>
                <input
                  type="number"
                  value={form.weight_kg}
                  onChange={(e) => handleChange("weight_kg", Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">BMI (calculated)</label>
                <input
                  type="text"
                  value={calculateBMI()}
                  disabled
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-secondary/30 text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Physical Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Resting Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={form.resting_heart_rate}
                  onChange={(e) => handleChange("resting_heart_rate", Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Push-ups Count</label>
                <input
                  type="number"
                  value={form.pushups_count}
                  onChange={(e) => handleChange("pushups_count", Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Sit-ups Count</label>
                <input
                  type="number"
                  value={form.situps_count}
                  onChange={(e) => handleChange("situps_count", Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Shuttle Run Time (seconds)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.shuttle_run_time}
                  onChange={(e) => handleChange("shuttle_run_time", Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Coach's Comment</label>
            <textarea
              value={form.coach_comment}
              onChange={(e) => handleChange("coach_comment", e.target.value)}
              placeholder="Add coach's observations and comments..."
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-card dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none h-24"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
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
                <>
                  <CheckCircle className="w-4 h-4" />
                  Save Assessment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}