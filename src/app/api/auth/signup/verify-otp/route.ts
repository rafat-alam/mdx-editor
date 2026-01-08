import { AuthService } from "@/module/services/auth_service";
import { NextRequest, NextResponse } from "next/server";

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
      return NextResponse.json({ message: 'Invalid or expired token!' }, { status: 401 });
    }

    const res: Response = await AuthService.verify_otp(token, otp);

    return NextResponse.json({ message: res.message }, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}