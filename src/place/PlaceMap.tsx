'use client';

import { OSM } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { useMemo, useRef } from 'react';
import { Map, View, TileLayer } from 'react-openlayers';
import { Place } from '.';
import { boundingExtent } from 'ol/extent';

import 'react-openlayers/dist/index.css'; // for css

const MULTIPLIER = 2;

export default function PlaceMap({
  place,
  width,
  height,
  monochrome,
}: {
  place: Place
  width: number
  height: number
  monochrome?: boolean
}) {
  const osm = useRef(new OSM());

  const centerLon = place.location?.longitude ?? 0;
  const centerLat = place.location?.latitude ?? 0;
  const highLon = place.viewport?.high?.longitude ?? 0;
  const highLat = place.viewport?.high?.latitude ?? 0;
  const lowLon = place.viewport?.low?.longitude ?? 0;
  const lowLat = place.viewport?.low?.latitude ?? 0;

  const center = useMemo(() =>
    fromLonLat([centerLon, centerLat])
  , [centerLon, centerLat]);

  const extent = useMemo(() =>
    boundingExtent([
      fromLonLat([highLon, highLat]),
      fromLonLat([lowLon, lowLat]),
    ])
  , [highLon, highLat, lowLon, lowLat]);

  return (
    <div style={{ width, height }}>
      <div style={{
        transform: `scale(${1 / MULTIPLIER})`,
        transformOrigin: 'top left',
      }}>
        <Map
          controls={[]}
          interactions={[]}
          style={{
            width: width * MULTIPLIER,
            height: height * MULTIPLIER,
            ...monochrome && {
              filter: 'saturate(0) contrast(1.05) brightness(1.05)',
            },
          }}
        > 
          <TileLayer source={osm.current} />
          <View {...{
            center,
            extent,
            // Zoom must be defined despite setting extent
            zoom: 1,
          }} />
        </Map>
      </div>
    </div>
  );
}
