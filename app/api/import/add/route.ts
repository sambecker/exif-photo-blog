import { auth } from '@/auth/server';
import { addUpload } from '@/photo/add-upload';
import { CURRENT_STORAGE } from '@/app/config';
import { baseUrlForStorage } from '@/platforms/storage';
import {
  generateLocalNaivePostgresString,
  generateLocalPostgresString,
} from '@/utility/date';
import { z } from 'zod';

export const runtime = 'nodejs';
export const maxDuration = 60;

const schema = z.object({
  uploadUrl: z.string(),
  title: z.string().optional(),
  hidden: z.boolean().default(true),
  tags: z.string().optional(),
  excludeFromFeeds: z.boolean().optional(),
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
    return new Response('Invalid photo', { status: 400 });
  }

  const { uploadUrl, title, hidden, tags, excludeFromFeeds } = result.data;
  const baseUrl = baseUrlForStorage(CURRENT_STORAGE);
  if (!baseUrl || !uploadUrl.startsWith(`${baseUrl}/`)) {
    return new Response('Invalid upload URL', { status: 400 });
  }
  const key = uploadUrl.slice(baseUrl.length + 1);
  if (!/^upload-[a-zA-Z0-9]{16}\.(jpg|jpeg|png|heic|webp)$/.test(key)) {
    return new Response('Invalid upload URL', { status: 400 });
  }

  const photo = await addUpload({
    url: uploadUrl,
    title,
    hidden: String(hidden),
    tags,
    excludeFromFeeds: String(excludeFromFeeds ?? false),
    takenAtLocal: generateLocalPostgresString(),
    takenAtNaiveLocal: generateLocalNaivePostgresString(),
    shouldRevalidateAllKeysAndPaths: true,
  });
  if (!photo) {
    return new Response('Unable to add photo', { status: 422 });
  }
  return Response.json(photo, { headers: { 'Cache-Control': 'no-store' } });
}
