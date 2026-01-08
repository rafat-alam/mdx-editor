import { AuthService } from '@/module/services/auth_service'
import { NextRequest, NextResponse } from 'next/server'

interface Response {
  status: number;
  message: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json()
    let { name, email, username, password } = body
    
    name = name.trim();
    email = email.trim().toLowerCase();
    username = username.trim().toLowerCase();
    password = password.trim();

    if (!name || !email || !username || !password) {
      return NextResponse.json({ message: 'Missing fields!' }, { status: 400 })
    }

    const username_regex = /^[a-z0-9]{5,}$/;

    if (!username_regex.test(username)) {
      return NextResponse.json({ message: 'Username is not in valid format!' }, { status: 400 });
    }

    const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!password_regex.test(password)) {
      return NextResponse.json({ message: 'Password is not in valid format!' }, { status: 400 });
    }

    const email_regex = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\]))$/;

    if (!email_regex.test(email)) {
      return NextResponse.json({ message: 'Email is not in valid format!' }, { status: 400 });
    }

    const name_regex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

    if (!name_regex.test(name)) {
      return NextResponse.json({ message: 'Name is not in valid format!' }, { status: 400 });
    }

    const res: Response = await AuthService.init_signup(username, name, email, password);

    return NextResponse.json({ message: res.message }, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 })
  }
}