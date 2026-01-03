import { NodeService } from '@/module/services/node_service';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET ?? 'rafat';

interface Response {
  status: number;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    const token = await getToken({ req, secret });
    if (!token || !token.user_id) {
      return NextResponse.json({ message: 'User not authenticated!' }, { status: 500 });
    }

    const nameRegex = /^[A-Za-z0-9._ -]{1,256}$/;

    if (!nameRegex.test(name)) {
      return NextResponse.json({ message: 'Name of Repo is not in valid format!' }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
    }

    const res: Response = await NodeService.add_repo(name, token.user_id);

    return NextResponse.json({ message: res.message }, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
