import { randomUUID } from 'crypto';
import path from 'path';

/** Uploads land in public Vercel Blob storage, so the inputs are constrained here. */

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

export const DOCUMENT_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.txt',
  ...IMAGE_EXTENSIONS,
];

/**
 * Build a storage key the caller cannot control.
 *
 * The client-supplied name is used only for its extension: `path.basename`
 * strips any directory component, so `../../etc/passwd` cannot escape the
 * prefix, and the stored name is a fresh UUID.
 */
export function safeBlobKey(
  prefix: string,
  clientFilename: string,
  allowedExtensions: string[],
): string | null {
  const ext = path.extname(path.basename(clientFilename)).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return null;
  }
  return `${prefix}/${randomUUID()}${ext}`;
}

/**
 * Reject oversized bodies up front using Content-Length.
 *
 * This is an early-exit, not a guarantee — a chunked request can lie. Blob
 * storage enforces its own ceiling behind it.
 */
export function exceedsSizeLimit(request: Request): boolean {
  const declared = Number(request.headers.get('content-length') ?? 0);
  return declared > MAX_UPLOAD_BYTES;
}
