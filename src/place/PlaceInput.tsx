import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { useEffect, useState } from 'react';
import { getPlaceAutoCompleteAction } from './actions';
import { useDebounce } from 'use-debounce';

export default function PlaceInput() {
  const [text, setText] = useState('');
  const [places, setPlaces] = useState<
    Awaited<ReturnType<typeof getPlaceAutoCompleteAction>>
  >([]);

  const [textDebounced] = useDebounce(text, 500);

  console.log({ text, textDebounced });

  useEffect(() => {
    if (textDebounced) {
      getPlaceAutoCompleteAction(textDebounced).then(places => {
        console.log({ places });
        setPlaces(places);
      });
    }
  }, [textDebounced]);

  useEffect(() => {
    if (!text) { setPlaces([]); }
  }, [text]);

  return <FieldsetWithStatus
    label="Place"
    tagOptions={places.map(place => ({
      value: `${place.id}-${place.text}`,
      label: place.text,
      annotation: place.secondary,
    }))}
    tagOptionsOnInputTextChange={setText}
    value={text}
    tagOptionsLimit={1}
  />;
}
