import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { sendEmail } from 'root/helpers/mailer';

/**
 * Interface describing the structure of the temporary JWT
 * used during user signup for OTP verification.
 */
interface DecodedToken {
  email: string;
  username: string;
  password: string;   // already hashed
  otp: string;        // 6-digit OTP
  otpExpiry: number;  // timestamp in milliseconds when OTP expires
}

/**
 * Utility to format milliseconds into "minutes:seconds"
 * for user-friendly OTP cooldown messages.
 */
function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * POST /api/auth/resend-otp
 *
 * Endpoint to resend a new OTP if the previous one has expired.
 * Steps:
 * 1. Accepts a JWT token from the client containing signup info.
 * 2. Verifies the token to ensure it’s valid and untampered.
 * 3. Checks if the existing OTP has expired.
 *    - If expired: generates a new OTP, emails it, returns updated token.
 *    - If still valid: prevents spamming, returns remaining cooldown time.
 *
 * Security Notes:
 * - JWT is signed with NEXTAUTH_SECRET to prevent tampering.
 * - OTP is cryptographically random (6 digits).
 * - OTP validity: 10 minutes.
 *
 * Request Body:
 * {
 *   token: string
 * }
 *
 * Responses:
 * 201 - OTP Sent successfully, returns updated token.
 * 400 - OTP still valid or session expired.
 * 500 - Internal server error (failed to send OTP).
 */
export async function POST(req: NextRequest) {
  let decoded: DecodedToken;

  // Step 1: Extract and verify JWT token
  try {
    const { token } = await req.json();
    const secret = process.env.NEXTAUTH_SECRET!;
    decoded = jwt.verify(token, secret) as DecodedToken;
  } catch {
    return NextResponse.json({ message: 'Session Expired or Invalid Token' }, { status: 400 });
  }

  // Step 2: Check OTP expiration
  try {
    if (decoded.otpExpiry < Date.now()) {
      // Generate a new 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Send OTP to user's email
      await sendEmail(
        decoded.email,
        otp,
        `<p>Your OTP is <strong>${otp}</strong></p><p>Expires in 10 minutes</p>`
      );

      // Create a new JWT with updated OTP and expiry
      const secret = process.env.NEXTAUTH_SECRET!;
      const payload = {
        email: decoded.email,
        username: decoded.username,
        password: decoded.password,
        otp,
        otpExpiry: Date.now() + 10 * 60 * 1000 // 10 minutes from now
      };
      const encryptedToken = jwt.sign(payload, secret, { expiresIn: '10m' });

      // Return success response with new token
      return NextResponse.json({ message: 'OTP Sent', token: encryptedToken }, { status: 201 });
    } else {
      // OTP is still valid, prevent spamming
      return NextResponse.json(
        { message: `OTP sent recently, try again in ${formatTime(decoded.otpExpiry - Date.now())}` },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error('Resend OTP failed:', err);
    return NextResponse.json({ message: 'OTP Resend failed' }, { status: 500 });
  }
}
