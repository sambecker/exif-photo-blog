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
  extension: z.enum(['jpg', 'jpeg', 'png', 'heic', 'webp']),
});

export async function POST(request: Request) {
  if (!(await auth())?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }
  const result = schema.safeParse(json);
  if (!result.success) {
    return new Response('Invalid extension', { status: 400 });
  }

  const { extension } = result.data;
  const key = `${generateFileNameWithId('upload')}.${extension}`;
  const uploadUrl = `${baseUrlForStorage(CURRENT_STORAGE)}/${key}`;

  if (CURRENT_STORAGE === 'vercel-blob') {
    // Same token endpoint and file types as admin uploads
    if (!ACCEPTED_PHOTO_FILE_TYPES.includes(`image/${extension}`)) {
      return new Response('Vercel Blob uploads accept jpg, jpeg, or png', {
        status: 400,
      });
    }
    return Response.json({
      uploadUrl,
      pathname: key,
      handleUploadUrl: PATH_API_VERCEL_BLOB_UPLOAD,
    }, { headers: { 'Cache-Control': 'no-store' } });
  }

  const putUrl = await getSignedUrlForKey(key, 'PUT');
  return Response.json({
    uploadUrl,
    putUrl,
  }, { headers: { 'Cache-Control': 'no-store' } });
}
