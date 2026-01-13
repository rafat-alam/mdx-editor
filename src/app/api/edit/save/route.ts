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
    let { content, path } = await req.json();
    const token = await getToken({ req, secret });
    
    content ??= HelperService.DEFAULT_CONTENT;

    const res1: Response = await HelperService.check_auth(req);
        
    if(res1.status != 200 || !token) {
      return NextResponse.json({ message: res1.message }, { status: 401 });
    }

    if(path.length < 3) {
      return NextResponse.json({ message: 'Access Forbidden!' }, { status: 403 });
    }
    
    const res2: Response = await UserService.get_user_id(path[0]);

    if (res2.status != 200) {
      return NextResponse.json({ message: res2.message }, { status: res2.status });
    }

    const owner_id: string = res2.message;

    const res3: Response = await NodeService.get_node_id_by_link(path.slice(1), owner_id, token.user_id);

    if (res3.status != 200) {
      return NextResponse.json({ message: res3.message }, { status: res3.status });
    }

    const node_id: string = res3.message;

    const res4: Response = await NodeService.save(node_id, content, token.user_id);

    return NextResponse.json({ message: res4.message }, { status: res4.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
