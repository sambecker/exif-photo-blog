interface Oklch {
  l: number
  c: number
  h: number
}

export interface PhotoColorData {
  average: Oklch
  background: Oklch
  accent: Oklch
}
