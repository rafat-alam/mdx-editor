import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { _Node } from '@/module/entities/node';
import { UserService } from '@/module/services/user_service';
import { NodeService } from '@/module/services/node_service';

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

    const res2: Response = await NodeService.user_repo_count(owner_id, user_id);

    if(res2.status != 200) {
      return NextResponse.json({ message: res2.message, user: null }, { status: res2.status });
    }

    const repo_count = Number(res2.message);
    
    const redis_res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/last-active:${owner_id}`, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      },
    });

    const data = await redis_res.json();
    const last_active = (new Date(Number(data.result))).toISOString();

    if(owner_id == user_id) {
      const res3: ResponsePrivateUser = await UserService.get_private_user(username);

      if (res3.status != 200) {
        return NextResponse.json({ message: res3.message, user: null }, { status: res3.status });
      }

      return NextResponse.json({ message: "1", user: {
        username: res3.user?.username,
        name: res3.user?.name,
        email: res3.user?.email,
        last_active,
        repo_count,
      } }, { status: res3.status });
    } else {
      const res3: ResponsePublicUser = await UserService.get_public_user(username);

      if (res3.status != 200) {
        return NextResponse.json({ message: res3.message, user: null }, { status: res3.status });
      }

      return NextResponse.json({ message: "2", user: {
        username: res3.user?.username,
        name: res3.user?.name,
        email: null,
        last_active,
        repo_count,
      } }, { status: res3.status });
    }
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
