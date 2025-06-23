// src/lib/auth/validation.ts
import { getImmichClient } from '@/platforms/immich/client';
import type { ImmichSharedLinkInfo } from '@/platforms/immich/client';

export interface ShareContext {
  shareKey: string;
  albumId: string;
  albumName?: string;
  allowDownload?: boolean;
  allowUpload?: boolean;
  expiresAt?: Date;
  createdAt: Date;
}

export async function validateShareKey(
  shareKey: string): Promise<ShareContext | null> {
  try {
    if (!shareKey || shareKey.trim() === '') {
      console.error('[Auth] Invalid share key:', shareKey);
      return null;
    }

    const client = getImmichClient();
    const shareInfo: ImmichSharedLinkInfo = await client.
      getSharedLinkInfo(shareKey);

    if (shareInfo.expiresAt) {
      const expiresDate = new Date(shareInfo.expiresAt);
      if (new Date() > expiresDate) {
        console.error('[Auth] Expired:', expiresDate.toISOString());
        return null;
      }
    }

    const context: ShareContext = {
      shareKey: shareKey,
      albumId: shareInfo.album?.id || '',
      albumName: shareInfo.album?.albumName,
      allowDownload: shareInfo.allowDownload,
      allowUpload: shareInfo.allowUpload,
      expiresAt: shareInfo.expiresAt ?
        new Date(shareInfo.expiresAt) : undefined,
      createdAt: new Date(),
    };

    return context;

  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('404') ||
        error.message.includes('not found')) {
        console.error('[Auth] share link not exist');
        return null;
      }

      if (error.message.includes('401') ||
        error.message.includes('unauthorized')) {
        console.error('[Auth] share link unauthorized');
        return null;
      }

      if (error.message.includes('403') ||
        error.message.includes('forbidden')) {
        console.error('[Auth] share link forbidden');
        return null;
      }
    }

    return null;
  }
}
