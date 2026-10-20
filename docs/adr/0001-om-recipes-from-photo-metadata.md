# Identify OM recipes by their settings

Initial OM recipe support targets the new OM SYSTEM PEN. Represent color and mono recipes through the settings recorded in each photo, without using numbered profile slots or user-assigned names as recipe identity: the same slot can hold different settings. Follow the existing Fujifilm recipe interaction: the "Color recipe" or "Mono recipe" text links to its gallery, and a separate adjacent sliders button opens its settings viewer. The viewer's recipe heading also links to the gallery. This requires separate settings for each recipe kind rather than treating an OM profile as another film name.

Recognize only explicit Color Profile and Monochrome Profile modes. Ordinary Natural, Vivid, Art, and other picture modes do not qualify merely because the file retains profile settings.

Read recipes automatically from camera-original JPEG metadata. When recipe metadata is absent or a defining setting cannot be recovered, omit the recipe control and exclude the photo from recipe galleries; do not add manual recipe entry or substitute neutral values. This keeps the displayed recipe tied to the uploaded photo's metadata. The required fields and tag mappings are recorded in the metadata findings.

The viewer shows readable settings alongside wheels and graphs that follow the OM System UI. It does not need a copy button. White balance, tone controls, shading, sharpness, and contrast belong to the recipe. Noise Filter, Gradation, Low ISO Processing, and long-exposure noise reduction are outside the recipe definition and viewer; exposure compensation remains part of the photo's exposure data.

Open the viewer as a responsive modal, with visual panels beside each other on larger screens and stacked on phones. All displayed controls are read-only.

Use the supplied neutral and Sh -4 / Mid 0 / Hi +4 camera-screen photos as visual references for the tone graph, including its diagonal reference, center grid, markers, and numeric annotations. The graph presents selected settings; it is not a calibrated image-processing transfer function.

Support new uploads and normal Sync, plus a one-time admin batch for existing PEN photos. The batch reads each stored original once per successful attempt, saves recipe data, and skips unrelated AI or image processing.
