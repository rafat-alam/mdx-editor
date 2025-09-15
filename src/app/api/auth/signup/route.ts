import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from 'root/db'           // your Drizzle instance
import { users } from 'root/db/schema' // your users table schema
import { eq, sql } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { sendEmail } from 'root/helpers/mailer'
import crypto from 'crypto'

export const POST = async (req: NextRequest) => {
  try {
    // Step 1: Parse request body
    const body = await req.json()
    const { email, username, password } = body

    if (!email || !username || !password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
    }

    // Step 2: Check if email already exists
    const [existingUserByEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))

    if (existingUserByEmail) {
      return NextResponse.json({ message: 'Email already used' }, { status: 409 })
    }

    // Step 3: Check if username already exists (case-insensitive)
    const [existingUserByUsername] = await db
      .select()
      .from(users)
      .where(sql`LOWER(${users.username}) = LOWER(${username})`) // ✅ compare both lowercased

    if (existingUserByUsername) {
      return NextResponse.json({ message: 'Username already used' }, { status: 409 })
    }

    // Step 4: Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Step 5: Generate 6-digit OTP and expiry
    const otp = crypto.randomInt(100000, 999999).toString()
    const otpExpiry = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Step 6: Send OTP email
    await sendEmail(
      email,
      otp,
      `<p>Your OTP is <strong>${otp}</strong></p><p>Expires in 10 minutes</p>`
    )

    // Step 7: Sign temporary JWT containing user info + OTP
    const secret = process.env.NEXTAUTH_SECRET
    if (!secret) {
      throw new Error('NEXTAUTH_SECRET is not set')
    }

    const payload = {
      email: email.toLowerCase(),
      username,
      password: hashedPassword,
      otp,
      otpExpiry,
    }

    const token = jwt.sign(payload, secret, { expiresIn: '10m' })

    // Step 8: Respond with token
    return NextResponse.json({ message: 'OTP Sent', token }, { status: 201 })
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}
