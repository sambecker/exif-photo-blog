'use client';

import { useEffect, useState } from 'react';

export default function MoreComponents({
  initialOffset = 1,
  itemsPerRequest,
  componentLoader,
}: {
  initialOffset?: number
  itemsPerRequest: number
  componentLoader: (limit: number) => Promise<JSX.Element>
}) {
  const [offset] = useState(initialOffset);
  const [components, setComponents] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const getPhotosLargeComponentAsync = async () => {
      return componentLoader(itemsPerRequest * offset);
    };
    getPhotosLargeComponentAsync().then((component) => {
      setComponents([component]);
    });
  }, [componentLoader, itemsPerRequest, offset]);

  return components;
}
