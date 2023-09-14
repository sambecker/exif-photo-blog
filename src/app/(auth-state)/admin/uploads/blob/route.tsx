import {
  ACCEPTED_PHOTO_FILE_TYPES,
  isUploadPathnameValid,
} from '@/services/blob';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (isUploadPathnameValid(pathname)) {
          return {
            maximumSizeInBytes: 40_000_000,
            allowedContentTypes: ACCEPTED_PHOTO_FILE_TYPES,
          };
        } else {
          throw new Error('Invalid upload');
        }
      },
      onUploadCompleted: async () => {
        revalidatePath('admin/photos');
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
