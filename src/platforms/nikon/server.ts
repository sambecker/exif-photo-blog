// MakerNote tag IDs and values referenced from:
// - exiftool.org/TagNames/Nikon.html

import type { ExifData } from 'ts-exif-parser';
import { MAKE_NIKON } from '.';

export const isExifForNikon = (data: ExifData) => {
  return data.tags?.Make?.toLocaleUpperCase() === MAKE_NIKON;
};

export const getNikonPictureControlName = (
  bytes: Buffer,
): string | undefined => {
  // Start searching after 8 bytes of padding
  const start = 8;

  // Helper function to format Picture Control Names
  const formatPictureControlName = (name: string): string => {
    // If the name is all uppercase (ignoring underscores),
    // convert to title case
    const noUnderscore = name.replace(/_/g, '');
    if (noUnderscore === noUnderscore.toUpperCase()) {
      return name
        .replace(/_/g, ' ')
        .split(' ')
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(' ');
    } else if (!name.includes('_') && !name.includes(' ')) {
      // If the name is a single word, split camelCase/PascalCase and digits
      const split = name
        .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase or PascalCase
        .replace(/([A-Za-z])([0-9])/g, '$1 $2') // letters to digits
        .replace(/([0-9])([A-Za-z])/g, '$1 $2'); // digits to letters
      return split
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } else {
      // Otherwise, just replace underscores with spaces
      return name.replace(/_/g, ' ');
    }
  };

  // Look for two consecutive version strings (e.g., "0310", "0310")
  for (let i = start; i <= bytes.length - 28; i++) {
    const version1 = bytes.slice(i, i + 4).toString('ascii');
    const version2 = bytes.slice(i + 4, i + 8).toString('ascii');
    if (/^\d{4}$/.test(version1) && /^\d{4}$/.test(version2)) {
      const nameBytes = bytes.slice(i + 8, i + 28);
      const name = nameBytes.toString('ascii').replace(/\0+$/, '').trim();
      if (
        name &&
        name.length > 0 &&
        name.length <= 20 &&
        /^[A-Za-z0-9_\s\-&]+$/.test(name) &&
        !/^\d{4}$/.test(name)
      ) {
        return formatPictureControlName(name);
      }
    }
  }

  // Fallback: try to find just a single version followed by name,
  // but skip if the previous 4 bytes are also a version (to avoid overlap)
  for (let i = start; i <= bytes.length - 24; i++) {
    const version = bytes.slice(i, i + 4).toString('ascii');
    const prevBytes = bytes.slice(i - 4, i).toString('ascii');
    if (/^\d{4}$/.test(version) && !/^\d{4}$/.test(prevBytes)) {
      const nameBytes = bytes.slice(i + 4, i + 24);
      const name = nameBytes.toString('ascii').replace(/\0+$/, '').trim();
      if (
        name &&
        name.length > 0 &&
        name.length <= 20 &&
        /^[A-Za-z0-9_\s\-&]+$/.test(name) &&
        !/^\d{4}$/.test(name)
      ) {
        return formatPictureControlName(name);
      }
    }
  }

  return undefined;
};
