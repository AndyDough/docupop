import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT file_name, file_content FROM documents WHERE id = $1', [id]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const { file_name, file_content } = result.rows[0];
    const headers = new Headers();
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename="${file_name}"`);

    return new NextResponse(file_content, { headers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error downloading document' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM documents WHERE id = $1 RETURNING *', [id]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error deleting document' }, { status: 500 });
  }
}
