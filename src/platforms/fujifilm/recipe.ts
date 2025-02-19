export interface FujifilmRecipe {
  dynamicRange: number
  highlight: number
  shadow: number
  color: number
  noiseReduction: number
  sharpening: number
  clarity: number
  grainEffect: {
    type: 'strong' | 'medium' | 'weak'
    size: 'small' | 'large'
  }
  colorChromeEffect: 'strong' | 'medium' | 'weak'
  colorChromeEffectBlue: 'off' | 'weak' | 'strong'
  whiteBalance: {
    type: string
    red: number
    blue: number
  }
}
