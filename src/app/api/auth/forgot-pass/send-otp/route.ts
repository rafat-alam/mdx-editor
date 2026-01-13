import { AuthService } from "@/module/services/auth_service";
import { HelperService } from "@/module/services/helper_service";
import { NextRequest, NextResponse } from "next/server";

interface Response {
  status: number;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    let { email } = await req.json();

    email = email.trim().toLowerCase();
    
    const res1: Response = HelperService.check_email(email);
    
    if (res1.status != 200) {
      return NextResponse.json({ message: res1.message }, { status: res1.status });
    }

    const res2: Response = await AuthService.init_forgot_password(email);

    return NextResponse.json({ message: res2.message }, { status: res2.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
