import { createCameraKey, Camera } from '@/camera';
import { createLensKey, Lens } from '@/lens';
import { useCallback } from 'react';
import { useAppState } from '@/app/AppState';
import { Album } from '@/album';

export default function useCategoryCounts() {
  const { categoriesWithCounts } = useAppState();

  const recentsCount = categoriesWithCounts?.recents?.count ?? 0;

  const getYearsCount = useCallback((year: string) => {
    const yearCounts = categoriesWithCounts?.years ?? {};
    return yearCounts[year];
  }, [categoriesWithCounts]);

  const getCameraCount = useCallback((camera: Camera) => {
    const cameraCounts = categoriesWithCounts?.cameras ?? {};
    return cameraCounts[createCameraKey(camera)];
  }, [categoriesWithCounts]);

  const getLensCount = useCallback((lens: Lens) => {
    const lensCounts = categoriesWithCounts?.lenses ?? {};
    return lensCounts[createLensKey(lens)];
  }, [categoriesWithCounts]);

  const getAlbumCount = useCallback((album: Album) => {
    const albumCounts = categoriesWithCounts?.albums ?? {};
    return albumCounts[album.slug];
  }, [categoriesWithCounts]);

  const getTagCount = useCallback((tag: string) => {
    const tagCounts = categoriesWithCounts?.tags ?? {};
    return tagCounts[tag];
  }, [categoriesWithCounts]);

  const getRecipeCount = useCallback((recipe: string) => {
    const recipeCounts = categoriesWithCounts?.recipes ?? {};
    return recipeCounts[recipe];
  }, [categoriesWithCounts]);

  const getFilmCount = useCallback((film: string) => {
    const filmCounts = categoriesWithCounts?.films ?? {};
    return filmCounts[film];
  }, [categoriesWithCounts]);

  const getFocalLengthCount = useCallback((focalLength: number) => {
    const focalLengthCounts = categoriesWithCounts?.focalLengths ?? {};
    return focalLengthCounts[focalLength];
  }, [categoriesWithCounts]);

  return {
    recentsCount,
    getYearsCount,
    getCameraCount,
    getLensCount,
    getAlbumCount,
    getTagCount,
    getRecipeCount,
    getFilmCount,
    getFocalLengthCount,
  };
}
