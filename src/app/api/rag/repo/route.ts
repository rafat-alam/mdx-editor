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

interface ResponseRepo {
  status: number;
  message: string;
  list: null | any;
}

export async function POST(req: NextRequest) {
  try {
    let { username, repo, query } = await req.json();
    
    if (typeof username !== "string" || typeof repo !== "string" || typeof query !== "string") {
      return NextResponse.json({ message: 'Bad Request!' }, { status: 400 });
    }

    username = username.trim();
    repo = repo.trim();
    query = query.trim();

    if (!query || !username || !repo) {
      return NextResponse.json({ message: 'Missing fields!' }, { status: 400 });
    }

    const token = await getToken({ req, secret });
    
    const res1: Response = await HelperService.check_auth(req);
    
    if(res1.status != 200 || !token) {
      return NextResponse.json({ message: res1.message }, { status: 401 });
    }

    const res2: ResponseRepo = await NodeService.get_content_by_link([ repo ], token.user_id, token.user_id);

    return NextResponse.json({ message: res2.message + JSON.stringify(res2.list) }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
