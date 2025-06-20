import { cache } from 'react';
import { cookies } from 'next/headers';
import { IMMICH_SHARE_ALBUM_ID_COOKIE, IMMICH_SHARE_KEY_COOKIE } from '@/app/paths';

// 使用 React cache 确保在同一请求中只计算一次
export const getAlbumId = cache(async (): Promise<string> => {
  try {
    // 最简单的方案：直接从 cookie 读取 album_id
    const cookieStore = await cookies();
    const albumId = cookieStore.get(IMMICH_SHARE_ALBUM_ID_COOKIE)?.value;

    if (albumId) {
      console.log('从 cookie 获取到 albumId:', albumId);
      return albumId;
    } else {
      const fallbackId = process.env.IMMICH_ALBUM_ID || '';
      console.log('没有 cookie，使用环境变量 albumId:', fallbackId);
      return fallbackId;
    }
  } catch (error) {
    // 在非服务器环境或出错时回退到环境变量
    const fallbackId = process.env.IMMICH_ALBUM_ID || '';
    console.warn('获取 albumId 失败，回退到环境变量:', fallbackId, 'Error:', error);
    return fallbackId;
  }
});

// 同步版本：仅用于特殊情况
export function getAlbumIdSync(): string {
  const fallbackId = process.env.IMMICH_ALBUM_ID || '';
  console.log('同步版本直接返回环境变量:', fallbackId);
  return fallbackId;
}

export const getSharedKey = cache(async (): Promise<string> => {
  try {
    // 从 cookie 中获取共享密钥
    const cookieStore = await cookies();
    const shareKey = cookieStore.get(IMMICH_SHARE_KEY_COOKIE)?.value;

    if (shareKey) {
      console.log('从 cookie 获取到 shareKey:', shareKey);
      return shareKey;
    } else {
      console.warn('没有找到 shareKey cookie');
      return '';
    }
  } catch (error) {
    console.error('获取 shareKey 失败:', error);
    return '';
  }
}
);