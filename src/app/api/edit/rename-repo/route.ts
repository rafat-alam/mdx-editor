import { HelperService } from '@/module/services/helper_service';
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
    let { old_name, new_name } = await req.json();
    const token = await getToken({ req, secret });

    old_name = old_name.trim();
    new_name = new_name.trim();
    
    const res1: Response = await HelperService.check_auth(req);
    
    if(res1.status != 200 || !token) {
      return NextResponse.json({ message: res1.message }, { status: 401 });
    }

    const res2: Response = HelperService.check_node_name(old_name);
    
    if(res2.status != 200) {
      return NextResponse.json({ message: res2.message }, { status: res2.status });
    }

    const res3: Response = HelperService.check_node_name(new_name);
    
    if(res3.status != 200) {
      return NextResponse.json({ message: res3.message }, { status: res3.status });
    }

    const res4: Response = await NodeService.get_node_id_by_link([ old_name ], token.user_id, token.user_id);

    if (res4.status != 200) {
      return NextResponse.json({ message: res4.message }, { status: res4.status });
    }

    const repo_id: string = res4.message;

    const res5: Response = await NodeService.rename_repo(repo_id, new_name, token.user_id);

    return NextResponse.json({ message: res5.message }, { status: res5.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
