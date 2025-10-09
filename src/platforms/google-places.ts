import { GOOGLE_PLACES_API_KEY } from '@/app/config';
import {
  checkRateLimitAndThrow as _checkRateLimitAndThrow,
} from '@/platforms/rate-limit';

const URL_BASE = 'https://places.googleapis.com/v1/places';

const checkRateLimitAndThrow = () =>
  _checkRateLimitAndThrow({ identifier: 'google-places-query' });

const headers = {
  'Content-Type': 'application/json',
  'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY ?? '',
};

export interface Place {
  id: string
  text: string
  secondary?: string
}

export interface PlaceDetail {
  id: string
  name: string
  link: string
  location?: Location
  viewport?: { low: Location, high: Location }
}

type Location = {
  latitude: number
  longitude: number
}

export const getPlaceAutoComplete = async (input: string) => {
  await checkRateLimitAndThrow();
  return fetch(
    `${URL_BASE}:autocomplete`, {
      method: 'POST',
      body: JSON.stringify({ input }),
      headers,
    },
  )
    .then(response => response.json())
    .then(json => (json?.suggestions ?? []).map(({ placePrediction }: any) => ({
      id: placePrediction?.placeId,
      text: placePrediction?.structuredFormat?.mainText?.text,
      secondary: placePrediction?.structuredFormat?.secondaryText?.text,
    })) as Place[]);
};

const FIELDS = [
  'id',
  'displayName',
  'location',
  'viewport',
  'googleMapsUri',
];

export const getPlaceDetails = async (id: string) => {
  await checkRateLimitAndThrow();
  return fetch(
    `${URL_BASE}/${id}?fields=${FIELDS.join(',')}`, {
      headers,
    },
  )
    .then(response => response.json())
    .then(json => ({
      id: json?.id,
      name: json?.displayName?.text as string,
      link: json?.googleMapsUri as string,
      ...json?.location &&
        { location: json.location as Location },
      ...json?.viewport &&
        { viewport: json?.viewport as { low: Location, high: Location } },
    } as PlaceDetail));
};
