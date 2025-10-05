import { GOOGLE_PLACES_API_KEY } from '@/app/config';
import {
  checkRateLimitAndThrow as _checkRateLimitAndThrow,
} from '@/platforms/rate-limit';

const checkRateLimitAndThrow = () =>
  _checkRateLimitAndThrow({ identifier: 'google-places-query' });

const headers = {
  'Content-Type': 'application/json',
  'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY ?? '',
};

type Location = {
  latitude: number
  longitude: number
}

export const getPlaceAutocomplete = async (
  input: string,
) => {
  await checkRateLimitAndThrow();
  return fetch(
    'https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      body: JSON.stringify({ input }),
      headers,
    },
  )
    .then(response => response.json())
    .then(json => json.suggestions.map(({ placePrediction }: any) => ({
      id: placePrediction.placeId,
      text: placePrediction.structuredFormat.mainText.text,
      secondary: placePrediction.structuredFormat.secondaryText.text,
    })) as {
      id: string
      text: string
      secondary?: string
    }[]);
};

export const getPlaceDetails = async (id: string) => {
  await checkRateLimitAndThrow();
  return fetch(
    // eslint-disable-next-line max-len
    `https://places.googleapis.com/v1/places/${id}?fields=id,displayName,location,viewport,googleMapsUri`, {
      headers,
    },
  )
    .then(response => response.json())
    .then(json => ({
      ...json,
      displayName: json.displayName.text,
    }) as unknown as {
      id: string
      displayName: string
      location: Location
      viewport: { low: Location, high: Location }
      googleMapsUri: string
    });
};
