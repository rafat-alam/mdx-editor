import { _Node } from '@/module/entities/node';
import { NodeService } from '@/module/services/node_service';
import { UserService } from '@/module/services/user_service';
import { NextResponse } from 'next/server';

interface ResponseList {
  status: number;
  message: string;
  list: null | _Node [];
}

interface ResponseAllUser {
  status: number;
  message: string;
  user_list: null | {
    user_id: string;
    username: string;
  } [];
}

export async function GET() {
  try {
    const res1: ResponseList = await NodeService.get_all_public_repos();

    if(res1.status != 200) {
      return NextResponse.json({ message: res1.message, list: null }, { status: res1.status });
    }

    const res2: ResponseAllUser = await UserService.get_all_users();

    if(res2.status != 200) {
      return NextResponse.json({ message: res2.message, list: null }, { status: res2.status });
    }

    const userMap = new Map<string, string>();
    for (const user of res2.user_list!) {
      userMap.set(user.user_id, user.username);
    }

    const sanitized_list = res1.list!.map((item) => ({
      owner_username: userMap.get(item.owner_id) ?? 'unknown',
      node_name: item.node_name,
      last_updated: item.last_updated,
    }));

    return NextResponse.json({ message: res1.message, list: sanitized_list }, { status: res1.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!', list: null }, { status: 500 });
  }
}
