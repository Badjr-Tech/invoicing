import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import {
  IMAGE_EXTENSIONS,
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
    return NextResponse.json({ error: 'No filename or file body provided.' }, { status: 400 });
  }

  if (exceedsSizeLimit(request)) {
    return NextResponse.json({ error: 'File too large' }, { status: 413 });
  }

  const key = safeBlobKey(`profile-photos/${user.id}`, filename, IMAGE_EXTENSIONS);
  if (!key) {
    return NextResponse.json({ error: 'Unsupported image type' }, { status: 415 });
  }

  try {
    const blob = await put(key, request.body, { access: 'public' });
    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error(message);
    return NextResponse.json({ error: 'Failed to upload file to Vercel Blob.' }, { status: 500 });
  }
}
