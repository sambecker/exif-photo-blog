'use server';

import { createLensKey } from '@/lens';
import { getDataForCategories } from './data';

export const getCountsForCategoriesAction = async () => {
  const [
    cameras,
    lenses,
    tags,
    recipes,
    filmSimulations,
    focalLengths,
  ] = await Promise.all(getDataForCategories());

  return {
    cameras: cameras.reduce((acc, camera) => {
      acc[camera.cameraKey] = camera.count;
      return acc;
    }, {} as Record<string, number>),
    lenses: lenses.reduce((acc, lens) => {
      acc[createLensKey(lens.lens)] = lens.count;
      return acc;
    }, {} as Record<string, number>),
    tags: tags.reduce((acc, tag) => {
      acc[tag.tag] = tag.count;
      return acc;
    }, {} as Record<string, number>),
    recipes: recipes.reduce((acc, recipe) => {
      acc[recipe.recipe] = recipe.count;
      return acc;
    }, {} as Record<string, number>),
    filmSimulations: filmSimulations.reduce((acc, filmSimulation) => {
      acc[filmSimulation.simulation] = filmSimulation.count;
      return acc;
    }, {} as Record<string, number>),
    focalLengths: focalLengths.reduce((acc, focalLength) => {
      acc[focalLength.focal] = focalLength.count;
      return acc;
    }, {} as Record<string, number>),
  };
};
