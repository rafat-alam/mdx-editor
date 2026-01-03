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
    const { name, vis } = await req.json();

    const token = await getToken({ req, secret });
    if (!token || !token.user_id) {
      return NextResponse.json({ message: 'User not authenticated!' }, { status: 500 });
    }

    if (!name) {
      return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
    }

    const res1: Response = await NodeService.get_node_id_by_link([ name ], token.user_id, token.user_id);

    if (res1.status != 200) {
      return NextResponse.json({ message: res1.message }, { status: res1.status });
    }

    const repo_id: string = res1.message;

    const res2: Response = await NodeService.set_repo_vis(repo_id, token.user_id, vis);

    return NextResponse.json({ message: res2.message }, { status: res2.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
