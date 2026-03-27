"use client"

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  FileText,
  Users,
  Lock,
  Search,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Download,
  Upload,
  PenSquare,
  Camera,
  Smartphone,
  Monitor,
  ChevronRight,
  FolderOpen,
  Eye,
  Filter,
  User,
  Home,
  Phone,
  Mail,
  Calendar,
  ClipboardCheck,
} from "lucide-react";

const categories = [
  {
    title: "Parents & Participants",
    icon: Users,
    description:
      "Consent forms, participant agreements, medical details, emergency contacts, and image permissions.",
    count: 12,
  },
  {
    title: "Coaches & Volunteers",
    icon: ClipboardCheck,
    description:
      "Onboarding packs, codes of conduct, vetting declarations, role-based MOUs, and safeguarding sign-offs.",
    count: 9,
  },
  {
    title: "Mentors",
    icon: ShieldCheck,
    description:
      "Mentor MOAs, ethics declarations, interaction boundaries, and verification records.",
    count: 5,
  },
  {
    title: "Data & Privacy",
    icon: Lock,
    description:
      "NDPR notices, privacy consents, data-use permissions, and record-retention acknowledgements.",
    count: 6,
  },
];

const documents = [
  {
    id: 1,
    title: "Parental / Guardian Consent Form",
    audience: "Parents & Participants",
    status: "Required",
    type: "Form",
    description:
      "Programme participation consent, emergency authorisation, media permission, and NDPR data consent for minors.",
  },
  {
    id: 2,
    title: "Media & Image Consent",
    audience: "Parents & Participants",
    status: "Required",
    type: "Form",
    description:
      "Permission to use approved photos and videos for reporting, website stories, and sponsor communication.",
  },
  {
    id: 3,
    title: "Volunteer & Coach MOU",
    audience: "Coaches & Volunteers",
    status: "Required",
    type: "Template",
    description:
      "Defines role expectations, code of conduct, safeguarding duties, duration, and compliance obligations.",
  },
  {
    id: 4,
    title: "Mentor Agreement (MOA)",
    audience: "Mentors",
    status: "Required",
    type: "Template",
    description:
      "Sets mentorship scope, child-safe communication boundaries, reporting expectations, and accountability.",
  },
  {
    id: 5,
    title: "NDPR Privacy Notice & Consent",
    audience: "Data & Privacy",
    status: "Required",
    type: "Form",
    description:
      "Explains how participant, volunteer, and donor data is collected, stored, processed, and protected.",
  },
  {
    id: 6,
    title: "Partner School / Club MOU",
    audience: "Partners",
    status: "Optional",
    type: "Template",
    description:
      "Sets out programme delivery responsibilities, facility use, reporting obligations, and legal expectations.",
  },
];

const legalBody = [
  {
    heading: "Programme Participation Consent",
    body:
      "I, the undersigned parent or guardian, give consent for my child to participate in TaeTae Foundation programmes, including skills acquisition, sports development, education, mentorship, workshops, and supervised activities.",
  },
  {
    heading: "Medical & Emergency Authorisation",
    body:
      "I confirm that all known medical conditions have been disclosed. In the event of an emergency, I authorise TaeTae Foundation and its representatives to administer basic first aid and seek appropriate medical treatment where necessary.",
  },
  {
    heading: "Media & Image Consent",
    body:
      "I understand that approved photographs, videos, and audio recordings may be used responsibly for programme documentation, sponsor reporting, educational storytelling, and Foundation communications.",
  },
  {
    heading: "Data Protection & Privacy",
    body:
      "I acknowledge that TaeTae Foundation will process personal data in line with NDPR requirements and internal safeguarding protocols, with access limited to authorised personnel and approved programme purposes.",
  },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Required: "bg-rose-50 text-rose-700 border-rose-200",
    Optional: "bg-slate-100 text-slate-700 border-slate-200",
    Signed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${map[status] || map.Optional}`}>
      {status}
    </span>
  );
}

function SectionHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="mb-6">
      <div className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-700">{eyebrow}</div>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{title}</h2>
      {body ? <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{body}</p> : null}
    </div>
  );
}

function DesktopMockup() {
  const [selectedTab, setSelectedTab] = useState("All Documents");

  const filtered = useMemo(() => {
    if (selectedTab === "All Documents") return documents;
    return documents.filter((doc) => doc.audience === selectedTab || (selectedTab === "Partners" && doc.audience === "Partners"));
  }, [selectedTab]);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Desktop Portal Mockup</div>
          <h3 className="mt-1 text-2xl font-black text-slate-950">Legal Forms & Agreements Workspace</h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600">
          <Monitor className="h-4 w-4" /> Next.js Portal View
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
        <aside className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" /> Search documents
          </div>
          <div className="mt-4 space-y-2">
            {["All Documents", "Parents & Participants", "Coaches & Volunteers", "Mentors", "Data & Privacy"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium transition ${
                  selectedTab === tab
                    ? "bg-emerald-600 text-white shadow"
                    : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>{tab}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-3xl bg-slate-900 p-4 text-white">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Document Status</div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between"><span>Completed</span><span className="font-bold">42</span></div>
              <div className="flex items-center justify-between"><span>Pending</span><span className="font-bold">14</span></div>
              <div className="flex items-center justify-between"><span>Missing</span><span className="font-bold">7</span></div>
            </div>
          </div>
        </aside>

        <main className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Forms Library</div>
              <div className="mt-1 text-xl font-black text-slate-950">Available forms, templates, and declarations</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                <Filter className="h-4 w-4" /> Filter
              </button>
              <button className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">
                <FolderOpen className="h-4 w-4" /> Open Portal
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((doc) => (
              <motion.div
                key={doc.id}
                whileHover={{ y: -2 }}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-slate-950">{doc.title}</h4>
                      <StatusBadge status={doc.status} />
                      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">{doc.type}</span>
                    </div>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{doc.description}</p>
                    <div className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{doc.audience}</div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                      <Download className="h-4 w-4" /> Download
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                      <PenSquare className="h-4 w-4" /> Sign Online
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
                      <Upload className="h-4 w-4" /> Upload
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>

        <aside className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Form Preview</div>
              <div className="mt-1 text-lg font-black text-slate-950">Parental / Guardian Consent</div>
            </div>
            <button className="rounded-2xl border border-slate-200 bg-white p-2 text-slate-600">
              <Eye className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
            <div className="space-y-4">
              {legalBody.map((section) => (
                <div key={section.heading}>
                  <h5 className="text-sm font-bold text-slate-900">{section.heading}</h5>
                  <p className="mt-1 text-xs leading-6 text-slate-600">{section.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="rounded-[1.25rem] border border-slate-200 bg-white p-3">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Signature Status</div>
              <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-amber-700"><Clock3 className="h-4 w-4" /> Awaiting parent signature</div>
            </div>
            <div className="rounded-[1.25rem] border border-slate-200 bg-white p-3">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Verification</div>
              <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> ID and address fields completed</div>
            </div>
            <div className="rounded-[1.25rem] border border-slate-200 bg-white p-3">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Missing Requirement</div>
              <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-rose-700"><AlertCircle className="h-4 w-4" /> Child photo upload pending</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function MobileMockup() {
  return (
    <div className="mx-auto max-w-sm rounded-[2.5rem] border-8 border-slate-900 bg-slate-900 p-2 shadow-2xl">
      <div className="overflow-hidden rounded-[2rem] bg-slate-50">
        <div className="bg-white px-4 pb-4 pt-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700">Mobile Mockup</div>
              <div className="text-lg font-black text-slate-950">Digital Legal Form</div>
            </div>
            <div className="rounded-full bg-emerald-50 p-2 text-emerald-700">
              <Smartphone className="h-4 w-4" />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-sm font-bold text-slate-950">Parental / Guardian Consent</div>
            <div className="mt-1 text-xs leading-5 text-slate-600">
              Read the full legal text, complete the required fields, sign digitally, and upload or capture a participant image directly from your phone.
            </div>
          </div>
        </div>

        <div className="space-y-3 px-4 pb-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Legal Body</div>
            <div className="space-y-3 text-xs leading-6 text-slate-600">
              <p>
                I give consent for my child to participate in TaeTae Foundation programmes, including skills acquisition, sports development, education, mentorship, and supervised activities.
              </p>
              <p>
                I understand that medical, media, and data privacy provisions form part of this agreement and that information will be handled in line with safeguarding and NDPR standards.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Required Fields</div>
            <div className="grid gap-3">
              {[
                { icon: User, label: "Parent / Guardian Full Name" },
                { icon: Home, label: "Residential Address" },
                { icon: Phone, label: "Phone Number" },
                { icon: Mail, label: "Email Address" },
                { icon: Calendar, label: "Child Date of Birth" },
              ].map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.label} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500">
                    <Icon className="h-4 w-4" /> {field.label}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Signature & Capture</div>
            <div className="grid gap-3">
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                <PenSquare className="h-4 w-4" /> Sign on Screen
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                <Upload className="h-4 w-4" /> Upload Signed File
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">
                <Camera className="h-4 w-4" /> Capture Participant Photo
              </button>
            </div>
          </div>

          <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm">
            Review and Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TaetaeLegalComplianceUI() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden border-b bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                Next.js Legal & Compliance Platform
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-slate-950 lg:text-6xl">
                Digitised legal forms built for visibility, signatures, uploads, and audit-ready records.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                This UI mockup is designed for TaeTae Foundation’s digital legal workflow, where users can read the full legal body online, complete participant information, sign directly on-screen, and upload or capture supporting images from desktop or mobile.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { title: "Readable Legal Body", value: "On-page" },
                  { title: "Digital Signature", value: "Enabled" },
                  { title: "Image Upload / Capture", value: "Built in" },
                  { title: "Audit Trail", value: "Tracked" },
                ].map((item) => (
                  <div key={item.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="text-2xl font-black text-slate-950">{item.value}</div>
                    <div className="mt-1 text-sm text-slate-600">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {categories.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-xl font-black text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                    <div className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {item.count} active documents
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <SectionHeader
          eyebrow="UI Mockups"
          title="Desktop workspace and mobile form journey"
          body="The desktop version supports legal operations, review, and document management at scale, while the mobile version makes it easy for parents, participants, mentors, and volunteers to read, sign, and upload documents from any device."
        />
        <div className="grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">
          <DesktopMockup />
          <div className="flex items-start justify-center xl:justify-end">
            <MobileMockup />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <SectionHeader
          eyebrow="Form Experience"
          title="How each legal document works on the platform"
          body="Every digital form follows a consistent flow so that the legal text remains visible, the required information is captured properly, and the signature and upload process is simple and traceable."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: FileText,
              title: "1. Read the legal text",
              body: "The full body of the document is displayed on-page so users can read the agreement before completing any action.",
            },
            {
              icon: Users,
              title: "2. Complete participant details",
              body: "Structured fields capture names, addresses, dates of birth, contact details, guardian information, and role-based data.",
            },
            {
              icon: PenSquare,
              title: "3. Sign digitally",
              body: "Users can sign directly on-screen using a mouse, trackpad, or touch screen, with timestamped form completion records.",
            },
            {
              icon: Camera,
              title: "4. Upload or capture image",
              body: "Supporting files can be uploaded from device storage or captured instantly using the device camera for compliance verification.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
