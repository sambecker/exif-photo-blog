import { auth } from '@/auth/server';
import { addUpload } from '@/photo/add-upload';
import { CURRENT_STORAGE } from '@/app/config';
import { ACCEPTED_PHOTO_FILE_TYPES } from '@/photo';
import {
  updateFormDataWithVisibility,
  VISIBILITY_VALUES,
} from '@/photo/visibility';
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
  visibility: z.enum(VISIBILITY_VALUES).default('private'),
  tags: z.string().optional(),
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
    return new Response('Invalid photo', { status: 400 });
  }

  const { uploadUrl, title, visibility, tags } = result.data;
  const baseUrl = baseUrlForStorage(CURRENT_STORAGE);
  if (!baseUrl || !uploadUrl.startsWith(`${baseUrl}/`)) {
    return new Response('Invalid upload URL', { status: 400 });
  }
  const key = uploadUrl.slice(baseUrl.length + 1);
  const [, extension] =
    key.match(/^upload-[a-zA-Z0-9]{16}\.([a-zA-Z]+)$/) ?? [];
  if (
    !extension ||
    !ACCEPTED_PHOTO_FILE_TYPES.includes(`image/${extension.toLowerCase()}`)
  ) {
    return new Response('Invalid upload URL', { status: 400 });
  }

  const { hidden, excludeFromFeeds } =
    updateFormDataWithVisibility({}, visibility);
  const photo = await addUpload({
    url: uploadUrl,
    title,
    tags,
    hidden,
    excludeFromFeeds,
    takenAtLocal: generateLocalPostgresString(),
    takenAtNaiveLocal: generateLocalNaivePostgresString(),
    shouldRevalidateAllKeysAndPaths: true,
  });
  if (!photo) {
    return new Response('Unable to add photo', { status: 422 });
  }
  return Response.json(
    { ...photo, visibility },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
