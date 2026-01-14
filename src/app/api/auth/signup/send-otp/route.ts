import { AuthService } from '@/module/services/auth_service'
import { HelperService } from '@/module/services/helper_service';
import { NextRequest, NextResponse } from 'next/server'

interface Response {
  status: number;
  message: string;
}

export const POST = async (req: NextRequest) => {
  try {
    let { name, email, username, password } = await req.json();

    if (typeof name !== "string" || typeof email !== "string" || typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json({ message: 'Bad Request!' }, { status: 400 });
    }
    
    name = name.trim();
    email = email.trim().toLowerCase();
    username = username.trim().toLowerCase();
    password = password.trim();

    const res1: Response = HelperService.check_name(name);
    
    if (res1.status != 200) {
      return NextResponse.json({ message: res1.message }, { status: res1.status });
    }

    const res2: Response = HelperService.check_email(email);
    
    if (res2.status != 200) {
      return NextResponse.json({ message: res2.message }, { status: res2.status });
    }
    
    const res3: Response = HelperService.check_username(username);
    
    if (res3.status != 200) {
      return NextResponse.json({ message: res3.message }, { status: res3.status });
    }
    
    const res4: Response = HelperService.check_password(password);
    
    if (res4.status != 200) {
      return NextResponse.json({ message: res4.message }, { status: res4.status });
    }

    const res5: Response = await AuthService.init_signup(username, name, email, password);

    return NextResponse.json({ message: res5.message }, { status: res5.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 })
  }
}