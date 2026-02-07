import { getPhotosCached } from '@/photo/cache';
import NavClient from './NavClient';
import { NAV_CAPTION, NAV_TITLE } from './config';

export default async function Nav() {
  const photos = await getPhotosCached({ limit: 1 }).catch(() => []);
  return <NavClient
    navTitle={NAV_TITLE}
    navCaption={NAV_CAPTION}
    animate={photos.length > 0}
  />; 
}
