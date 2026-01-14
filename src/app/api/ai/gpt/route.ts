import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { content, query, model } = await req.json();

    if (typeof content !== "string" || typeof query !== "string" || typeof model !== "string") {
      return NextResponse.json({ message: 'Bad Request!' }, { status: 400 });
    }

    if (model !== 'gpt-5.2') {
      return NextResponse.json({ message: 'Bad Request!' }, { status: 400 });
    }

    if (!query) {
      return NextResponse.json({ message: 'Missing fields!' }, { status: 400 });
    }

    return NextResponse.json({ message: "GPT-5.2 comming soon!" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
