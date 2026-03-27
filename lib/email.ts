// lib/email.ts
import nodemailer from "nodemailer"


// export async function sendEmail(to: string, subject: string, html: string) {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: true,
//       auth: {
//         user: 'softwaredeveloper@wdwltd.com',
//         pass: 'ntncafaxqcaysdap',
//       },
//     });

//     await transporter.sendMail({
//       from: `"TaeTae Foundation" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     })

//     console.log(`📨 Email sent to ${to}`)
//   } catch (error) {
//     console.error("❌ Error sending email:", error)
//     throw error
//   }
// }

import { Resend } from 'resend';

const resend = new Resend("re_J5PSdujc_FhEX7D6U41v1zH1Dhns8RFkV");

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Taetae Foundation <info@taetaefoundation.org>', 
      // change to your domain after verification
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      throw error;
    }

    console.log(`📨 Email sent to ${to}`, data);
    return data;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}

// Email template wrapper
const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8bc97f 0%, #22c55e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
    .info-box { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8bc97f; }
    .info-box h3 { margin-top: 0; color: #8bc97f; }
    .info-box p { margin: 8px 0; }
    .button { display: inline-block; background: #8bc97f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
    .highlight { color: #8bc97f; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #ffffff;">💚 TaeTae Foundation</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">Empowering Boys Through Skills, Education & Sports</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>TaeTae Foundation</strong></p>
      <p>Lagos, Nigeria | Email: info@taetaefoundation.org</p>
      <p>© ${new Date().getFullYear()} TaeTae Foundation. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`

// ============================================
// BOY ENROLLMENT EMAILS
// ============================================

export async function sendBoyEnrollmentEmail(boy: any, guardianEmail?: string, pasword?: string) {
  const content = `
    <h2 style="color: #ffffff;">🎉 Welcome to TaeTae Foundation!</h2>
    <p>Dear <strong>${boy.guardian_name}</strong>,</p>
    <p>We are thrilled to inform you that <strong>${boy.first_name} ${boy.last_name}</strong> has been successfully enrolled in our program!</p>
    
    <div class="info-box">
      <h3>Enrollment Details</h3>
      <p><strong>Student ID:</strong> ${boy.id}</p>
      <p><strong>Name:</strong> ${boy.first_name} ${boy.last_name}</p>
      <p><strong>Program Track:</strong> ${boy.program_track.charAt(0).toUpperCase() + boy.program_track.slice(1)}</p>
      <p><strong>Age:</strong> ${boy.age_at_enrolment} years</p>
      <p><strong>Start Date:</strong> ${new Date(boy.program_start_date).toLocaleDateString()}</p>
      <p><strong>School:</strong> ${boy.school_name}</p>
      <p><strong>Class Level:</strong> ${boy.class_level}</p>
      <p><strong>LOGIN DETAILS:</strong>
      <p><strong>Email:</strong> ${guardianEmail}</p>
      <p><strong>Password:</strong> ${pasword}</p>
    </div>

    <h3>What's Next?</h3>
    <ul>
      <li>📋 Initial assessment will be conducted within the first week</li>
      <li>🎯 Training sessions begin immediately</li>
      <li>📊 Regular progress reports will be sent monthly</li>
      <li>📱 You'll receive updates via email and SMS</li>
    </ul>

    <h3>Important Reminders</h3>
    <ul>
      <li>Training sessions: Mondays, Wednesdays, Fridays (4:00 PM - 6:00 PM)</li>
      <li>Please ensure ${boy.first_name} arrives 15 minutes early</li>
      <li>Required items: Sports wear, water bottle, and enthusiasm!</li>
    </ul>

    <p>We're excited to begin this journey with ${boy.first_name}! 🌟</p>
    
    <p style="margin-top: 30px;">If you have any questions, please don't hesitate to reach out.</p>
    <p>Warm regards,<br><strong>The TaeTae Foundation Team</strong></p>
  `

  const emails = [guardianEmail, process.env.ADMIN_EMAIL].filter(Boolean)
  
  for (const email of emails) {
    await sendEmail(
      email as string,
      `🎉 ${boy.first_name} ${boy.last_name} Enrolled in TaeTae Foundation`,
      emailTemplate(content)
    )
  }
}

export async function sendReminderEmail(donation:any){

  const link = `${process.env.NEXT_PUBLIC_SITE_URL}/reminder-donation/${donation.reminderToken}`

  await sendEmail(
    donation.email,
    "Upcoming Donation Reminder ❤️",
    `
      <h2>Hello ${donation.name}</h2>

      <p>Your ${donation.duration} donation is coming soon.</p>

      <p><b>Program:</b> ${donation.program}</p>
      <p><b>Amount:</b> ${donation.currency} ${donation.amount}</p>

      <br/>

      <a href="${link}"
      style="padding:12px 20px;background:#22c55e;color:white;border-radius:6px;text-decoration:none;">
      Donate Now
      </a>
    `
  )
}

export async function sendSponsorshipEmail(sponsorship: any, sponsorEmail?: string) {
  const content = `
    <h2style="color: #ffffff;">🎉 Welcome to TaeTae Foundation!</h2>
    <p>Dear <strong>$${sponsorship.sponsorName}</strong>,</p>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #8bc97f;">TaeTae Foundation 💚</h2>
    <p>Dear ${sponsorship.sponsorName},</p>
    <p>Thank you for choosing to sponsor a young boy through the TaeTae Foundation!</p>
    
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Sponsorship Details</h3>
      <p><strong>Sponsorship ID:</strong> ${sponsorship.id}</p>
      <p><strong>Amount:</strong> 
        ${sponsorship?.currency ?? 'USD'} 
        ${(sponsorship?.amount ?? 0).toLocaleString()}
      </p>
    </div>

    <p>You're making a lasting difference! 🌟</p>
    <p>Warm regards,<br>The TaeTae Foundation Team</p>
  </div>
  `

  const emails = [sponsorEmail, process.env.ADMIN_EMAIL].filter(Boolean)
  
  for (const email of emails) {
    await sendEmail(
      email as string,
      `🎉 $${sponsorship.sponsorName} Became a Sponsor in TaeTae Foundation`,
      emailTemplate(content)
    )
  }
}

// Admin notification for new enrollment
export async function sendAdminBoyEnrollmentNotification(boy: any) {
  const content = `
    <h2>📝 New Boy Enrolled</h2>
    <p>A new boy has been enrolled in the TaeTae Foundation program.</p>
    
    <div class="info-box">
      <h3>Student Information</h3>
      <p><strong>Student ID:</strong> ${boy.id}</p>
      <p><strong>Name:</strong> ${boy.first_name} ${boy.last_name}</p>
      <p><strong>Age:</strong> ${boy.age_at_enrolment} years</p>
      <p><strong>Program Track:</strong> ${boy.program_track}</p>
      <p><strong>Guardian:</strong> ${boy.guardian_name}</p>
      <p><strong>Guardian Phone:</strong> ${boy.guardian_phone}</p>
      <p><strong>School:</strong> ${boy.school_name} (${boy.class_level})</p>
      <p><strong>Location:</strong> ${boy.address_city}, ${boy.address_country}</p>
      <p><strong>Emergency Contact:</strong> ${boy.emergency_contact}</p>
      <p><strong>Consent Form:</strong> ${boy.consent_form_signed ? '✅ Signed' : '❌ Not Signed'}</p>
    </div>

    <h3>Required Actions</h3>
    <ul>
      <li>Schedule initial assessment</li>
      <li>Assign mentor/coach</li>
      <li>Prepare welcome package</li>
      <li>Add to training schedule</li>
    </ul>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/boys/${boy.id}" class="button">View Profile</a>
  `

  await sendEmail(
    process.env.ADMIN_EMAIL!,
    `📝 New Enrollment: ${boy.first_name} ${boy.last_name}`,
    emailTemplate(content)
  )
}


// ============================================
// ASSESSMENT EMAILS
// ============================================

export async function sendPhysicalAssessmentEmail(boy: any, assessment: any, guardianEmail?: string) {
  const content = `
    <h2>📊 Physical Assessment Report</h2>
    <p>Dear <strong>${boy.guardian_name}</strong>,</p>
    <p>We've completed a physical assessment for <strong>${boy.first_name}</strong>. Here are the results:</p>
    
    <div class="info-box">
      <h3>Assessment Results - ${new Date(assessment.assessment_date).toLocaleDateString()}</h3>
      <p><strong>Height:</strong> ${assessment.height_cm} cm</p>
      <p><strong>Weight:</strong> ${assessment.weight_kg} kg</p>
      <p><strong>BMI:</strong> ${assessment.bmi}</p>
      <p><strong>Resting Heart Rate:</strong> ${assessment.resting_heart_rate} bpm</p>
      <p><strong>Push-ups:</strong> ${assessment.pushups_count}</p>
      <p><strong>Sit-ups:</strong> ${assessment.situps_count}</p>
      <p><strong>Shuttle Run Time:</strong> ${assessment.shuttle_run_time} seconds</p>
    </div>

    <div class="info-box">
      <h3>Coach's Comment</h3>
      <p>${assessment.coach_comment}</p>
      <p><em>Assessed by: ${assessment.assessed_by}</em></p>
    </div>

    <h3>What This Means</h3>
    <p>${boy.first_name} is showing ${assessment.pushups_count > 20 ? 'excellent' : 'good'} physical development. We'll continue to monitor progress and provide targeted training.</p>

    <p style="margin-top: 30px;">Keep encouraging ${boy.first_name} to stay active!</p>
    <p>Best regards,<br><strong>The TaeTae Foundation Team</strong></p>
  `

  if (guardianEmail) {
    await sendEmail(
      guardianEmail,
      `📊 Physical Assessment Report for ${boy.first_name}`,
      emailTemplate(content)
    )
  }
}

export async function sendCognitiveAssessmentEmail(boy: any, assessment: any, guardianEmail?: string) {
  const content = `
    <h2>🧠 Cognitive Assessment Report</h2>
    <p>Dear <strong>${boy.guardian_name}</strong>,</p>
    <p>We've completed a cognitive assessment for <strong>${boy.first_name}</strong>. Here are the results:</p>
    
    <div class="info-box">
      <h3>Assessment Results - ${new Date(assessment.assessment_date).toLocaleDateString()}</h3>
      <p><strong>Reading Level:</strong> ${assessment.reading_level}</p>
      <p><strong>Numeracy Level:</strong> ${assessment.numeracy_level}</p>
      <p><strong>Attention & Focus:</strong> ${assessment.attention_focus_score}/10</p>
      <p><strong>Memory Score:</strong> ${assessment.memory_score}/10</p>
      <p><strong>Problem Solving:</strong> ${assessment.problem_solving_score}/10</p>
      <p><strong>School Exam Average:</strong> ${assessment.school_exam_average}%</p>
    </div>

    <div class="info-box">
      <h3>Teacher's Comment</h3>
      <p>${assessment.teacher_comment}</p>
      <p><em>Assessed by: ${assessment.assessed_by}</em></p>
    </div>

    <h3>Recommendations</h3>
    <ul>
      <li>Continue encouraging reading at home</li>
      <li>Practice math problems together</li>
      <li>Limit screen time to improve focus</li>
      <li>Ensure adequate sleep for memory retention</li>
    </ul>

    <p style="margin-top: 30px;">${boy.first_name} is making great progress!</p>
    <p>Best regards,<br><strong>The TaeTae Foundation Team</strong></p>
  `

  if (guardianEmail) {
    await sendEmail(
      guardianEmail,
      `🧠 Cognitive Assessment Report for ${boy.first_name}`,
      emailTemplate(content)
    )
  }
}


// ============================================
// SESSION ATTENDANCE EMAILS
// ============================================

export async function sendSessionAttendanceAlert(boy: any, session: any, guardianEmail?: string) {
  const isAbsent = session.attendance_status === 'absent'
  
  const content = `
    <h2>${isAbsent ? '⚠️ Absence Alert' : '✅ Session Completed'}</h2>
    <p>Dear <strong>${boy.guardian_name}</strong>,</p>
    <p>${isAbsent 
      ? `We noticed that <strong>${boy.first_name}</strong> was absent from today's training session.`
      : `<strong>${boy.first_name}</strong> attended today's training session.`
    }</p>
    
    <div class="info-box">
      <h3>Session Details</h3>
      <p><strong>Date:</strong> ${new Date(session.session_date).toLocaleDateString()}</p>
      <p><strong>Topic:</strong> ${session.topic}</p>
      <p><strong>Duration:</strong> ${session.hours} hours</p>
      <p><strong>Status:</strong> ${session.attendance_status}</p>
      ${!isAbsent ? `<p><strong>Performance Rating:</strong> ${session.performance_rating}/10</p>` : ''}
      ${session.conducted_by ? `<p><strong>Conducted by:</strong> ${session.conducted_by}</p>` : ''}
    </div>

    ${!isAbsent && session.mentor_comment ? `
    <div class="info-box">
      <h3>Mentor's Feedback</h3>
      <p>${session.mentor_comment}</p>
    </div>
    ` : ''}

    ${isAbsent ? `
    <h3>Important Reminder</h3>
    <p>Regular attendance is crucial for ${boy.first_name}'s development. If there was an emergency, please let us know.</p>
    <p>For continued absences, please contact us at <a href="tel:${process.env.CONTACT_PHONE}">${process.env.CONTACT_PHONE}</a></p>
    ` : `
    <p>Great job, ${boy.first_name}! Keep up the excellent work! 🌟</p>
    `}

    <p style="margin-top: 30px;">Warm regards,<br><strong>The TaeTae Foundation Team</strong></p>
  `

  if (guardianEmail) {
    await sendEmail(
      guardianEmail,
      isAbsent 
        ? `⚠️ ${boy.first_name} Absent from Training Session`
        : `✅ ${boy.first_name} Attended Training Session`,
      emailTemplate(content)
    )
  }
}


// ============================================
// MILESTONE & ACHIEVEMENT EMAILS
// ============================================

export async function sendMilestoneEmail(boy: any, milestone: string, details: string, guardianEmail?: string) {
  const content = `
    <h2>🏆 Milestone Achievement!</h2>
    <p>Dear <strong>${boy.guardian_name}</strong>,</p>
    <p>We're thrilled to share that <strong>${boy.first_name}</strong> has achieved an important milestone!</p>
    
    <div class="info-box" style="border-left-color: #10b981;">
      <h3 style="color: #10b981;">🎉 ${milestone}</h3>
      <p>${details}</p>
    </div>

    <h3>Keep It Up!</h3>
    <p>${boy.first_name} is showing exceptional dedication and improvement. This achievement is a testament to hard work and commitment!</p>

    <p>We're proud to have ${boy.first_name} in our program! 🌟</p>
    
    <p style="margin-top: 30px;">Congratulations from all of us!<br><strong>The TaeTae Foundation Team</strong></p>
  `

  if (guardianEmail) {
    await sendEmail(
      guardianEmail,
      `🏆 ${boy.first_name} Achieved a Milestone!`,
      emailTemplate(content)
    )
  }
}


// ============================================
// MONTHLY PROGRESS REPORT
// ============================================

export async function sendMonthlyProgressReport(
  boy: any, 
  stats: {
    sessionsAttended: number
    totalSessions: number
    averagePerformance: number
    improvements: string[]
    areasForFocus: string[]
  },
  guardianEmail?: string
) {
  const attendanceRate = Math.round((stats.sessionsAttended / stats.totalSessions) * 100)
  
  const content = `
    <h2>📊 Monthly Progress Report</h2>
    <p>Dear <strong>${boy.guardian_name}</strong>,</p>
    <p>Here's <strong>${boy.first_name}'s</strong> progress report for ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}:</p>
    
    <div class="info-box">
      <h3>Attendance & Performance</h3>
      <p><strong>Sessions Attended:</strong> ${stats.sessionsAttended} out of ${stats.totalSessions}</p>
      <p><strong>Attendance Rate:</strong> <span class="highlight">${attendanceRate}%</span></p>
      <p><strong>Average Performance:</strong> ${stats.averagePerformance}/10</p>
    </div>

    <div class="info-box" style="border-left-color: #10b981;">
      <h3 style="color: #10b981;">✅ Areas of Improvement</h3>
      <ul>
        ${stats.improvements.map(imp => `<li>${imp}</li>`).join('')}
      </ul>
    </div>

    <div class="info-box" style="border-left-color: #f59e0b;">
      <h3 style="color: #f59e0b;">🎯 Areas for Focus</h3>
      <ul>
        ${stats.areasForFocus.map(area => `<li>${area}</li>`).join('')}
      </ul>
    </div>

    <h3>Overall Assessment</h3>
    <p>${boy.first_name} is ${attendanceRate >= 90 ? 'consistently showing up and making excellent progress' : attendanceRate >= 75 ? 'making good progress with room for improvement' : 'showing potential but needs more consistent attendance'}.</p>

    <p style="margin-top: 30px;">Thank you for your continued support!<br><strong>The TaeTae Foundation Team</strong></p>
  `

  if (guardianEmail) {
    await sendEmail(
      guardianEmail,
      `📊 ${boy.first_name}'s Monthly Progress Report`,
      emailTemplate(content)
    )
  }
}


// ============================================
// SPONSORSHIP EMAILS
// ============================================

export async function sendSponsorMatchEmail(sponsor: any, boy: any) {
  const content = `
    <h2>🤝 Sponsorship Match Confirmed!</h2>
    <p>Dear <strong>${sponsor.sponsorName}</strong>,</p>
    <p>Thank you for your incredible generosity! We're excited to inform you that you've been matched with a wonderful young boy.</p>
    
    <div class="info-box">
      <h3>Your Sponsored Boy</h3>
      <p><strong>Name:</strong> ${boy.first_name} ${boy.last_name.charAt(0)}.</p>
      <p><strong>Age:</strong> ${boy.age_at_enrolment} years old</p>
      <p><strong>Program Track:</strong> ${boy.program_track}</p>
      <p><strong>School:</strong> ${boy.school_name}</p>
      <p><strong>Location:</strong> ${boy.address_city}, ${boy.address_country}</p>
    </div>

    <div class="info-box">
      <h3>Your Sponsorship Details</h3>
      <p><strong>Sponsorship ID:</strong> ${sponsor.id}</p>
      <p><strong>Commitment Level:</strong> ${sponsor.commitmentLevel}</p>
      <p><strong>Amount:</strong> ${sponsor.currency} ${sponsor.amount.toLocaleString()}</p>
      <p><strong>Coverage:</strong> ${sponsor.items.join(', ')}</p>
    </div>

    <h3>What Happens Next</h3>
    <ul>
      <li>📧 You'll receive monthly progress reports</li>
      <li>📊 Access to performance assessments</li>
      <li>📸 Photo and video updates</li>
      <li>💬 Optional direct communication with mentors</li>
    </ul>

    <p>Your sponsorship is changing <strong>${boy.first_name}'s</strong> life! Thank you for making a real difference. 💚</p>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/sponsor/dashboard/${sponsor.id}" class="button">View Sponsorship Dashboard</a>

    <p style="margin-top: 30px;">With gratitude,<br><strong>The TaeTae Foundation Team</strong></p>
  `

  await sendEmail(
    sponsor.sponsorEmail,
    `🤝 You're Now Sponsoring ${boy.first_name}!`,
    emailTemplate(content)
  )
}


// ============================================
// VOLUNTEER NOTIFICATIONS
// ============================================

export async function sendVolunteerSessionUploadNotification(volunteer: any, boy: any, mediaUrl: string) {
  const content = `
    <h2>📹 New Session Video Uploaded</h2>
    <p>Thank you, <strong>${volunteer.name}</strong>, for uploading session content!</p>
    
    <div class="info-box">
      <h3>Upload Details</h3>
      <p><strong>Boy:</strong> ${boy.first_name} ${boy.last_name}</p>
      <p><strong>Uploaded by:</strong> ${volunteer.name}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    </div>

    <p>Your dedication to documenting training sessions helps us track progress and share updates with guardians and sponsors.</p>

    <a href="${mediaUrl}" class="button">View Uploaded Content</a>

    <p style="margin-top: 30px;">Keep up the great work!<br><strong>The TaeTae Foundation Team</strong></p>
  `

  await sendEmail(
    volunteer.email,
    '📹 Session Video Upload Confirmed',
    emailTemplate(content)
  )

  // Notify admin
  if (process.env.ADMIN_EMAIL) {
    await sendEmail(
      process.env.ADMIN_EMAIL,
      `📹 New Session Video: ${boy.first_name} by ${volunteer.name}`,
      emailTemplate(`<p>New session video uploaded by ${volunteer.name} for ${boy.first_name}.</p><a href="${mediaUrl}">View Video</a>`)
    )
  }
}


// ============================================
// ADMIN ALERTS
// ============================================

export async function sendAdminLowAttendanceAlert(boy: any, attendanceRate: number) {
  const content = `
    <h2>⚠️ Low Attendance Alert</h2>
    <p><strong>${boy.first_name} ${boy.last_name}</strong> has an attendance rate of only <span class="highlight">${attendanceRate}%</span> this month.</p>
    
    <div class="info-box" style="border-left-color: #ef4444;">
      <h3>Student Information</h3>
      <p><strong>Student ID:</strong> ${boy.id}</p>
      <p><strong>Guardian:</strong> ${boy.guardian_name}</p>
      <p><strong>Guardian Phone:</strong> ${boy.guardian_phone}</p>
      <p><strong>Attendance Rate:</strong> ${attendanceRate}%</p>
    </div>

    <h3>Recommended Actions</h3>
    <ul>
      <li>Contact guardian to understand situation</li>
      <li>Offer flexible scheduling if needed</li>
      <li>Check if boy faces any challenges</li>
      <li>Consider home visit if necessary</li>
    </ul>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/boys/${boy.id}" class="button">View Profile</a>
  `

  await sendEmail(
    process.env.ADMIN_EMAIL!,
    `⚠️ Low Attendance Alert: ${boy.first_name} ${boy.last_name}`,
    emailTemplate(content)
  )
}

// Function to send approval email to the volunteer
export const sendApprovalEmail = async (volunteer: any , password:any) => {
  const emailContent = `
    <p>Dear ${volunteer.name},</p>
    <p>Congratulations! Your volunteer application has been approved.</p>
    <p>Your login credentials are:</p>
    <p>Email: ${volunteer.email}</p>
    <p>Password: ${password}</p>
    <p>You can log in to your account at any time. Please change your password once you log in.</p>
    <p>Best regards,</p>
    <p>The TaeTae Foundation Team</p>
  `;
  
  await sendEmail(volunteer.email, "Volunteer Application Approved", emailContent);
};

export async function sendResetEmail(to: string, otp: string) {
  const html = `
    <h2>Password Reset Code</h2>
    <p>Your OTP code is:</p>
    <p style="font-size: 24px; font-weight: bold;">${otp}</p>
    <p>This code will expire in 5 minutes.</p>
  `
  await sendEmail(to, "Your Password Reset Code", html)
}

// Function to generate a random password (you can enhance this for production)
const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8); // Simple random password generation
};



// ============================================
// DONATION RECEIPT EMAIL
// ============================================

export async function sendDonationReceipt(donation: any) {
  const content = `
    <h2>🙏 Thank You for Your Generous Donation!</h2>
    <p>Dear <strong>${donation.name}</strong>,</p>
    <p>Your contribution of <span class="highlight">${donation.currency} ${donation.amount.toLocaleString()}</span> has been received. Thank you for supporting the <strong>${donation.program}</strong> program!</p>
    
    <div class="info-box">
      <h3>Donation Receipt</h3>
      <p><strong>Receipt ID:</strong> ${donation.id}</p>
      <p><strong>Date:</strong> ${new Date(donation.createdAt).toLocaleDateString()}</p>
      <p><strong>Amount:</strong> ${donation.currency} ${donation.amount.toLocaleString()}</p>
      <p><strong>Program:</strong> ${donation.program.charAt(0).toUpperCase() + donation.program.slice(1)}</p>
      <p><strong>Payment Method:</strong> ${donation.paymentMethod}</p>
      ${donation.transactionId ? `<p><strong>Transaction ID:</strong> ${donation.transactionId}</p>` : ''}
    </div>

    ${donation.message ? `
    <div class="info-box">
      <h3>Your Message</h3>
      <p><em>"${donation.message}"</em></p>
    </div>
    ` : ''}

    <h3>Impact of Your Donation</h3>
    <p>Your ${donation.currency} ${donation.amount.toLocaleString()} donation will help:</p>
    <ul>
      ${donation.program === 'skills' ? `
        <li>Provide vocational training materials</li>
        <li>Fund mentor stipends</li>
        <li>Support skill certification programs</li>
      ` : donation.program === 'education' ? `
        <li>Purchase school supplies and textbooks</li>
        <li>Pay school fees for underprivileged boys</li>
        <li>Provide tutoring and academic support</li>
      ` : `
        <li>Buy sports equipment and kits</li>
        <li>Fund training sessions and coaching</li>
        <li>Support tournament participation</li>
      `}
    </ul>

    <p>You're making a real difference in young boys' lives! 🌟</p>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/impact" class="button">See Your Impact</a>

    <p style="margin-top: 30px;"><em>This email serves as your official donation receipt. Please keep it for your records.</em></p>
    <p>With heartfelt gratitude,<br><strong>The TaeTae Foundation Team</strong></p>
  `

  if (donation.email && donation.donationMode !== 'anonymous') {
    await sendEmail(
      donation.email,
      `🙏 Donation Receipt - ${donation.currency} ${donation.amount.toLocaleString()}`,
      emailTemplate(content)
    )
  }
}
