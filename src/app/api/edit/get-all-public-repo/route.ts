import { _Node } from '@/module/entities/node';
import { NodeService } from '@/module/services/node_service';
import { NextResponse } from 'next/server';

interface ResponseList {
  status: number;
  message: string;
  list: null | _Node [];
}

export async function GET() {
  try {
    const res: ResponseList = await NodeService.get_all_public_repo();

    if(res.status != 200) {
      return NextResponse.json({ message: res.message, list: null }, { status: res.status });
    }

    const sanitized_list = res.list?.map(item => ({
      node_name: item.node_name,
      node_type: item.node_type,
      is_public: item.is_public,
      last_updated: item.last_updated,
    }));

    return NextResponse.json({ message: res.message, list: sanitized_list }, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!', list: null }, { status: 500 });
  }
}
