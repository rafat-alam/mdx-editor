import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { _Node } from '@/module/entities/node';
import { UserService } from '@/module/services/user_service';

const secret = process.env.NEXTAUTH_SECRET ?? 'rafat';

interface Response {
  status: number;
  message: string;
}

interface ResponsePublicUser {
  status: number;
  message: string;
  user: null | {
    username: string;
    name: string;
  };
}

interface ResponsePrivateUser {
  status: number;
  message: string;
  user: null | {
    username: string;
    name: string;
    email: string;
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const token = await getToken({ req, secret });
    const { username } = await params;

    let user_id: string = "temp-token";
    if (token && token.user_id) {
      user_id = token.user_id;
    }

    const res1: Response = await UserService.get_user_id(username);

    if (res1.status != 200) {
      return NextResponse.json({ message: res1.message, user: null }, { status: res1.status });
    }

    const owner_id: string = res1.message;

    if(owner_id == user_id) {
      const res2: ResponsePrivateUser = await UserService.get_private_user(username);

      return NextResponse.json({ message: "1", user: {
        username: res2.user?.username,
        name: res2.user?.name,
        email: res2.user?.email,
        last_active: new Date(),
        repo_count: 67,
      } }, { status: res2.status });
    } else {
      const res2: ResponsePublicUser = await UserService.get_public_user(username);

      return NextResponse.json({ message: "2", user: {
        username: res2.user?.username,
        name: res2.user?.name,
        email: null,
        last_active: new Date(),
        repo_count: 67,
      } }, { status: res2.status });
    }
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
