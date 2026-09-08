import { GOOGLE_PLACES_GEOCODING_API_KEY } from '@/app/config';
import { Place, PlaceAutocomplete } from '@/place';
import {
  checkRateLimitAndThrow as _checkRateLimitAndThrow,
} from '@/platforms/rate-limit';

const URL_PLACES = 'https://places.googleapis.com/v1/places';
const URL_MAPS   = 'https://maps.googleapis.com/maps/api/geocode/json';
const NEARBY_SEARCH_RADIUS_METERS = 500;

type GeocodeType =
  'neighborhood' |
  'sublocality' |
  'sublocality_level_1' |
  'locality' |
  'administrative_area_level_2' |
  'natural_feature' |
  'park' |
  'point_of_interest' |
  'premise' |
  'colloquial_area';

const GEOCODE_PREFERRED_TYPES: GeocodeType[] = [
  'neighborhood',
  'sublocality',
  'sublocality_level_1',
  'locality',
  'natural_feature',
  'park',
];

const checkRateLimitAndThrow = () =>
  _checkRateLimitAndThrow({ identifier: 'google-places-query' });

const headers = {
  'Content-Type': 'application/json',
  'X-Goog-Api-Key': GOOGLE_PLACES_GEOCODING_API_KEY ?? '',
};

const parsePlace = (json: any): Place | undefined =>
  json?.id && json?.displayName?.text
    ? {
      id: json.id,
      name: json.displayName.text,
      nameFormatted: json.displayName.text,
      link: json.googleMapsUri,
      ...json.location &&
        { location: json.location as Location },
      ...json.viewport &&
        { viewport: json.viewport as { low: Location, high: Location } },
    }
    : undefined;

export const getPlaceAutocomplete = async (
  input: string,
): Promise<PlaceAutocomplete[]> => {
  await checkRateLimitAndThrow();
  return fetch(
    `${URL_PLACES}:autocomplete`, {
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

const fetchPlaceDetails = (id: string) =>
  fetch(
    `${URL_PLACES}/${id}?fields=${FIELDS.join(',')}`, {
      headers,
    },
  )
    .then(response => response.json())
    .then(parsePlace);

export const getPlaceDetails = async (id: string): Promise<Place> => {
  await checkRateLimitAndThrow();
  return fetchPlaceDetails(id) as Promise<Place>;
};

const hasType = (types: string[] = [], candidates: string[]) =>
  types.some(type => candidates.includes(type));

const getPlaceIdFromCoordinates = async (
  latitude: number,
  longitude: number,
) => {
  const json = await fetch(
    `${URL_MAPS}?latlng=${latitude},${longitude}&key=${
      GOOGLE_PLACES_GEOCODING_API_KEY ?? ''
    }`,
  )
    .then(response => response.json())
    .catch(() => undefined);

  const results: { place_id?: string, types?: string[] }[] =
    json?.results ?? [];

  return results.find(result =>
    result.place_id && hasType(result.types, GEOCODE_PREFERRED_TYPES),
  )?.place_id ?? results.find(result =>
    result.place_id && !hasType(result.types, ['plus_code']),
  )?.place_id ?? results.find(result => result.place_id)?.place_id;
};

const getNearbyPlaceFromCoordinates = async (
  latitude: number,
  longitude: number,
) => {
  const json = await fetch(
    `${URL_PLACES}:searchNearby`, {
      method: 'POST',
      headers: {
        ...headers,
        'X-Goog-FieldMask': [
          'places.id',
          'places.displayName',
          'places.location',
          'places.viewport',
          'places.googleMapsUri',
        ].join(','),
      },
      body: JSON.stringify({
        maxResultCount: 1,
        rankPreference: 'DISTANCE',
        locationRestriction: {
          circle: {
            center: { latitude, longitude },
            radius: NEARBY_SEARCH_RADIUS_METERS,
          },
        },
      }),
    },
  )
    .then(response => response.json())
    .catch(() => undefined);

  return parsePlace(json?.places?.[0]);
};

export const getPlaceFromCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<Place | undefined> => {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return;
  }

  await checkRateLimitAndThrow();

  const placeId = await getPlaceIdFromCoordinates(latitude, longitude);
  if (placeId) {
    const place = await fetchPlaceDetails(placeId);
    if (place) { return place; }
  }

  return getNearbyPlaceFromCoordinates(latitude, longitude);
};

export const testGooglePlacesConnection = async () => {
  await checkRateLimitAndThrow();

  return getPlaceAutocomplete('Test');
};
