import { type NextRequest, NextResponse } from "next/server";
import { addRecord, getRecords } from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { sendBoyEnrollmentEmail, sendAdminBoyEnrollmentNotification } from "@/lib/email";
import { toast } from 'react-toastify';  // Import the toast notification
import { createUser } from "@/lib/auth";
import { getCollection } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.first_name || !data.last_name || !data.date_of_birth || !data.program_track || !data.guardian_name || !data.guardian_signature) {
      return NextResponse.json({ error: "Missing required fields or signature" }, { status: 400 });
    }

    // Calculate the age at enrollment
    const birthDate = new Date(data.date_of_birth);
    const today = new Date();
    const ageAtEnrolment = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    // Generate a unique boyId
    const boyId = `BOY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const assignedVolunteerId =
      typeof data.assignedVolunteerId === "string" && data.assignedVolunteerId.trim()
        ? data.assignedVolunteerId.trim()
        : undefined

    // Handle profile photo upload if present
    let profilePhotoUrl = data.profile_photo_url;
    if (data.profile_photo_base64) {
      const result = await uploadToCloudinary(data.profile_photo_base64, {
        folder: `taetae/profiles/${boyId}`,
        tags: ['profile', boyId, 'admin'],
      });
      profilePhotoUrl = result.secure_url;
    }

    // Handle guardian signature upload if present
    let guardianSignatureUrl = "";
    if (data.guardian_signature) {
      const result = await uploadToCloudinary(data.guardian_signature, {
        folder: `taetae/signatures/${boyId}`,
        tags: ['signature', boyId, 'admin'],
      });
      guardianSignatureUrl = result.secure_url;
    }

    // ✅ CREATE BOY — DO NOT HASH HERE
    const boyDetails = await createUser(
      data.guardian_email,
      data.password,     // ⚠️ plain password
      "boy" ,      // role
      `${data.first_name} ${data.last_name}`,          // name
      data.phone,         // phone
      undefined,         // volunteerId
      boyId
    )

    // Add boy record to database
    const boy = await addRecord("boys", {
      id: boyId,
      first_name: data.first_name,
      last_name: data.last_name,
      date_of_birth: data.date_of_birth,
      age_at_enrolment: ageAtEnrolment,
      program_start_date: data.program_start_date || new Date().toISOString(),
      program_track: data.program_track,
      school_name: data.school_name,
      class_level: data.class_level,
      guardian_name: data.guardian_name,
      guardian_phone: data.guardian_phone,
      guardian_email: data.guardian_email,
      sponsor_name: data.sponsor_name,
      address_city: data.address_city,
      background: data.background,
      goals: data.goals,
      address_country: data.address_country,
      emergency_contact: data.emergency_contact,
      status: data.status || "active",
      consent_form_signed: true, // Consent is implied by signature
      profile_photo_url: profilePhotoUrl,
      guardian_signature_url: guardianSignatureUrl, // Save signature URL
      assignedVolunteerId,
      volunteerId: assignedVolunteerId,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (assignedVolunteerId) {
      const volunteers = await getCollection("volunteers")
      const assignedVolunteer = await volunteers.findOne({ id: assignedVolunteerId })

      if (assignedVolunteer) {
        const existingAssignedBoyIds = Array.isArray(assignedVolunteer.assignedBoyIds)
          ? assignedVolunteer.assignedBoyIds.filter((value: unknown) => typeof value === "string")
          : []

        const nextAssignedBoyIds = Array.from(new Set([...existingAssignedBoyIds, boyId]))

        await volunteers.updateOne(
          { id: assignedVolunteerId },
          {
            $set: {
              assignedBoyIds: nextAssignedBoyIds,
              assignedBoys: nextAssignedBoyIds.length,
              updatedAt: new Date().toISOString(),
            },
          }
        )
      }
    }

    console.log("👦 Boy enrolled:", boy);

    // Send welcome email to guardian
    
    

    if (data.guardian_email) {
      await sendBoyEnrollmentEmail(boy, data.guardian_email, data.password);
    }
    // Notify admin about new enrollment
    await sendAdminBoyEnrollmentNotification(boy);
    
      return NextResponse.json({
        success: true,
        boyId,
        boy: {
          id: boyDetails.id,
          email: boyDetails.email,
          role: boyDetails.role,
        },
      })

  } catch (error) {
    console.error("❌ Boy enrollment error:", error);

    return NextResponse.json({ error: "Failed to enroll boy" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const programTrack = searchParams.get("programTrack");
    const search = searchParams.get("search");

    let boys = await getRecords("boys");

    if (status) boys = boys.filter((b: any) => b.status === status);
    if (programTrack) boys = boys.filter((b: any) => b.program_track === programTrack);
    if (search) {
      const searchLower = search.toLowerCase();
      boys = boys.filter(
        (b: any) =>
          b.first_name.toLowerCase().includes(searchLower) ||
          b.last_name.toLowerCase().includes(searchLower) ||
          b.id.toLowerCase().includes(searchLower)
      );
    }

    boys.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ boys, count: boys.length });
  } catch (error) {
    console.error("Error fetching boys:", error);
    return NextResponse.json({ error: "Failed to fetch boys" }, { status: 500 });
  }
}
