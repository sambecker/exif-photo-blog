import { CategoryQueryMeta } from '@/category';

export interface Album {
  id: string
  title: string
  slug: string
  subhead?: string
  description?: string
  locationName?: string
  latitude?: number
  longitude?: number
}

type AlbumWithMeta = {
  title: string
  slug: string
} & CategoryQueryMeta;

export type Albums = AlbumWithMeta[];
