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
    let { name } = await req.json();
    const token = await getToken({ req, secret });

    name = name.trim();
  
    const res1: Response = await HelperService.check_auth(req);

    if(res1.status != 200 || !token) {
      return NextResponse.json({ message: res1.message }, { status: 401 });
    }

    const res2: Response = HelperService.check_node_name(name);
    
    if(res2.status != 200) {
      return NextResponse.json({ message: res2.message }, { status: res2.status });
    }

    const res3: Response = await NodeService.add_repo(name, token.user_id);

    return NextResponse.json({ message: res3.message }, { status: res3.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
