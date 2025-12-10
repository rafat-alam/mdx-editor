import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "root/db";
import { users } from "root/db/schema";
import { eq } from "drizzle-orm";

interface ResetToken {
  email: string;
  canReset: boolean;
}

export async function POST(req: NextRequest) {
  const { token, newPassword } = await req.json();
  if (!token || !newPassword) {
    return NextResponse.json({ message: "Missing token or password" }, { status: 400 });
  }

  const secret = process.env.NEXTAUTH_SECRET!;
  let decoded: ResetToken;
  try {
    decoded = jwt.verify(token, secret) as ResetToken;
  } catch {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
  }

  if (!decoded.canReset) {
    return NextResponse.json({ message: "OTP not verified" }, { status: 403 });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  if (!passwordRegex.test(newPassword)) {
    return NextResponse.json({ message: 'Password is not in valid format' }, { status: 400 });
  }

  // Hash and update password
  const hashed = await bcrypt.hash(newPassword, 10);
  const updated = await db
    .update(users)
    .set({ password: hashed })
    .where(eq(users.email, decoded.email))
    .returning({ email: users.email });

  if (!updated.length) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
}
