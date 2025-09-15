import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "root/db"; // Drizzle instance
import { users } from "root/db/schema";
import { eq, sql } from "drizzle-orm";

interface DecodedToken {
  email: string;
  username: string;
  password: string; // hashed
  otp: string;
  otpExpiry: number;
}

export async function POST(req: NextRequest) {
  try {
    // Step 1: Extract token + otp from request
    const { token, otp } = await req.json();
    if (!token || !otp) {
      return NextResponse.json({ message: "Missing token or OTP" }, { status: 400 });
    }

    // Step 2: Verify JWT
    const secret = process.env.NEXTAUTH_SECRET!;
    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, secret) as DecodedToken;
    } catch {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    // Step 3: Check OTP correctness
    if (decoded.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    // Step 4: Check OTP expiry
    if (decoded.otpExpiry < Date.now()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    // Step 5: Check email uniqueness
    const [existingEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, decoded.email.toLowerCase()));

    if (existingEmail) {
      return NextResponse.json({ message: "Email already used" }, { status: 409 });
    }

    // Step 6: Check username uniqueness (case-insensitive)
    const [existingUsername] = await db
      .select()
      .from(users)
      .where(sql`LOWER(${users.username}) = ${decoded.username.toLowerCase()}`);

    if (existingUsername) {
      return NextResponse.json({ message: "Username already used" }, { status: 409 });
    }

    // Step 7: Insert user into PostgreSQL
    const result = await db.insert(users).values({
      email: decoded.email.toLowerCase(),
      username: decoded.username,
      password: decoded.password, // already hashed
    }).returning({ id: users.id, email: users.email, username: users.username });

    const newUser = result[0];

    // Step 8: Return success
    return NextResponse.json(
      { message: "User verified and created successfully", user: newUser },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Verification failed" }, { status: 500 });
  }
}