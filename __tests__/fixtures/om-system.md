# OM recipe metadata fixtures

`om-system.json` contains only numeric profile settings. Color1 and mono1 came from camera-original PEN JPEGs. The COLOR4, white-balance, shading, and MONO4 cases reproduce a controlled camera sequence: COLOR4 stores PictureMode 17, MONO4 stores 18, A2/M3 stores the WB pair `[2, -3]`, and color shading +3 changes tag `0x053a` to 3. The WB pair is `[A, G]`: positive values mean amber and green; negative values mean blue and magenta.

Tests pack these values into minimal OM SYSTEM and Olympus MakerNotes and anonymous JPEGs. They cover both header layouts and byte orders, bounds, missing settings, and recipe matching without the original files. Other camera tags establish parser compatibility; active-profile camera-original checks use the supplied PEN files. No photos, GPS coordinates, serial numbers, capture times, or unrelated metadata are included.
