import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { _Node } from '@/module/entities/node';

const secret = process.env.NEXTAUTH_SECRET ?? 'rafat';

interface ResponseList {
  status: number;
  message: string;
  list: null | _Node [];
}

interface Response {
  status: number;
  message: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string [] } }
) {
  try {
    const token = await getToken({ req, secret });
    const { path } = await params;

    let user_id: string = "temp-token";
    if (token && token.user_id) {
      user_id = token.user_id;
    }

    return NextResponse.json({ token, path }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
