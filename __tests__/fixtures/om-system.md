# OM recipe metadata fixtures

`om-system.json` contains only numeric profile settings. Color1 and mono1 were extracted from the supplied original Downloads JPEGs. The COLOR4, WB, shading, and MONO4 cases reproduce the controlled card sequence recorded in `docs/om-recipe-metadata.md`; that card was unmounted before implementation.

The tests pack these values into minimal OM SYSTEM and Olympus MakerNotes, then wrap them in anonymous JPEGs to check extraction across camera makes and models. No photos, GPS coordinates, serial numbers, capture times, or unrelated metadata are included. Endian, bounds, missing-setting, and canonical-gallery tests do not depend on the original files remaining mounted. Tests of other camera tags establish parser compatibility; the supplied originals came from a PEN.
