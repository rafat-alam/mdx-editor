import { AuthService } from "@/module/services/auth_service";
import { HelperService } from "@/module/services/helper_service";
import { NextRequest, NextResponse } from "next/server";

interface Response {
  status: number;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    let { token, otp } = await req.json();

    if (typeof token !== "string" || typeof otp !== "string") {
      return NextResponse.json({ message: 'Bad Request!' }, { status: 400 });
    }

    token = token.trim();
    otp = otp.trim();

    const res1: Response = HelperService.check_otp(otp);
    
    if (res1.status != 200) {
      return NextResponse.json({ message: res1.message }, { status: res1.status });
    }

    if (!token) {
      return NextResponse.json({ message: 'Invalid or expired token!' }, { status: 401 });
    }

    const res2: Response = await AuthService.forgot_pass_verify_otp(token, otp);

    return NextResponse.json({ message: res2.message }, { status: res2.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
