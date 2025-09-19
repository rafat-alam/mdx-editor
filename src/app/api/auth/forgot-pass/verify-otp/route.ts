import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface ResetToken {
  email: string;
  otp: string;
  otpExpiry: number;
  canReset: boolean;
}

export async function POST(req: NextRequest) {
  const { token, otp } = await req.json();
  if (!token || !otp) return NextResponse.json({ message: "Missing token/otp" }, { status: 400 });

  const secret = process.env.NEXTAUTH_SECRET!;
  let decoded: ResetToken;
  try {
    decoded = jwt.verify(token, secret) as ResetToken;
  } catch {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
  }

  if (decoded.otp !== otp) return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
  if (decoded.otpExpiry < Date.now()) return NextResponse.json({ message: "OTP expired" }, { status: 400 });

  // Create new token allowing password reset
  const newToken = jwt.sign(
    { email: decoded.email, canReset: true },
    secret,
    { expiresIn: "10m" }
  );

  return NextResponse.json({ message: "OTP verified", token: newToken }, { status: 200 });
}
