'use client';

import PhotoShareModal from '@/photo/PhotoShareModal';
import TagShareModal from '@/tag/TagShareModal';
import CameraShareModal from '@/camera/CameraShareModal';
import FilmSimulationShareModal from '@/simulation/FilmSimulationShareModal';
import FocalLengthShareModal from '@/focal/FocalLengthShareModal';
import { useAppState } from '@/state/AppState';
import RecipeShareModal from '@/recipe/RecipeShareModal';

export default function ShareModals() {
  const { shareModalProps = {} } = useAppState();
  
  const {
    photo,
    photos,
    count,
    dateRange,
    tag,
    camera,
    simulation,
    recipe,
    focal,
  } = shareModalProps;

  if (photo) {
    return <PhotoShareModal {...{
      photo,
      tag,
      camera,
      simulation,
      recipe,
      focal,
    }} />;
  } else if (photos) {
    const attributes = {photos, count, dateRange};
    if (tag) {
      return <TagShareModal {...{ tag, ...attributes }} />;
    } else if (camera) {
      return <CameraShareModal {...{ camera, ...attributes }} />;
    } else if (simulation) {
      return <FilmSimulationShareModal {...{ simulation, ...attributes }} />;
    } else if (recipe) {
      return <RecipeShareModal {...{ recipe, ...attributes }} />;
    } else if (focal !== undefined) {
      return <FocalLengthShareModal {...{ focal, ...attributes }} />;
    } 
  }
}
