import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { _Node } from '@/module/entities/node';
import { UserService } from '@/module/services/user_service';

const secret = process.env.NEXTAUTH_SECRET ?? 'rafat';

interface ResponsePrivateUser {
  status: number;
  message: string;
  user: null | {
    username: string;
    name: string;
    email: string;
  };
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret });

    if (!token || !token.user_id) {
      return NextResponse.json({ message: 'User not authenticated!' }, { status: 400 });
    }

    const res: ResponsePrivateUser = await UserService.get_user_by_id(token.user_id);

    return NextResponse.json({ message: res.message, user: {
      username: res.user?.username,
      name: res.user?.name,
      email: res.user?.email,
      last_active: new Date(),
    } }, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
