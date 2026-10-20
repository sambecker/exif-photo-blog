# PEN metadata fixtures

`om-pen.json` contains only numeric profile settings. Color1 and mono1 were extracted from the supplied original Downloads JPEGs. The COLOR4, WB, shading, and MONO4 cases reproduce the controlled card sequence recorded in `docs/om-recipe-metadata.md`; that card was unmounted before implementation.

The tests pack these values into minimal MakerNotes. No photos, GPS coordinates, serial numbers, capture times, or unrelated metadata are included. Endian, bounds, missing-setting, and canonical-gallery tests do not depend on the original files remaining mounted.
