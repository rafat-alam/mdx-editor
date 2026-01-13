import { AuthService } from "@/module/services/auth_service";
import { HelperService } from "@/module/services/helper_service";
import { NextRequest, NextResponse } from "next/server";

interface Response {
  status: number;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    let { token, password } = await req.json();

    token = token.trim();
    password = password.trim();

    const res1: Response = HelperService.check_password(password);
    
    if (res1.status != 200) {
      return NextResponse.json({ message: res1.message }, { status: res1.status });
    }
    
    if (!token) {
      return NextResponse.json({ message: 'Invalid or expired token!' }, { status: 401 });
    }

    const res2: Response = await AuthService.set_password(token, password);

    return NextResponse.json({ message: res2.message }, { status: res2.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
