import { GetPhotosOptions } from '@/photo/db';
import { Photo, PhotoDateRange } from '@/photo';
import { Tags } from '@/tag';
import { Cameras } from '@/camera';
import { Lenses } from '@/lens';
import { Recipes } from '@/recipe';
import { Films } from '@/film';
import { FocalLengths } from '@/focal';

export interface PhotoDataSource {
  getPhotos(options: GetPhotosOptions): Promise<Photo[]>;
  getPhotosNearId(photoId: string, options: GetPhotosOptions): Promise<{
    photos: Photo[];
    indexNumber?: number;
  }>;
  getPhotosMeta(options?: GetPhotosOptions): Promise<{
    count: number; dateRange?: PhotoDateRange
  }>;
  getPublicPhotoIds(options?: { limit?: number }): Promise<string[]>;
  getPhotoIdsAndUpdatedAt(): Promise<Array<{ id: string; updatedAt: Date }>>;
  getPhoto(id: string, includeHidden?: boolean): Promise<Photo | undefined>;

  // Categories
  getUniqueCameras(): Promise<Cameras>;
  getUniqueLenses(): Promise<Lenses>;
  getUniqueTags(): Promise<Tags>;
  getUniqueRecipes(): Promise<Recipes>;
  getUniqueFilms(): Promise<Films>;
  getUniqueFocalLengths(): Promise<FocalLengths>;

  getRecipeTitleForData(
    data: string | object,
    film: string): Promise<string | undefined>;
  getPhotosNeedingRecipeTitleCount(
    data: string,
    film: string,
    photoIdToExclude?: string): Promise<number>;
}