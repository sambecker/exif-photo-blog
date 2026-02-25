import { AboutInsert } from '.';

export const convertFormDataToAbout = (formData: FormData): AboutInsert => {
  const id = formData.get('id');
  return {
    id: id ? Number(id) : 0,
    title: (formData.get('title') as string) || undefined,
    subhead: (formData.get('subhead') as string) || undefined,
    description: (formData.get('description') as string) || undefined,
    photoIdAvatar: (formData.get('photoIdAvatar') as string) || undefined,
    photoIdHero: (formData.get('photoIdHero') as string) || undefined,
  };
};
