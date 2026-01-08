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
    const { old_name, new_name } = await req.json();

    const token = await getToken({ req, secret });
    if (!token || !token.user_id) {
      return NextResponse.json({ message: 'User not authenticated!' }, { status: 401 });
    }

    const name_regex = /^[A-Za-z0-9._ -]{1,256}$/;

    if (!name_regex.test(new_name)) {
      return NextResponse.json({ message: 'Name of Repo is not in valid format!' }, { status: 400 });
    }

    if (!old_name || !new_name) {
      return NextResponse.json({ message: 'Missing Fields!' }, { status: 400 });
    }

    const res1: Response = await NodeService.get_node_id_by_link([ old_name ], token.user_id, token.user_id);

    if (res1.status != 200) {
      return NextResponse.json({ message: res1.message }, { status: res1.status });
    }

    const repo_id: string = res1.message;

    const res2: Response = await NodeService.rename_repo(repo_id, new_name, token.user_id);

    return NextResponse.json({ message: res2.message }, { status: res2.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
