import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pool from '@/lib/db';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const prompts = {
  finance: 'Summarize this financial document. Extract key financial metrics, such as revenue, profit, and loss. Identify any trends or anomalies.',
  executive: 'Provide a high-level executive summary of this document. Focus on the main points, action items, and key takeaways.',
  medical: 'Summarize this medical document. Extract patient information, diagnosis, and treatment plan. Do not include any personally identifiable information.',
  general: 'Summarize this document.',
};

export async function POST(req: NextRequest) {
  const { documentId, model } = await req.json();

  if (!documentId || !model) {
    return NextResponse.json({ error: 'Missing documentId or model' }, { status: 400 });
  }

  if (!prompts[model as keyof typeof prompts]) {
    return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
  }

  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT file_content FROM documents WHERE id = $1', [documentId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const fileContent = Buffer.from(result.rows[0].file_content).toString('utf-8');

    const geminiModel = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const prompt = `${prompts[model as keyof typeof prompts]}\n\n${fileContent}`;
    const summaryResult = await geminiModel.generateContent(prompt);
    const summary = summaryResult.response.text();

    const updateResult = await client.query(
      'UPDATE documents SET summarized_data = $1 WHERE id = $2 RETURNING *',
      [summary, documentId]
    );

    return NextResponse.json(updateResult.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error summarizing document' }, { status: 500 });
  } finally {
    if (client) {
      client.release();
    }
  }
}
