import { _Node } from '@/module/entities/node';
import { NodeService } from '@/module/services/node_service';
import { UserService } from '@/module/services/user_service';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET ?? 'rafat';

interface Response {
  status: number;
  message: string;
}

interface ResponseList {
  status: number;
  message: string;
  list: null | _Node [];
}

export async function POST(req: NextRequest) {
  try {
    const { path } = await req.json();

    if (!Array.isArray(path) || !path.every(p => typeof p === "string")) {
      return NextResponse.json({ message: "Bad Request!" }, { status: 400 });
    }

    const token = await getToken({ req, secret });

    let user_id: string = "temp-token";
    if (token && token.user_id) {
      user_id = token.user_id;
    }

    if(path.length < 1) {
      return NextResponse.json({ message: 'Access Forbidden!', list: null }, { status: 403 });
    }
    
    const res1: Response = await UserService.get_user_id(path[0]);

    if (res1.status != 200) {
      return NextResponse.json({ message: res1.message, list: null }, { status: res1.status });
    }

    const owner_id: string = res1.message;

    const res2: ResponseList = await NodeService.get_content_by_link(path.slice(1), owner_id, user_id);

    if(res2.status != 200) {
      return NextResponse.json({ message: res2.message, list: null }, { status: res2.status });
    }

    const sanitized_list = res2.list?.map(item => ({
      node_name: item.node_name,
      node_type: item.node_type,
      is_public: item.is_public,
      last_updated: item.last_updated,
    }));

    return NextResponse.json({ message: res2.message, list: sanitized_list }, { status: res2.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!', list: null }, { status: 500 });
  }
}
