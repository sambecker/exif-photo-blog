import { AsyncLocalStorage } from 'async_hooks';
import { headers } from 'next/headers';
import { IMMICH_SHARE_KEY_HEADER, IMMICH_SHARE_ALBUM_ID_HEADER } from '@/app/paths';

export interface RequestContext {
  albumId?: string;
  shareKey?: string;
}

export const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export async function getRequestContext(): Promise<RequestContext> {
  // 优先从 AsyncLocalStorage 获取
  const context = asyncLocalStorage.getStore();
  if (context) {
    console.log('从 AsyncLocalStorage 获取上下文:', context);
    return context;
  }

  console.log('没有 AsyncLocalStorage 上下文，尝试从 headers 创建新的上下文');
  // 如果没有上下文，从 headers 创建一个
  const newContext = await createContextFromHeaders();

  // 重要：将新创建的上下文设置回 AsyncLocalStorage
  return new Promise((resolve) => {
    asyncLocalStorage.run(newContext, () => {
      resolve(newContext);
    });
  });
}

async function createContextFromHeaders(): Promise<RequestContext> {
  try {
    const headersList = await headers();
    const shareKey = headersList.get(IMMICH_SHARE_KEY_HEADER) ?? undefined;
    const albumId = headersList.get(IMMICH_SHARE_ALBUM_ID_HEADER) ?? undefined;

    const context = { shareKey, albumId };
    console.log('创建上下文:', context);
    return context;
  } catch (error) {
    console.error('从 headers 创建上下文失败:', error);
    return {};
  }
}