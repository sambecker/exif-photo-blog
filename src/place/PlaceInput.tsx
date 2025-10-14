import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { getPlaceAutoCompleteAction, getPlaceDetailsAction } from './actions';
import { useDebounce } from 'use-debounce';
import { Place, PlaceAutocomplete } from '.';
import Spinner from '@/components/Spinner';

export default function PlaceInput({
  initialPlace,
  setPlace,
  setIsLoadingPlace,
  className,
}: {
  initialPlace?: PlaceAutocomplete
  setPlace?: (place?: Place) => void
  setIsLoadingPlace?: (isLoading: boolean) => void
  className?: string
}) {
  const places = useRef<Record<string, PlaceAutocomplete>>(initialPlace
    ? { [initialPlace.id]: initialPlace }
    : {});

  const [placeId, setPlaceId] = useState(initialPlace?.id ?? '');
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [inputText, setInputText] = useState('');
  const [placeOptions, setPlaceOptions] =
    useState<ComponentProps<typeof FieldsetWithStatus>['tagOptions']>([]);

  const [inputTextDebounced] = useDebounce(inputText, 500);

  useEffect(() => {
    if (placeId && placeId !== initialPlace?.id) {
      setIsLoadingPlace?.(true);
      getPlaceDetailsAction(placeId)
        .then(setPlace)
        .finally(() => setIsLoadingPlace?.(false));
    }
  }, [placeId, setPlace, setIsLoadingPlace, initialPlace?.id]);

  useEffect(() => {
    if (inputTextDebounced) {
      setIsLoadingPlaces(true);
      getPlaceAutoCompleteAction(inputTextDebounced)
        .then(options => {
          options.forEach(option => {
            places.current[option.id] = option;
          });
          setPlaceOptions(options.map(option => ({
            value: option.id,
            label: option.text,
            annotation: option.secondary,
          })));
        })
        .finally(() => {
          setIsLoadingPlaces(false);
        });
    }
  }, [inputTextDebounced]);

  // Clear autocomplete when there's no input text
  useEffect(() => {
    if (!inputText) { setPlaceOptions([]); }
  }, [inputText]);

  // Clear place detail when id is removed
  useEffect(() => {
    if (!placeId) { setPlace?.(undefined); }
  }, [placeId, setPlace]);

  return (
    <FieldsetWithStatus
      id="place-input"
      label="Location"
      className={className}
      tagOptions={placeOptions}
      value={placeId}
      onChange={setPlaceId}
      tagOptionsLabelOverride={(placeId) => places.current[placeId]?.text}
      tagOptionsOnInputTextChange={setInputText}
      tagOptionsLimit={1}
      tagOptionsAllowNewValues={false}
      tagOptionsAccessory={isLoadingPlaces &&
        <Spinner size={16} className="mr-1 shrink-0" />}
      tagOptionsShouldParameterize={false}
    />
  );
}
