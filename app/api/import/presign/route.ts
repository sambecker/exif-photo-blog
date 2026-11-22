import { auth } from '@/auth/server';
import { CURRENT_STORAGE } from '@/app/config';
import { PATH_API_VERCEL_BLOB_UPLOAD } from '@/app/path';
import { ACCEPTED_PHOTO_FILE_TYPES } from '@/photo';
import {
  baseUrlForStorage,
  generateFileNameWithId,
  getSignedUrlForKey,
} from '@/platforms/storage';
import { z } from 'zod';

export const runtime = 'nodejs';

const schema = z.object({
  extension: z.string()
    .transform(extension => extension.toLowerCase())
    .refine(extension =>
      ACCEPTED_PHOTO_FILE_TYPES.includes(`image/${extension}`)),
});

export async function POST(request: Request) {
  if (!(await auth())?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const requestContentType = request.headers.get('content-type') ?? '';
  if (
    requestContentType.split(';')[0].trim().toLowerCase() !==
    'application/json'
  ) {
    return new Response('Expected application/json', { status: 415 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }
  const result = schema.safeParse(json);
  if (!result.success) {
    return new Response(
      `Accepted file types: ${ACCEPTED_PHOTO_FILE_TYPES.join(', ')}`,
      { status: 400 },
    );
  }

  const { extension } = result.data;
  const key = `${generateFileNameWithId('upload')}.${extension}`;
  const uploadUrl = `${baseUrlForStorage(CURRENT_STORAGE)}/${key}`;
  const contentType = extension === 'jpg' ? 'image/jpeg' : `image/${extension}`;

  if (CURRENT_STORAGE === 'vercel-blob') {
    return Response.json({
      uploadUrl,
      contentType,
      pathname: key,
      handleUploadUrl: PATH_API_VERCEL_BLOB_UPLOAD,
    }, { headers: { 'Cache-Control': 'no-store' } });
  }

  const putUrl = await getSignedUrlForKey(key, 'PUT');
  return Response.json({
    uploadUrl,
    contentType,
    putUrl,
  }, { headers: { 'Cache-Control': 'no-store' } });
}
