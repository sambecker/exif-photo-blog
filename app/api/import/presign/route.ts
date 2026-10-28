import { auth } from '@/auth/server';
import { CURRENT_STORAGE } from '@/app/config';
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

  if (CURRENT_STORAGE === 'vercel-blob') {
    return new Response('Presigned uploads require S3, R2, or MinIO', {
      status: 400,
    });
  }

  const key = `${generateFileNameWithId('upload')}.${result.data.extension}`;
  const putUrl = await getSignedUrlForKey(key, 'PUT');
  return Response.json({
    uploadUrl: `${baseUrlForStorage(CURRENT_STORAGE)}/${key}`,
    putUrl,
  }, { headers: { 'Cache-Control': 'no-store' } });
}
