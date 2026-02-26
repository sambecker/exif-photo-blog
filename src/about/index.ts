export interface AboutInsert {
  id: number
  title?: string
  subhead?: string
  description?: string
  photoIdAvatar?: string
  photoIdHero?: string
}

export interface About extends AboutInsert {
  createdAt: Date
  updatedAt: Date
}
