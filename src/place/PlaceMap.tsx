'use client';

import { OSM } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { useMemo, useRef } from 'react';
import { Map, View, TileLayer } from 'react-openlayers';
import 'react-openlayers/dist/index.css'; // for css
import { Place } from '.';

export default function PlaceMap({
  place,
}: {
  place: Place
}) {
  const osm = useRef(new OSM());

  const center = useMemo(() => fromLonLat([
    place.location?.longitude ?? 0,
    place.location?.latitude ?? 0,
  ]), [
    place.location?.longitude,
    place.location?.latitude,
  ]);

  return (
    <Map controls={[]} interactions={[]}> 
      <TileLayer source={osm.current} />
      <View
        center={center}
        zoom={8}
      />
    </Map>
  );
}
