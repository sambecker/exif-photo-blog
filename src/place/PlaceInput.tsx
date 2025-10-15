import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { getPlaceAutoCompleteAction, getPlaceDetailsAction } from './actions';
import { useDebounce } from 'use-debounce';
import { Place, PlaceAutocomplete } from '.';
import Spinner from '@/components/Spinner';
import IconPlace from '@/components/icons/IconPlace';

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

  return (
    <FieldsetWithStatus
      id="place-input"
      label="Location"
      className={className}
      isModified={placeId !== initialPlace?.id}
      tagOptions={placeOptions}
      value={placeId}
      onChange={id => {
        setPlaceId(id);
        if (id) {
          setIsLoadingPlace?.(true);
          getPlaceDetailsAction(id)
            .then(setPlace)
            .finally(() => setIsLoadingPlace?.(false));
        } else {
          setPlace?.(undefined);
        }
      }}
      tagOptionsLabelOverride={(placeId) => places.current[placeId]?.text}
      tagOptionsDefaultIconSelected={<IconPlace
        size={11}
        className="text-main translate-x-0.5"
      />}
      tagOptionsOnInputTextChange={text => {
        setInputText(text);
        // Clear autocomplete immediately when there's no input text
        if (!text) {
          setPlaceOptions([]);
        }
      }}
      tagOptionsLimit={1}
      tagOptionsAllowNewValues={false}
      tagOptionsAccessory={isLoadingPlaces &&
        <Spinner size={16} className="mr-1 shrink-0" />}
      tagOptionsShouldParameterize={false}
    />
  );
}
