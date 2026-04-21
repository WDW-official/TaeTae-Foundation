
import { ObjectId } from "mongodb"
import { getCollection } from "./mongodb"
import { calculateProject100Funding } from "./project100"

 interface Sponsorship {
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
  items: {
    id: string
    quantity: number
  }[]
  status: "pending" | "active" | "completed"
  createdAt: string
  updatedAt?: string
}

 interface Donation {
  _id?: string
  id: string
  name: string
  email: string | null
  program: "skills" | "education" | "sports"
  amount: number
  rateUsed?: 1500
  currency: "USD" | "NGN"
  paymentMethod: "stripe" | "paystack"
  transactionId?: string
  message?: string
  donationMode: "anonymous" | "known"
  status: "pending" | "completed" | "failed"
  createdAt: string
  updatedAt?: string
}

 interface Volunteer {
  _id?: string
  id: string
  firstName: string
  lastName: string
  name: string
  email: string
  phone: string
  profession?: string
  skills: string
  category: "professional" | "helper"
  experience?: string
  availability: string
  motivation?: string
  profile_photo_url ?: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt?: string
}

export async function emailExists(email: string) {
  const col = await getCollection("volunteers")

  const existing = await col.findOne(
    { email: email.toLowerCase() },
    { projection: { _id: 1 } }
  )

  return !!existing
}

export async function addRecord(collection: string, record: any) {
  try {
    const col = await getCollection(collection)

    // Generate a new consistent ID
    const newId = new ObjectId()

    const newRecord = {
      _id: newId,               // real ObjectId for Mongo
      id: newId.toString(),     // string version for frontend
      ...record,
      createdAt: new Date().toISOString(),
    }

    const result = await col.insertOne(newRecord)
    console.log(`✅ Record added to ${collection}:`, result.insertedId)

    return newRecord
  } catch (error) {
    console.error(`❌ Error adding record to ${collection}:`, error)
    throw error
  }
}


export async function getRecords(collection: string, filter: any = {}) {
  try {
    const col = await getCollection(collection)
    const records = await col.find(filter).toArray()
    return records
  } catch (error) {
    console.error(`Error fetching records from ${collection}:`, error)
    throw error
  }
}

export async function getRecordById(collection: string, id: string) {
  try {
    const col = await getCollection(collection)
    let query: any = { id }
    try {
      query = { $or: [{ _id: new ObjectId(id) }, { id }] }
    } catch {
      query = { id }
    }
    const record = await col.findOne(query)
    return record
  } catch (error) {
    console.error(`Error fetching record from ${collection}:`, error)
    throw error
  }
}

export async function updateRecord(collection: string, id: string, updates: any) {
  try {
    const col = await getCollection(collection)

    // ✅ Step 1: Build safe query
    const query: Record<string, any> = {
      $or: [{ _id: id }, { id }]
    }

    if (ObjectId.isValid(id)) {
      try {
        query.$or.unshift({ _id: new ObjectId(id) })
      } catch {
        console.warn("⚠️ Could not convert ID to ObjectId:", id)
      }
    }

    // ✅ Step 2: Strip immutable fields
    const { _id, id: internalId, createdAt, ...safeUpdates } = updates || {}

    // ✅ Step 3: Add updated timestamp
    const updatePayload = {
      ...safeUpdates,
      updatedAt: new Date().toISOString(),
    }

    console.log(`🛠️ Updating record in "${collection}" for ID: ${id}`)
    console.log("➡️ Payload:", JSON.stringify(updatePayload, null, 2))
    console.log("🔎 Query:", JSON.stringify(query, null, 2))

    // ✅ Step 4: Perform the update
    const updateResult = await col.updateOne(query, { $set: updatePayload })

    if (updateResult.matchedCount === 0) {
      console.warn(`⚠️ No document matched for ID: ${id}`)
      return null
    }

    console.log(`✅ Updated ${updateResult.modifiedCount} document(s)`)

    // ✅ Step 5: Fetch and return the updated document
    const updatedDoc = await col.findOne(query)

    if (!updatedDoc) {
      console.warn(`⚠️ Could not fetch updated document for ID: ${id}`)
      return null
    }

    console.log(`✅ Successfully fetched updated document for ${collection}:`, updatedDoc._id)
    return updatedDoc
  } catch (error: any) {
    console.error(`❌ Error updating record in ${collection}:`, error.message)
    throw error
  }
}

export async function updateDonationStatusToActive(donationId: string) {
  try {
    // Update the donation status in the 'donations' table
    const result = await updateRecord("donations", donationId, { status: "active" })
    if (!result) {
      throw new Error(`Failed to update donation status for donationId: ${donationId}`)
    }
    console.log(`Donation ${donationId} status updated to 'active'`)
    return result
  } catch (error) {
    console.error(`Error updating donation status for ${donationId}:`, error)
    throw error
  }
}

export async function updateSponsorshipStatusToActive(sponsorshipId: string) {
  try {
    // Update the sponsorship status in the 'sponsorships' table
    const result = await updateRecord("sponsorships", sponsorshipId, { status: "active" })
    if (!result) {
      throw new Error(`Failed to update sponsorship status for sponsorshipId: ${sponsorshipId}`)
    }
    console.log(`Sponsorship ${sponsorshipId} status updated to 'active'`)
    return result
  } catch (error) {
    console.error(`Error updating sponsorship status for ${sponsorshipId}:`, error)
    throw error
  }
}

export async function deleteRecord(collection: string, id: string) {
  try {
    const col = await getCollection(collection)

    // Build base query (same as before)
    let query: any = { id }
    try {
      query = { $or: [{ _id: new ObjectId(id) }, { id }] }
    } catch {
      query = { id }
    }

    // 🔥 SPECIAL CASE: deleting a volunteer
    if (collection === "volunteers") {
      const usersCol = await getCollection("users")

      // Delete user linked by volunteerId
      const userDeleteResult = await usersCol.deleteOne({
        volunteerId: id,
      })

      if (userDeleteResult.deletedCount > 0) {
        console.log(`User deleted for volunteerId: ${id}`)
      } else {
        console.warn(`No user found for volunteerId: ${id}`)
      }
    }

    // Delete main record
    const result = await col.deleteOne(query)

    if (result.deletedCount === 0) {
      console.warn(`No record found in ${collection} for id: ${id}`)
      return false
    }

    console.log(`Record deleted from ${collection}:`, id)
    return true
  } catch (error) {
    console.error(`Error deleting record from ${collection}:`, error)
    throw error
  }
}

export async function readData(collection: string) {
  return await getRecords(collection)
}

export async function writeData(collection: string, data: any[]) {
  try {
    const col = await getCollection(collection)
    await col.deleteMany({})
    if (data.length > 0) {
      await col.insertMany(data)
    }
  } catch (error) {
    console.error(`Error writing data to ${collection}:`, error)
    throw error
  }
}

export async function getStats() {
  try {
    const donations = await getRecords("donations")
    const volunteers = await getRecords("volunteers")
    const sponsorships = await getRecords("sponsorships")
    const boys = await getRecords("boys")

    const donationsByProgram = {
      skills: donations
        .filter((d: any) => d.program === "skills")
        .reduce((sum: number, d: any) => sum + (d.amount || 0), 0),
      education: donations
        .filter((d: any) => d.program === "education")
        .reduce((sum: number, d: any) => sum + (d.amount || 0), 0),
      sports: donations
        .filter((d: any) => d.program === "sports")
        .reduce((sum: number, d: any) => sum + (d.amount || 0), 0),
    }

    return {
      totalDonations: donations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0),
      donationCount: donations.length,
      totalVolunteers: volunteers.length,
      totalSponsors: sponsorships.length,
      totalBoys: boys.length,
      donationsByProgram,
    }
  } catch (error) {
    console.error("Error calculating stats:", error)
    throw error
  }
  
}


export async function getEnhancedStat() {
  try {
    // Fetch raw DB data
    let donations = await getRecords("donations") as unknown as Donation[]
    let volunteers = await getRecords("volunteers") as unknown as Volunteer[]
    let sponsorships = await getRecords("sponsorships") as unknown as Sponsorship[]
    const boys = await getRecords("boys")

    /* -------------------------------------------------
     * STATUS FILTERING
     * ------------------------------------------------- */

    // Only completed donations
    donations = donations.filter((d) => d.status === "completed")

    // Only active or completed sponsors
    sponsorships = sponsorships.filter(
      (s) => s.status === "active" || s.status === "completed"
    )

    // Only approved volunteers
    volunteers = volunteers.filter((v) => v.status === "approved")

    /* -------------------------------------------------
     * UTILITY: Convert to NGN using rateUsed if USD
     * ------------------------------------------------- */
    const toNaira = (amount: number, currency: "USD" | "NGN", rateUsed?: number) => {
      if (currency === "NGN") return amount
      return rateUsed ? amount * rateUsed : amount
    }

    /* -------------------------------------------------
     * DONATION SUMMARY
     * ------------------------------------------------- */
    const totalDonations = donations.reduce(
      (sum, d) => sum + toNaira(d.amount, d.currency, d.rateUsed),
      0
    )

    const donationPrograms = ["skills", "education", "sports"] as const

    const donationsByProgram: Record<string, number> = donationPrograms.reduce(
      (acc, program) => {
        acc[program] = donations
          .filter((d) => d.program === program)
          .reduce((s, d) => s + toNaira(d.amount, d.currency, d.rateUsed), 0)
        return acc
      },
      {} as Record<string, number>
    )

    /* -------------------------------------------------
     * TOP DONORS (Email-based, NGN normalized, TOP 5)
     * Each donor has ONE program
     * ------------------------------------------------- */
    const donorTotals: Record<string, number> = {}
    const donorProgram: Record<string, string> = {}

    donations.forEach((d) => {
      const email = d.email || "anonymous@unknown.com"
      const amountNGN = toNaira(d.amount, d.currency, d.rateUsed)

      donorTotals[email] = (donorTotals[email] || 0) + amountNGN

      // Donor can only have one program (validated by you)
      donorProgram[email] = d.program
    })

    const topDonors = Object.entries(donorTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([email, amount]) => {
        const donor = donations.find((d) => d.email === email)
        return {
          email,
          name: donor?.name || "Anonymous",
          amount,
          program: donorProgram[email],
        }
      })

    /* -------------------------------------------------
     * TOP SPONSORS (Email-based, NGN normalized, TOP 5)
     * ------------------------------------------------- */
    const sponsorTotals: Record<string, number> = {}

    sponsorships.forEach((s) => {
      const email = s.sponsorEmail
      const amountNGN = toNaira(s.amount, s.currency, s.rateUsed)
      sponsorTotals[email] = (sponsorTotals[email] || 0) + amountNGN
    })

    const topSponsors = Object.entries(sponsorTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([email, amount]) => {
        const sponsor = sponsorships.find((s) => s.sponsorEmail === email)
        return {
          email,
          name: sponsor?.sponsorName,
          amount,
          program: null, // sponsors do NOT have program
        }
      })

    /* -------------------------------------------------
     * HALL OF FAME (Top 5 total contributors)
     * ------------------------------------------------- */
    const hallOfFame = [
      ...topDonors.map((d) => ({ ...d, type: "donor" })),
      ...topSponsors.map((s) => ({ ...s, type: "sponsor" })),
    ]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    /* -------------------------------------------------
     * ITEMS PAID FOR (BAR CHART)
     * ------------------------------------------------- */
    const itemTotals: Record<string, number> = {}

    sponsorships.forEach((s) => {
      s.items.forEach((item) => {
        itemTotals[item.id] = (itemTotals[item.id] || 0) + item.quantity
      })
    })

    const barChartItems = Object.entries(itemTotals).map(([itemId, quantity]) => ({
      itemId,
      quantity,
    }))

    /* -------------------------------------------------
     * TOP VOLUNTEERS (Longest-serving, Top 5)
     * ------------------------------------------------- */
    const topVolunteers = volunteers
      .sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      .slice(0, 5)
      .map((v) => ({
        id: v.id,
        name: v.name,
        email: v.email,
        category: v.category,
        profilePhoto: v.profile_photo_url || null,
        createdAt: v.createdAt,
      }))

    /* -------------------------------------------------
     * QUARTERLY REPORT
     * ------------------------------------------------- */
    const quarterly: Record<string, number> = {}

    const getQuarter = (date: string) => {
      const month = new Date(date).getMonth() + 1
      return Math.ceil(month / 3)
    }

    donations.forEach((d) => {
      const year = new Date(d.createdAt).getFullYear()
      const q = getQuarter(d.createdAt)
      const key = `${year}-Q${q}`

      quarterly[key] =
        (quarterly[key] || 0) + toNaira(d.amount, d.currency, d.rateUsed)
    })

    /* -------------------------------------------------
     * YEARLY REPORT
     * ------------------------------------------------- */
    const yearly: Record<string, number> = {}

    donations.forEach((d) => {
      const year = new Date(d.createdAt).getFullYear()
      yearly[year] =
        (yearly[year] || 0) + toNaira(d.amount, d.currency, d.rateUsed)
    })

    sponsorships.forEach((s) => {
      const year = new Date(s.createdAt).getFullYear()
      yearly[year] =
        (yearly[year] || 0) + toNaira(s.amount, s.currency, s.rateUsed)
    })

    /* -------------------------------------------------
     * RETURN EVERYTHING
     * ------------------------------------------------- */
    return {
      totals: {
        totalDonations,
        donationCount: donations.length,
        totalVolunteers: volunteers.length,
        totalSponsors: sponsorships.length,
        totalBoys: boys.length,
      },
      donationsByProgram,
      topDonors,
      topSponsors,
      hallOfFame,
      topVolunteers,
      barChartItems,
      quarterly,
      yearly,
    }

  } catch (error) {
    console.error("Error calculating enhanced stats:", error)
    throw error
  }
}
export async function getEnhancedStats() {
  try {
    // Fetch raw DB data
    let donations = (await getRecords("donations")) as unknown as Donation[]
    let volunteers = (await getRecords("volunteers")) as unknown as Volunteer[]
    let sponsorships = (await getRecords("sponsorships")) as unknown as Sponsorship[]
    const boys = await getRecords("boys")

    /* -------------------------------------------------
     * STATUS FILTERING
     * ------------------------------------------------- */
    donations = donations.filter((d) => d.status === "completed")
    sponsorships = sponsorships.filter(
      (s) => s.status === "active" || s.status === "completed"
    )
    volunteers = volunteers.filter((v) => v.status === "approved")

    /* -------------------------------------------------
     * UTILITY: SAFE NUMBER + CURRENCY CONVERSION
     * ------------------------------------------------- */
    const toNaira = (
      amount: number | string,
      currency: "USD" | "NGN",
      rateUsed?: number | string
    ): number => {
      const numericAmount = Number(amount)
      const numericRate = rateUsed !== undefined ? Number(rateUsed) : undefined

      if (Number.isNaN(numericAmount)) return 0

      if (currency === "NGN") return numericAmount

      if (numericRate && !Number.isNaN(numericRate)) {
        return numericAmount * numericRate
      }

      return numericAmount
    }

    /* -------------------------------------------------
     * DONATION SUMMARY
     * ------------------------------------------------- */
    const totalDonations = donations.reduce(
      (sum, d) => sum + toNaira(d.amount, d.currency, d.rateUsed),
      0
    )

    const donationPrograms = ["skills", "education", "sports"] as const

    const donationsByProgram: Record<string, number> = donationPrograms.reduce(
      (acc, program) => {
        acc[program] = donations
          .filter((d) => d.program === program)
          .reduce(
            (sum, d) => sum + toNaira(d.amount, d.currency, d.rateUsed),
            0
          )
        return acc
      },
      {} as Record<string, number>
    )

    /* -------------------------------------------------
     * TOP DONORS (Email-based, NGN normalized)
     * ------------------------------------------------- */
    const donorTotals: Record<string, number> = {}
    const donorProgram: Record<string, string> = {}

    donations.forEach((d) => {
      const email = d.email || "anonymous@unknown.com"
      const amountNGN = toNaira(d.amount, d.currency, d.rateUsed)

      donorTotals[email] = (donorTotals[email] || 0) + amountNGN
      donorProgram[email] = d.program
    })

    const topDonors = Object.entries(donorTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([email, amount]) => {
        const donor = donations.find((d) => d.email === email)
        return {
          email,
          name: donor?.name || "Anonymous",
          amount,
          program: donorProgram[email],
        }
      })

    /* -------------------------------------------------
     * TOP SPONSORS (Email-based, NGN normalized)
     * ------------------------------------------------- */
    const sponsorTotals: Record<string, number> = {}

    sponsorships.forEach((s) => {
      const amountNGN = toNaira(s.amount, s.currency, s.rateUsed)
      sponsorTotals[s.sponsorEmail] =
        (sponsorTotals[s.sponsorEmail] || 0) + amountNGN
    })

    const topSponsors = Object.entries(sponsorTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([email, amount]) => {
        const sponsor = sponsorships.find((s) => s.sponsorEmail === email)
        return {
          email,
          name: sponsor?.sponsorName || "Unknown",
          amount,
          program: null,
        }
      })

    /* -------------------------------------------------
     * HALL OF FAME (Top 5 contributors)
     * ------------------------------------------------- */
    const hallOfFame = [
      ...topDonors.map((d) => ({ ...d, type: "donor" })),
      ...topSponsors.map((s) => ({ ...s, type: "sponsor" })),
    ]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    /* -------------------------------------------------
     * ITEMS PAID FOR (BAR CHART)
     * ------------------------------------------------- */
    const itemTotals: Record<string, number> = {}

    sponsorships.forEach((s) => {
      s.items.forEach((item) => {
        itemTotals[item.id] =
          (itemTotals[item.id] || 0) + Number(item.quantity)
      })
    })

    const barChartItems = Object.entries(itemTotals).map(
      ([itemId, quantity]) => ({
        itemId,
        quantity,
      })
    )

    /* -------------------------------------------------
     * TOP VOLUNTEERS (Longest-serving)
     * ------------------------------------------------- */
    const topVolunteers = volunteers
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      )
      .slice(0, 5)
      .map((v) => ({
        id: v.id,
        name: v.name,
        email: v.email,
        category: v.category,
        profilePhoto: v.profile_photo_url || null,
        createdAt: v.createdAt,
      }))

    /* -------------------------------------------------
     * QUARTERLY REPORT
     * ------------------------------------------------- */
    const quarterly: Record<string, number> = {}

    donations.forEach((d) => {
      const date = new Date(d.createdAt)
      const year = date.getFullYear()
      const quarter = Math.ceil((date.getMonth() + 1) / 3)
      const key = `${year}-Q${quarter}`

      quarterly[key] =
        (quarterly[key] || 0) + toNaira(d.amount, d.currency, d.rateUsed)
    })

    /* -------------------------------------------------
     * YEARLY REPORT (Donations + Sponsorships)
     * ------------------------------------------------- */
    const yearly: Record<string, number> = {}

    donations.forEach((d) => {
      const year = new Date(d.createdAt).getFullYear()
      yearly[year] =
        (yearly[year] || 0) + toNaira(d.amount, d.currency, d.rateUsed)
    })

    sponsorships.forEach((s) => {
      const year = new Date(s.createdAt).getFullYear()
      yearly[year] =
        (yearly[year] || 0) + toNaira(s.amount, s.currency, s.rateUsed)
    })

    /* -------------------------------------------------
     * RETURN EVERYTHING
     * ------------------------------------------------- */
    const project100Funding = calculateProject100Funding(donations)

    return {
      totals: {
        totalDonations,
        donationCount: donations.length,
        totalVolunteers: volunteers.length,
        totalSponsors: sponsorships.length,
        totalBoys: boys.length,
      },
      donationsByProgram,
      project100Funding,
      topDonors,
      topSponsors,
      hallOfFame,
      topVolunteers,
      barChartItems,
      quarterly,
      yearly,
    }
  } catch (error) {
    console.error("Error calculating enhanced stats:", error)
    throw error
  }
}


export async function getPublicStats() {
  try {
    let donations = await getRecords("donations") as any[];
    let volunteers = await getRecords("volunteers") as any[];
    let sponsorships = await getRecords("sponsorships") as any[];
    const boys = await getRecords("boys");

    /* -------------------------------------------------
     * FILTER ONLY PUBLIC-SAFE DATA
     * ------------------------------------------------- */
    donations = donations.filter((d) => d.status === "completed");
    volunteers = volunteers.filter((v) => v.status === "approved");
    sponsorships = sponsorships.filter(
      (s) => s.status === "active" || s.status === "completed"
    );

    /* -------------------------------------------------
     * DONATION PROGRAM COUNTS
     * ------------------------------------------------- */
    const donationPrograms = ["skills", "education", "sports"] as const;

    const donationCountByProgram: Record<string, number> = {};
    donationPrograms.forEach((program) => {
      donationCountByProgram[program] = donations.filter(
        (d) => d.program === program
      ).length;
    });

    /* -------------------------------------------------
     * TOP DONORS (COUNT ONLY)
     * ------------------------------------------------- */
    const donorCount: Record<string, number> = {};

    donations.forEach((d) => {
      const email = d.email || "anonymous@unknown.com";
      donorCount[email] = (donorCount[email] || 0) + 1;
    });

    const topDonors = Object.entries(donorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([email, count]) => {
        const donor = donations.find((d) => d.email === email);
        return {
          email,
          name: donor?.name || "Anonymous",
          count,
          program: donor?.program || null,
        };
      });

    /* -------------------------------------------------
     * TOP SPONSORS (COUNT ONLY)
     * ------------------------------------------------- */
    const sponsorCount: Record<string, number> = {};

    sponsorships.forEach((s) => {
      sponsorCount[s.sponsorEmail] =
        (sponsorCount[s.sponsorEmail] || 0) + 1;
    });

    const topSponsors = Object.entries(sponsorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([email, count]) => {
        const sp = sponsorships.find((s) => s.sponsorEmail === email);
        return {
          email,
          name: sp?.sponsorName || "Anonymous Sponsor",
          count,
        };
      });

    /* -------------------------------------------------
     * TOP VOLUNTEERS
     * ------------------------------------------------- */
    const topVolunteers = volunteers
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      )
      .slice(0, 5)
      .map((v) => ({
        id: v.id,
        name: v.name,
        email: v.email,
        category: v.category,
        profilePhoto: v.profile_photo_url || null,
        joined: v.createdAt,
      }));

    /* -------------------------------------------------
     * BOYS BY PROGRAM TRACK (Correct Schema)
     * ------------------------------------------------- */
    const boysByProgram = {
      skills: 0,
      sports: 0,
      education: 0,
    };

    boys.forEach((boy: any) => {
      const track = boy.program_track;
      if (track === "skills") boysByProgram.skills++;
      if (track === "sports") boysByProgram.sports++;
      if (track === "education") boysByProgram.education++;
    });

    /* -------------------------------------------------
     * ITEMS + QUANTITY (Fix undefined itemName)
     * ------------------------------------------------- */

    const itemTotals: Record<string, number> = {};

    sponsorships.forEach((s) => {
      s.items.forEach((item: any) => {
        // Attempt to detect correct field name
        const name =
          item.name ||
          item.itemName ||
          item.title ||
          item.id ||
          "Unknown Item";

        itemTotals[name] = (itemTotals[name] || 0) + item.quantity;
      });
    });

    const itemsAndQuantity = Object.entries(itemTotals).map(
      ([itemName, quantity]) => ({
        itemName,
        quantity,
      })
    );

    const project100Funding = calculateProject100Funding(donations)

    /* -------------------------------------------------
     * RETURN PUBLIC SAFE STATS
     * ------------------------------------------------- */
    return {
      totals: {
        totalDonations: donations.length,
        totalVolunteers: volunteers.length,
        totalSponsors: sponsorships.length,
        totalBoys: boys.length,
      },

      donationsByProgram: donationCountByProgram,
      project100Funding,

      topDonors,
      topSponsors,
      topVolunteers,

      boysByProgram, // ⭐ NOW CORRECT

      itemsSponsored: itemsAndQuantity, // ⭐ FIXED ITEM NAMES
    };
  } catch (error) {
    console.error("Error loading public stats:", error);
    throw error;
  }
}



