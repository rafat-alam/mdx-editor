import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { content, query, model } = await req.json();

    if (!query) {
      return NextResponse.json({ message: 'Missing currentQuery' }, { status: 400 });
    }

    const gen_model = genAI.getGenerativeModel({ 
      model: model,
      systemInstruction: 'you are a document updatetor or generator on previous document you can generate new one on basis of query, if there is no update pass-on the previous content as it is. You are been given with a MDX document and your response shoud me in MDX as normally you send it in MDX.'
    });

    const prompt = content
      ? `Previous content:\n${content}\n\nNow update or answer with this new input:\n${query}`
      : query;

    const result = await gen_model.generateContent(prompt);

    return NextResponse.json({
      message: result.response.candidates?.[0]?.content?.parts?.[0]?.text,
    }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'INTERNAL SERVER ERROR!' }, { status: 500 });
  }
}
