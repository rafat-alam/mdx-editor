import { NodeService } from '@/module/services/node_service';
import { UserService } from '@/module/services/user_service';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET ?? 'rafat';

interface Response {
  status: number;
  message: string;
}

const DEFAULT_CONTENT = '# Hello, MDX!\n\nThis is a sample MDX document.\n\n```js\nconsole.log("Hello world");\n```\n\n## Features\n\n- **Bold text** and *italic text*\n- Lists and code blocks\n- And more!';

export async function POST(req: NextRequest) {
  try {
    let { content, path } = await req.json();

    const token = await getToken({ req, secret });
    if (!token || !token.user_id) {
      return NextResponse.json({ message: 'User not authenticated!' }, { status: 401 });
    }

    if(path.length < 3) {
      return NextResponse.json({ message: 'Access Forbidden!' }, { status: 403 });
    }

    content ??= DEFAULT_CONTENT;
    
    const res1: Response = await UserService.get_user_id(path[0]);

    if (res1.status != 200) {
      return NextResponse.json({ message: res1.message }, { status: res1.status });
    }

    const owner_id: string = res1.message;

    const res2: Response = await NodeService.get_node_id_by_link(path.slice(1), owner_id, token.user_id);

    if (res2.status != 200) {
      return NextResponse.json({ message: res2.message }, { status: res2.status });
    }

    const node_id: string = res2.message;

    const res3: Response = await NodeService.save(node_id, content, token.user_id);

    return NextResponse.json({ message: res3.message }, { status: res3.status });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
