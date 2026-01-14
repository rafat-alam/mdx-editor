import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username, repo, query } = await req.json();
    
    if (typeof username !== "string" || typeof repo !== "string" || typeof query !== "string") {
      return NextResponse.json({ message: 'Bad Request!' }, { status: 400 });
    }

    if (!query || !username || !repo) {
      return NextResponse.json({ message: 'Missing fields!' }, { status: 400 });
    }

    return NextResponse.json({ message: "RAG REPO comming soon!" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
