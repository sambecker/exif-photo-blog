'use client';

import PhotoShareModal from '@/photo/PhotoShareModal';
import TagShareModal from '@/tag/TagShareModal';
import CameraShareModal from '@/camera/CameraShareModal';
import FilmShareModal from '@/film/FilmShareModal';
import FocalLengthShareModal from '@/focal/FocalLengthShareModal';
import { useAppState } from '@/app/AppState';
import RecipeShareModal from '@/recipe/RecipeShareModal';
import LensShareModal from '@/lens/LensShareModal';
import YearShareModal from '@/years/YearShareModal';
import RecentsShareModal from '@/recents/RecentsShareModal';

export default function ShareModals() {
  const { shareModalProps = {} } = useAppState();
  
  const {
    photo,
    photos,
    count,
    dateRange,
    recent,
    year,
    camera,
    lens,
    tag,
    recipe,
    film,
    focal,
  } = shareModalProps;

  if (photo) {
    return <PhotoShareModal {...{
      photo,
      recent,
      year,
      camera,
      lens,
      tag,
      recipe,
      film,
      focal,
    }} />;
  } else if (photos) {
    const attributes = {photos, count, dateRange};
    if (recent) {
      return <RecentsShareModal {...{ ...attributes }} />;
    } else if (year) {
      return <YearShareModal {...{ year, ...attributes }} />;
    } else if (camera) {
      return <CameraShareModal {...{ camera, ...attributes }} />;
    } else if (lens) {
      return <LensShareModal {...{ lens, ...attributes }} />;
    } else if (tag) {
      return <TagShareModal {...{ tag, ...attributes }} />;
    } else if (film) {
      return <FilmShareModal {...{ film, ...attributes }} />;
    } else if (recipe) {
      return <RecipeShareModal {...{ recipe, ...attributes }} />;
    } else if (focal !== undefined) {
      return <FocalLengthShareModal {...{ focal, ...attributes }} />;
    }
  }
}
