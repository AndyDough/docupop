import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT file_name, summarized_data FROM documents WHERE id = $1', [id]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const { file_name, summarized_data } = result.rows[0];
    const headers = new Headers();
    headers.set('Content-Type', 'text/plain');
    headers.set('Content-Disposition', `attachment; filename="${file_name}-summary.txt"`);

    return new NextResponse(summarized_data, { headers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error downloading summary' }, { status: 500 });
  }
}
