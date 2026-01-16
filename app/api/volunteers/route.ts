import { type NextRequest, NextResponse } from "next/server"
import { addRecord, emailExists, getRecords } from "@/lib/db"
import { sendEmail } from "@/lib/email"
import { uploadToCloudinary } from "@/lib/cloudinary"  // Import Cloudinary upload function

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.name || !data.email || !data.phone || !data.category || !data.availability) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const exists = await emailExists(data.email);

    if (exists) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    /* ---------- PROFILE IMAGE ---------- */
    let profilePhotoUrl = data.profile_photo_url

    if (data.profile_photo_base64) {
      const result = await uploadToCloudinary(data.profile_photo_base64, {
        folder: `taetae/volunteers/${data.email}`,
        tags: ["profile", "volunteer"],
      })
      profilePhotoUrl = result.secure_url
    }

    /* ---------- SAVE VOLUNTEER ---------- */
    const volunteer = await addRecord("volunteers", {
      ...data,
      status: "pending",
      profile_photo_base64: null,
      profile_photo_url: profilePhotoUrl,
      joinedDate: new Date().toISOString(),
    })

    console.log("🙌 Volunteer registered:", volunteer)

    /* ---------- EMAILS (NON-BLOCKING) ---------- */
    try {
      if (data.email) {
        await sendEmail(
          data.email,
            "🌟 Welcome to TaeTae Foundation Volunteer Team!",
          `
          <div style="font-family: Arial, sans-serif; background-color: #f7fafc; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
              <div style="background-color: #8bc97f; padding: 20px; text-align: center; color: white;">
                <h1 style="margin: 0;">TaeTae Foundation 💚</h1>
              </div>
              <div style="padding: 30px; color: #1f2937;">
                <h2>Hello ${data.name},</h2>
                <p>We’re so excited to have you join the <b>TaeTae Foundation</b> volunteer team!</p>
                <p>Your profile has been received and is currently under review. Here’s what we have on file:</p>
                <div style="margin: 20px 0; padding: 15px; background: #f1f5f9; border-radius: 8px;">
                  <p><b>Category:</b> ${data.category}</p>
                  <p><b>Availability:</b> ${data.availability}</p>
                  <p><b>Location:</b> ${data.location}</p>
                </div>
                <p>We’ll contact you shortly once your application has been approved. Thank you for offering your time and heart to help others 💫.</p>
                <p style="margin-top: 20px;">Warm regards,</p>
                <p><b>The TaeTae Foundation Team</b></p>
              </div>
              <div style="background-color: #f1f5f9; text-align: center; padding: 15px; font-size: 13px; color: #6b7280;">
                © ${new Date().getFullYear()} TaeTae Foundation — Together, we make a difference.
              </div>
            </div>
          </div>
          `
            )
      }
    } catch (err) {
      console.error("❌ Failed to send volunteer email:", err)
    }
    try {
      if (process.env.ADMIN_EMAIL) {
        await sendEmail(
          process.env.ADMIN_EMAIL,
          "📬 New Volunteer Application Received",
        `
          <div style="font-family: Arial, sans-serif; background-color: #f7fafc; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
              <div style="background-color: #8bc97f; padding: 20px; text-align: center; color: white;">
                <h1 style="margin: 0;">New Volunteer Registration</h1>
              </div>
              <div style="padding: 30px; color: #1f2937;">
                <p><b>${data.name}</b> has applied to volunteer with TaeTae Foundation.</p>
                <div style="margin: 20px 0; padding: 15px; background: #f1f5f9; border-radius: 8px;">
                  <p><b>Email:</b> ${data.email}</p>
                  <p><b>Phone:</b> ${data.phone}</p>
                  <p><b>Category:</b> ${data.category}</p>
                  <p><b>Availability:</b> ${data.availability}</p>
                  <p><b>Location:</b> ${data.location}</p>
                  <p><b>Occupation:</b> ${data.occupation || "—"}</p>
                  <p><b>Bio:</b> ${data.bio || "—"}</p>
                </div>
                <p>View this application on your admin dashboard for review.</p>
                <a href="https://taetaefoundation.org/admin/volunteers"
                  style="display:inline-block;background-color:#8bc97f;color:white;padding:10px 18px;border-radius:8px;text-decoration:none;margin-top:10px;">
                  Open Dashboard
                </a>
              </div>
              <div style="background-color: #f1f5f9; text-align: center; padding: 15px; font-size: 13px; color: #6b7280;">
                Automated message from TaeTae Foundation Volunteer Portal
              </div>
            </div>
          </div>
          `
        )
      }
    } catch (err) {
      console.error("❌ Failed to send admin email:", err)
    }

    /* ---------- SUCCESS ---------- */
    return NextResponse.json({ success: true, volunteer })

  } catch (error) {
    console.error("❌ Volunteer error:", error)
    return NextResponse.json(
      { error: "Failed to process volunteer application" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const volunteers = await getRecords("volunteers")
    return NextResponse.json({ volunteers, count: volunteers.length })
  } catch (error) {
    console.error("Error fetching volunteers:", error)
    return NextResponse.json({ error: "Failed to fetch volunteers" }, { status: 500 })
  }
}
