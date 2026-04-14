export interface Donation {
  _id?: string
  id: string
  name: string
  email: string | null
  program: "skills" | "education" | "sports"
  amount: number
  currency: "USD" | "NGN"
  paymentMethod: "paystack" | "kora" | "stripe"
  transactionId?: string
  message?: string
  reference: string
  donationMode: "anonymous" | "known"
  status: "pending" | "completed" | "failed"
  createdAt: string
  updatedAt?: string
  duration: "one-time" | "monthly" | "quarterly" | "annually"
  nextDonationDate?: Date
  reminder3Sent?: boolean
  reminder1Sent?: boolean
  reminderToken?: string
  reminderTokenExpiresAt?: Date
}

export interface Volunteer {
  _id?: string
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  profession?: string
  skills: string
  category: "professional" | "helper"
  experience?: string
  availability: string
  motivation?: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt?: string
}

export interface Project100Application {
  _id?: string
  id: string
  childName: string
  dateOfBirth: string
  schoolAttended?: string
  guardianName: string
  guardianPhone: string
  guardianEmail: string
  source: "project-100"
  status: "new" | "reviewed" | "converted" | "rejected"
  notes?: string
  convertedBoyId?: string
  reviewedAt?: string
  convertedAt?: string
  createdAt: string
  updatedAt?: string
}

export interface Boy {
  _id?: string
  id: string

  // Basic Info
  first_name: string
  last_name: string
  date_of_birth: string
  age_at_enrolment?: number

  // Program Info
  program_start_date?: string
  program_track: "skills_only" | "sports_only" | "mixed"

  // School Info
  school_name?: string
  class_level?: string

  // Guardian Info
  guardian_name: string
  sponsor_name?: string
  guardian_phone: string
  guardian_email: string

  // Address
  address_city?: string
  address_country?: string

  // Emergency Contact
  emergency_contact?: string | { name: string; phone: string }

  // Status
  status: "active" | "graduated" | "paused" | "dropped"
  consent_form_signed: boolean

  // Metadata
  profile_photo_url?: string
  notes?: string
  background?: string
  goals?: string
  createdAt?: string
  updatedAt?: string
  guardian_signature_url: String,

  // ⭐ Added Data From All Other Interfaces ⭐

  physical_assessments?: PhysicalAssessment[]
  cognitive_assessments?: CognitiveAssessment[]
  skills?: Skill[]
  skill_sessions?: SkillSession[]
}

export interface PhysicalAssessment {
  _id?: string
  id?: string
  boy_id: string
  assessment_date: string
  height_cm?: number
  weight_kg?: number
  bmi?: number
  resting_heart_rate?: number
  pushups_count?: number
  situps_count?: number
  shuttle_run_time?: number
  coach_comment?: string
  assessment_source: "baseline" | "midterm" | "endline" | "regular_check"
  createdAt?: string
  updatedAt?: string
}

export interface CognitiveAssessment {
  _id?: string
  id?: string
  boy_id: string
  assessment_date: string
  reading_level?: "below_grade" | "at_grade" | "above_grade"
  numeracy_level?: "below_grade" | "at_grade" | "above_grade"
  attention_focus_score?: number
  memory_score?: number
  problem_solving_score?: number
  school_exam_average?: number
  teacher_comment?: string
  assessment_source: "teacher_report" | "test" | "observation"
  createdAt?: string
  updatedAt?: string
}

export interface Skill {
  _id?: string
  id?: string
  name: string
  pillar: "skills" | "sports" | "education"
  description?: string
  level_structure?: string | Record<string, any>
  createdAt?: string
  updatedAt?: string
}

export interface SkillSession {
  _id?: string
  id?: string
  enrolment_id: string
  session_date: string
  hours: number
  topic: string
  attendance_status: "present" | "absent" | "late"
  performance_rating?: number
  mentor_comment?: string
  createdAt?: string
  updatedAt?: string
}



export interface Sponsorship {
  _id?: string
  id: string
  sponsorName: string
  sponsorEmail: string
  sponsorPhone: string
  company?: string
  commitmentLevel: "basic" | "standard" | "premium"
  amount: number
  currency: "USD" | "NGN"
  boyId?: string
  paymentMethod: "stripe" | "paystack"
  rateUsed?: number
  reference: string
  items: {
    id: string
    quantity: number
  }[]
  status: "pending" | "completed" | "failed"
  createdAt: string
  updatedAt?: string
}

export interface PaystackTransaction {
  _id?: string
  id: string
  reference: string
  amount: number
  currency: string
  email: string
  type: "donation" | "sponsorship"
  donationId?: string
  sponsorshipId?: string
  status: "pending" | "success" | "failed"
  createdAt: string
  verifiedAt?: string
}
