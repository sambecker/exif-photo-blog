import { GOOGLE_PLACES_API_KEY } from '@/app/config';
import { Place, PlaceAutocomplete } from '@/place';
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

export const getPlaceAutocomplete = async (
  input: string,
): Promise<PlaceAutocomplete[]> => {
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
    })));
};

const FIELDS = [
  'id',
  'displayName',
  'location',
  'viewport',
  'googleMapsUri',
];

export const getPlaceDetails = async (id: string): Promise<Place> => {
  await checkRateLimitAndThrow();
  return fetch(
    `${URL_BASE}/${id}?fields=${FIELDS.join(',')}`, {
      headers,
    },
  )
    .then(response => response.json())
    .then(json => ({
      id: json?.id,
      name: json?.displayName?.text,
      nameFormatted: json?.displayName?.text,
      link: json?.googleMapsUri,
      ...json?.location &&
        { location: json.location as Location },
      ...json?.viewport &&
        { viewport: json?.viewport as { low: Location, high: Location } },
    }));
};

export const testGooglePlacesConnection = async () => {
  await checkRateLimitAndThrow();

  return getPlaceAutocomplete('Test');
};
