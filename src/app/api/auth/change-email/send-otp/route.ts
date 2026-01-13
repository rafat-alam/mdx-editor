import { AuthService } from "@/module/services/auth_service";
import { HelperService } from "@/module/services/helper_service";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET ?? 'rafat';

interface Response {
  status: number;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    let { email } = await req.json();

    if (typeof email !== "string") {
      return NextResponse.json({ message: 'Bad Request!' }, { status: 400 });
    }

    email = email.trim().toLowerCase();

    const res1: Response = await HelperService.check_auth(req);

    if(res1.status != 200) {
      return NextResponse.json({ message: res1.message }, { status: res1.status });
    }

    const res2: Response = HelperService.check_email(email);

    if (res2.status != 200) {
      return NextResponse.json({ message: res2.message }, { status: res2.status });
    }
    
    const res3: Response = await AuthService.init_change_email(email);

    return NextResponse.json({ message: res3.message }, { status: res3.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
