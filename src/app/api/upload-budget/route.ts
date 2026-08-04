import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { randomUUID } from 'crypto';
import os from 'os';
import path from 'path';
import { getSessionUser } from '@/lib/session';
import { MAX_UPLOAD_BYTES } from '@/lib/uploads';

const ALLOWED_EXTENSIONS = ['.xlsx', '.xls', '.csv'];

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'File too large.' }, { status: 413 });
    }

    // basename strips any directory component, so a name like
    // "../../app/route.ts" cannot escape the temp directory.
    const ext = path.extname(path.basename(file.name)).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: 'Unsupported file type.' }, { status: 415 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // The generated name means one upload can never overwrite another's file,
    // and os.tmpdir is the only writable location on Vercel.
    const filePath = path.join(os.tmpdir(), `budget-${user.id}-${randomUUID()}${ext}`);

    await writeFile(filePath, buffer);

    // TODO: Implement Excel parsing and calculation logic here.
    // The path is deliberately not returned to the client.
    return NextResponse.json({ message: 'File uploaded successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 });
  }
}
