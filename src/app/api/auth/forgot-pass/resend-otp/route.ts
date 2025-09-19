import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "root/helpers/mailer";

interface ResetToken {
  email: string;
  otp: string;
  otpExpiry: number;
  canReset: boolean;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ message: "Missing token" }, { status: 400 });
    }

    const secret = process.env.NEXTAUTH_SECRET!;
    let decoded: ResetToken;
    try {
      decoded = jwt.verify(token, secret) as ResetToken;
    } catch {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    // Only allow resending if OTP already expired
    if (decoded.otpExpiry >= Date.now()) {
      return NextResponse.json(
        {
          message: `OTP still valid, try again in ${formatTime(
            decoded.otpExpiry - Date.now()
          )}`,
        },
        { status: 400 }
      );
    }

    // Generate new OTP & expiry
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    // Send OTP email
    await sendEmail(
      decoded.email,
      otp,
      `<p>Your password reset OTP is <strong>${otp}</strong></p><p>Expires in 10 minutes</p>`
    );

    // Create new token with updated OTP
    const payload: ResetToken = {
      email: decoded.email,
      otp,
      otpExpiry,
      canReset: false, // must verify again
    };
    const newToken = jwt.sign(payload, secret, { expiresIn: "10m" });

    return NextResponse.json(
      { message: "New OTP sent successfully", token: newToken },
      { status: 201 }
    );
  } catch (err) {
    console.error("Resend OTP failed:", err);
    return NextResponse.json({ message: "Resend failed" }, { status: 500 });
  }
}
