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
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ message: 'Invalid or expired token!' }, { status: 500 });
    }

    const jwt_token = await getToken({ req, secret });
    if (!jwt_token || !jwt_token.user_id) {
      return NextResponse.json({ message: 'User not authenticated!' }, { status: 500 });
    }

    const res: Response = await AuthService.forgot_pass_or_change_email_resend_otp(token);

    return NextResponse.json({ message: res.message }, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
