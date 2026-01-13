import { AuthService } from '@/module/services/auth_service';
import { NextRequest, NextResponse } from 'next/server';

interface Response {
  status: number;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    let { token } = await req.json();

    if (typeof token !== "string") {
      return NextResponse.json({ message: 'Bad Request!' }, { status: 400 });
    }

    token = token.trim();
    
    if (!token) {
      return NextResponse.json({ message: 'Invalid or expired token!' }, { status: 401 });
    }

    const res: Response = await AuthService.resend_otp(token);

    return NextResponse.json({ message: res.message }, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'OTP Resend failed!' }, { status: 500 });
  }
}
