export interface PlaceAutocomplete {
  id: string
  text: string
  secondary?: string
}

export interface Place {
  id: string
  name: string
  nameFormatted: string
  link: string
  location?: Location
  viewport?: { low: Location, high: Location }
}

type Location = {
  latitude: number
  longitude: number
}

export const convertPlaceToAutocomplete = (
  place?: Place,
): PlaceAutocomplete | undefined => place
  ? { id: place.id, text: place.name }
  : undefined;
