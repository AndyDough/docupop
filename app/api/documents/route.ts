import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await pool.connect();
    const userResult = await client.query('SELECT id FROM users WHERE email = $1', [session.user.email]);
    if (userResult.rows.length === 0) {
      client.release();
      return NextResponse.json([]);
    }
    const userId = userResult.rows[0].id;
    const result = await client.query(
      'SELECT * FROM documents WHERE user_id = $1',
      [userId]
    );
    client.release();
    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json({ error: 'Error fetching documents' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const fileBuffer = await file.arrayBuffer();
  const fileContent = Buffer.from(fileBuffer);

  try {
    const client = await pool.connect();
    const userResult = await client.query('SELECT id FROM users WHERE email = $1', [session.user.email]);
    let userId;
    if (userResult.rows.length === 0) {
      const newUserResult = await client.query('INSERT INTO users (email) VALUES ($1) RETURNING id', [session.user.email]);
      userId = newUserResult.rows[0].id;
    } else {
      userId = userResult.rows[0].id;
    }

    const result = await client.query(
      'INSERT INTO documents (user_id, file_name, file_content) VALUES ($1, $2, $3) RETURNING *',
      [userId, file.name, fileContent]
    );
    client.release();
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating document' }, { status: 500 });
  }
}

export async function DELETE() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const client = await pool.connect();
        const userResult = await client.query('SELECT id FROM users WHERE email = $1', [session.user.email]);
        if (userResult.rows.length === 0) {
            client.release();
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        const userId = userResult.rows[0].id;
        await client.query('DELETE FROM documents WHERE user_id = $1', [userId]);
        client.release();
        return NextResponse.json({ message: 'Documents deleted' });
    } catch {
        return NextResponse.json({ error: 'Error deleting documents' }, { status: 500 });
    }
}
