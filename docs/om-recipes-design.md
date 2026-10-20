# OM SYSTEM and Olympus recipes

Implemented from the agreed design and supplied PEN originals. The viewer has been checked against the supplied OM UI and camera-screen references at desktop, tablet, and phone widths.

## Recipe content

Support explicit Color and Monochrome Profile modes on OM SYSTEM and Olympus cameras that record the required settings. Recognize camera makes without restricting model names; validate the active profile and its settings before publishing a recipe. A recipe describes the active settings, without a name or numbered-slot identity.

- Shared settings: selected white-balance mode and adjustments, Kelvin when explicitly selected, shadows, midtones, highlights, shading effect, sharpness, and contrast.
- Color settings: twelve color adjustments.
- Mono settings: filter color and applicable strength, film grain, and film hue.

Exclude exposure compensation, Noise Filter, Gradation, Low ISO Processing, and long-exposure noise reduction from recipe identity and the recipe viewer. Ignore retained settings for the inactive mode and inactive filter strength. Keep camera exposure data in its existing display.

Extract recipes automatically from JPEG metadata. A missing or uninterpretable defining setting hides the recipe control and excludes the photo from recipe galleries. Missing data must not become a neutral default. There is no manual entry or copy button.

## Viewer and gallery

Follow the existing Fujifilm recipe interaction: "Color recipe" or "Mono recipe" links to its matching gallery; the separate adjacent +/× button opens the settings viewer. The viewer heading also links to the gallery.

Use the existing Fujifilm recipe UI: the + button rotates to × while open, and the read-only card uses the same translucent white surface, blur, saturation, rounded corners, close icon, and light tiles. Open the card over the photo with the existing overlay hook on larger screens; phones and gallery views use a modal so the header and close control remain visible. Show readable values, the color or mono wheel, tone graph, white-balance grid, and remaining profile controls. Place visual panels side by side when space allows and stack them on phones. Match the supplied neutral and non-neutral graph references while retaining exact numeric labels.

Show the source photo's EXIF camera make and model in the dialog, using the same formatting as the photo's camera link. A gallery dialog uses the selected photo, or its first matching photo when none is selected. Camera identity remains outside recipe matching.

Group photos by a versioned hash of normalized active recipe settings. Include recipe kind and selected WB settings, not measured Auto-WB results, slot numbers, or stored value ranges. Equal active settings belong to the same gallery even when stored in different profile slots or compatible cameras. Preserve existing Fujifilm recipe behavior.

Initially, discover OM galleries through photo and viewer links. Do not list unnamed groups individually in the Recipes sidebar or command menu. Follow existing gallery conventions for photo visibility, pagination, headers, and sharing.

## Existing photos

Support normal Sync and a one-time admin batch for existing OM SYSTEM and Olympus photos. Fetch each stored original once per successful attempt, persist the recipe and identity, and avoid unrelated AI or image processing. Distinguish imported, absent/incomplete, and failed results; allow failed attempts to be retried. Public page requests use stored recipe data.

## Evidence

Both modern OM SYSTEM and Olympus MakerNote headers use the shared CameraSettings tags. Anonymous fixtures cover both headers and byte orders. Published OM-3, E-P7, and PEN-F metadata samples verify the real containers and exclusion of Natural mode with retained profile settings. Active-profile camera-original validation comes from the supplied PEN files.

The supplied originals verify WB axis order and signs, shared color/mono shading storage, and COLOR4/MONO4 metadata recognition. Supplied camera-screen photos establish neutral and S-shaped tone-graph references. Exact internal OM interpolation remains undocumented; it does not block a settings visualization with accurate values and visual review.

See [metadata findings](om-recipe-metadata.md), [recipe scope](adr/0001-om-recipes-from-photo-metadata.md), [matching galleries](adr/0002-group-om-photos-by-recipe-settings.md), and the [glossary](../GLOSSARY.md).
