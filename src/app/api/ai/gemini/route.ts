import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { content, query, model } = await req.json();

    if (typeof content !== "string" || typeof query !== "string" || typeof model !== "string") {
      return NextResponse.json({ message: 'Bad Request!' }, { status: 400 });
    }

    if (model !== 'gemini-2.0-flash-lite' && model !== 'gemini-2.0-flash'
        && model !== 'gemini-2.5-flash-lite' && model !== 'gemini-2.5-flash'
        && model !== 'gemini-3-flash-preview') {
      return NextResponse.json({ message: 'Bad Request!' }, { status: 400 });
    }

    if (!query) {
      return NextResponse.json({ message: 'Missing fields!' }, { status: 400 });
    }

    const gen_model = genAI.getGenerativeModel({ 
      model: model,
      systemInstruction: 'You are a document updater and generator that operates strictly on an existing MDX document based on a given query or instruction; update or generate content only when explicitly required by the query while preserving all unaffected content exactly as provided, return the original document unchanged if no update is necessary, do not introduce unsolicited changes, reformatting, explanations, comments, or metadata, ensure the response is valid MDX returned exclusively in MDX format, and do not start the response with ```mdx or end it with ``` under any circumstances.'
    });

    const prompt = `Previous content:\n${content ? content : "null"}\n\nNow update or answer with this query:\n${query}`;

    const result = await gen_model.generateContent(prompt);

    return NextResponse.json({
      message: result.response.candidates?.[0]?.content?.parts?.[0]?.text,
    }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
