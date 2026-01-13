import { HelperService } from '@/module/services/helper_service';
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
    let { path, name } = await req.json();

    if (!Array.isArray(path) || !path.every(p => typeof p === "string")) {
      return NextResponse.json({ message: "Bad Request!" }, { status: 400 });
    }

    if (typeof name !== "string") {
      return NextResponse.json({ message: 'Bad Request!' }, { status: 400 });
    }

    const token = await getToken({ req, secret });

    name = name.trim() + ".mdx";

    const res1: Response = await HelperService.check_auth(req);
    
    if(res1.status != 200 || !token) {
      return NextResponse.json({ message: res1.message }, { status: 401 });
    }

    const res2: Response = HelperService.check_node_name(name);
    
    if(res2.status != 200) {
      return NextResponse.json({ message: res2.message }, { status: res2.status });
    }

    if(path.length < 2) {
      return NextResponse.json({ message: 'Access Forbidden!' }, { status: 403 });
    }
    
    const res3: Response = await UserService.get_user_id(path[0]);

    if (res3.status != 200) {
      return NextResponse.json({ message: res3.message }, { status: res3.status });
    }

    const owner_id: string = res3.message;

    const res4: Response = await NodeService.get_node_id_by_link(path.slice(1), owner_id, token.user_id);

    if (res4.status != 200) {
      return NextResponse.json({ message: res4.message }, { status: res4.status });
    }

    const parent_id: string = res4.message;

    const res5: Response = await NodeService.add_file(name, HelperService.DEFAULT_CONTENT, token.user_id, parent_id);

    return NextResponse.json({ message: res5.message }, { status: res5.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
