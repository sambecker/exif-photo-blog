import { ReactNode } from 'react';
import { headers } from 'next/headers';
import { asyncLocalStorage } from '@/platforms/immich/lib/context';
import { IMMICH_SHARE_KEY_HEADER, IMMICH_SHARE_ALBUM_ID_HEADER } from '@/app/paths';

interface SharedContextProviderProps {
    children: ReactNode;
}

export default async function SharedContextProvider({
    children
}: SharedContextProviderProps) {
    const headersList = await headers();
    const shareKey = headersList.get(IMMICH_SHARE_KEY_HEADER);
    const albumId = headersList.get(IMMICH_SHARE_ALBUM_ID_HEADER);

    console.log('SharedContextProvider 从 headers 获取:', { shareKey, albumId });

    // 创建上下文
    const context = {
        shareKey: shareKey || undefined,
        albumId: albumId || undefined
    };

    console.log('SharedContextProvider 设置上下文:', context);

    // 关键：使用 asyncLocalStorage.run 并返回 Promise
    return new Promise((resolve) => {
        asyncLocalStorage.run(context, () => {
            resolve(children);
        });
    });
}