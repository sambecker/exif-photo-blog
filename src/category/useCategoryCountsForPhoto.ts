import { Photo } from '@/photo';
import useCategoryCounts from './useCategoryCounts';
import { cameraFromPhoto } from '@/camera';
import { lensFromPhoto } from '@/lens';
import { useMemo } from 'react';

export default function useCategoryCountsForPhoto(photo: Photo) {
  const {
    getCameraCount,
    getLensCount,
    getTagCount,
    getRecipeCount,
    getFilmSimulationCount,
    getFocalLengthCount,
  } = useCategoryCounts();

  const camera = cameraFromPhoto(photo);
  const lens = lensFromPhoto(photo);

  const categoryCounts = useMemo(() => ({
    cameraCount: getCameraCount(camera),
    lensCount: getLensCount(lens),
    tagCounts: photo.tags.reduce((acc, tag) => {
      acc[tag] = getTagCount(tag);
      return acc;
    }, {} as Record<string, number>),
    recipeCount: photo.recipeTitle ? getRecipeCount(photo.recipeTitle) : 0,
    simulationCount:
      photo.filmSimulation ? getFilmSimulationCount(photo.filmSimulation) : 0,
    focalCount: photo.focalLength ? getFocalLengthCount(photo.focalLength) : 0,
  }), [
    getCameraCount,
    getLensCount,
    getRecipeCount,
    getFilmSimulationCount,
    getFocalLengthCount,
    getTagCount,
    camera,
    lens,
    photo.tags,
    photo.recipeTitle,
    photo.filmSimulation,
    photo.focalLength,
  ]);

  return categoryCounts;
}
