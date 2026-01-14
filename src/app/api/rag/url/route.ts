import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    let { url, query } = await req.json();

    if (!Array.isArray(url) || !url.every(p => typeof p === "string") || !url.every(p => p !== "")) {
      return NextResponse.json({ message: "Bad Request!" }, { status: 400 });
    }

    query = query.trim();

    if (typeof query !== "string") {
      return NextResponse.json({ message: 'Bad Request!' }, { status: 400 });
    }

    if (!query) {
      return NextResponse.json({ message: 'Missing fields!' }, { status: 400 });
    }

    return NextResponse.json({ message: "RAG URL comming soon!" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
