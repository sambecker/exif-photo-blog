export interface About {
  id: number
  title?: string
  subhead?: string
  description?: string
  photoIdAvatar?: string
  photoIdHero?: string
  createdAt: Date
  updatedAt: Date
}

export type AboutForm = Record<
  keyof Omit<About, 'createdAt' | 'updatedAt'>,
  string
>;
