import { AuthService } from "@/module/services/auth_service";
import { NextRequest, NextResponse } from "next/server";

interface Response {
  status: number;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    let { token, password } = await req.json();
    password = password.trim();

    if (!password) {
      return NextResponse.json({ message: 'Missing password!' }, { status: 400 });
    }
    
    if (!token) {
      return NextResponse.json({ message: 'Invalid or expired token!' }, { status: 401 });
    }

    const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!password_regex.test(password)) {
      return NextResponse.json({ message: 'Password is not in valid format!' }, { status: 400 });
    }

    const res: Response = await AuthService.set_pass(token, password);

    return NextResponse.json({ message: res.message }, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
