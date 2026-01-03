import { NodeService } from '@/module/services/node_service';
import { UserService } from '@/module/services/user_service';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET ?? 'rafat';

interface Response {
  status: number;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { content } = body;
    const { path, name } = body;

    const token = await getToken({ req, secret });
    if (!token || !token.user_id) {
      return NextResponse.json({ message: 'User not authenticated!' }, { status: 500 });
    }

    const nameRegex = /^[A-Za-z0-9._ -]{1,256}$/;

    if (!nameRegex.test(name)) {
      return NextResponse.json({ message: 'Name of File is not in valid format!' }, { status: 400 });
    }

    if(path.length < 2) {
      return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
    }

    if(!content) content = "";
    
    const res1: Response = await UserService.get_user_id(path[0]);

    if (res1.status != 200) {
      return NextResponse.json({ message: res1.message }, { status: res1.status });
    }

    const owner_id: string = res1.message;

    const res2: Response = await NodeService.get_node_id_by_link(path.slice(1), owner_id, token.user_id);

    if (res2.status != 200) {
      return NextResponse.json({ message: res2.message }, { status: res2.status });
    }

    const parent_id: string = res2.message;

    const res3: Response = await NodeService.add_file(name, content, token.user_id, parent_id);

    return NextResponse.json({ message: res3.message }, { status: res3.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
