'use client';

import PhotoShareModal from '@/photo/PhotoShareModal';
import TagShareModal from '@/tag/TagShareModal';
import CameraShareModal from '@/camera/CameraShareModal';
import FilmShareModal from '@/film/FilmShareModal';
import FocalLengthShareModal from '@/focal/FocalLengthShareModal';
import { useAppState } from '@/state/AppState';
import RecipeShareModal from '@/recipe/RecipeShareModal';
import LensShareModal from '@/lens/LensShareModal';
import YearShareModal from '@/years/YearShareModal';

export default function ShareModals() {
  const { shareModalProps = {} } = useAppState();
  
  const {
    photo,
    photos,
    count,
    dateRange,
    camera,
    lens,
    tag,
    film,
    recipe,
    focal,
    year,
  } = shareModalProps;

  if (photo) {
    return <PhotoShareModal {...{
      photo,
      camera,
      lens,
      tag,
      recipe,
      film,
      focal,
      year,
    }} />;
  } else if (photos) {
    const attributes = {photos, count, dateRange};
    if (tag) {
      return <TagShareModal {...{ tag, ...attributes }} />;
    } else if (camera) {
      return <CameraShareModal {...{ camera, ...attributes }} />;
    } else if (lens) {
      return <LensShareModal {...{ lens, ...attributes }} />;
    } else if (film) {
      return <FilmShareModal {...{ film, ...attributes }} />;
    } else if (recipe) {
      return <RecipeShareModal {...{ recipe, ...attributes }} />;
    } else if (focal !== undefined) {
      return <FocalLengthShareModal {...{ focal, ...attributes }} />;
    } else if (year) {
      return <YearShareModal {...{ year, ...attributes }} />;
    }
  }
}
