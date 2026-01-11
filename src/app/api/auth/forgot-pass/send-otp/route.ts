import { AuthService } from "@/module/services/auth_service";
import { NextRequest, NextResponse } from "next/server";

interface Response {
  status: number;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    let { email } = await req.json();
    email = email.trim().toLowerCase();
    
    if (!email) return NextResponse.json({ message: 'Email required!' }, { status: 400 });

    const res: Response = await AuthService.init_forgot_password(email);

    return NextResponse.json({ message: res.message }, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
