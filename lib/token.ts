import * as crypto from "crypto";

export function generateDonationToken() {
  return crypto.randomBytes(32).toString("hex")
}

