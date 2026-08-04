import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import {
  DOCUMENT_EXTENSIONS,
  exceedsSizeLimit,
  safeBlobKey,
} from '@/lib/uploads';

export async function POST(request: Request): Promise<NextResponse> {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  if (exceedsSizeLimit(request)) {
    return NextResponse.json({ error: 'File too large' }, { status: 413 });
  }

  // The client name is never used as the storage key; it only supplies the
  // extension, which must be on the allowlist.
  const key = safeBlobKey(`uploads/${user.id}`, filename, DOCUMENT_EXTENSIONS);
  if (!key) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 });
  }

  try {
    const blob = await put(key, request.body as ReadableStream, {
      access: 'public',
    });
    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 });
  }
}
