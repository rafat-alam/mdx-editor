import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "root/db";
import { users } from "root/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "root/helpers/mailer";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  let { email } = await req.json();

  email = email.trim().toLowerCase();
  
  if (!email) return NextResponse.json({ message: "Email required" }, { status: 400 });

  // Check if user exists
  const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
  if (!user) {
    return NextResponse.json({ message: "User not registered." }, { status: 400 });
  }

  // Generate OTP and expiry
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000;

  // Send OTP to mail
  await sendEmail(
    email,
    otp,
    `<p>Your password reset OTP is <strong>${otp}</strong></p><p>Expires in 10 minutes</p>`
  );

  // Sign token containing email + OTP
  const secret = process.env.NEXTAUTH_SECRET!;
  const payload = { email: email.toLowerCase(), otp, otpExpiry, canReset: false };
  const token = jwt.sign(payload, secret, { expiresIn: "10m" });

  return NextResponse.json({ message: "OTP Sent", token }, { status: 201 });
}
