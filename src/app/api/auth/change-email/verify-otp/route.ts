import { AuthService } from "@/module/services/auth_service";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET ?? 'rafat';

interface Response {
  status: number;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const { token, otp } = await req.json();
    if (!otp) {
      return NextResponse.json({ message: 'Missing OTP!' }, { status: 400 });
    }
    if (!token) {
      return NextResponse.json({ message: 'Invalid or expired token!' }, { status: 400 });
    }

    const jwt_token = await getToken({ req, secret });
    if (!jwt_token || !jwt_token.user_id) {
      return NextResponse.json({ message: 'User not authenticated!' }, { status: 498 });
    }

    const res: Response = await AuthService.forgot_pass_or_change_email_verify_otp(token, otp);

    return NextResponse.json({ message: res.message }, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
