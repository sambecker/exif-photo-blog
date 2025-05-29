import { createCameraKey } from '@/camera';
import { createLensKey } from '@/lens';
import { Camera } from '@/camera';
import { Lens } from '@/lens';
import { useAppState } from '@/state/AppState';
import { useCallback } from 'react';
import { FujifilmSimulation } from '@/platforms/fujifilm/simulation';

export default function useCategoryCounts() {
  const { categoriesWithCounts } = useAppState();

  const getCameraCount = useCallback((camera: Camera) => {
    const cameraCounts = categoriesWithCounts?.cameras ?? {};
    return cameraCounts[createCameraKey(camera)];
  }, [categoriesWithCounts]);

  const getLensCount = useCallback((lens: Lens) => {
    const lensCounts = categoriesWithCounts?.lenses ?? {};
    return lensCounts[createLensKey(lens)];
  }, [categoriesWithCounts]);

  const getTagCount = useCallback((tag: string) => {
    const tagCounts = categoriesWithCounts?.tags ?? {};
    return tagCounts[tag];
  }, [categoriesWithCounts]);

  const getRecipeCount = useCallback((recipe: string) => {
    const recipeCounts = categoriesWithCounts?.recipes ?? {};
    return recipeCounts[recipe];
  }, [categoriesWithCounts]);

  const getFilmCount = useCallback((film: FujifilmSimulation) => {
    const filmCounts = categoriesWithCounts?.films ?? {};
    return filmCounts[film];
  }, [categoriesWithCounts]);

  const getFocalLengthCount = useCallback((focalLength: number) => {
    const focalLengthCounts = categoriesWithCounts?.focalLengths ?? {};
    return focalLengthCounts[focalLength];
  }, [categoriesWithCounts]);

  return {
    getCameraCount,
    getLensCount,
    getTagCount,
    getRecipeCount,
    getFilmCount,
    getFocalLengthCount,
  };
}
