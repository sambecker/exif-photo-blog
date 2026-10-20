# PEN recipe metadata findings

Inspected the supplied camera-original `PA200002.JPG` and `PA200003.JPG` with ExifTool 13.55 and the repository's installed `ts-exif-parser`. Both identify their make as `OM Digital Solutions`, model as `PEN`, and firmware as `Version 1.0`. The parser preserves trailing spaces in the make and model strings.

## Settings found

| Setting | PA200002.JPG (color) | PA200003.JPG (mono) |
| --- | --- | --- |
| Picture mode, raw | `9 2` | `12 2` |
| Twelve color adjustments | `1 1 0 0 0 0 1 1 0 0 1 1` | All zero, inactive |
| Mono filter | Inactive | No Filter |
| Mono filter strength | Inactive | 2, inactive with No Filter |
| Film grain | Inactive | Medium |
| Film hue | Inactive | Normal |
| Shared shading tag (named MonochromeVignetting) | 0 | 0 |
| Highlights / shadows / midtones | +3 / -3 / 0 | +3 / -3 / 0 |
| Profile sharpness | 0 | -1 |
| Profile contrast | 0 | 0 |
| White balance | Auto (Keep Warm Color Off) | Auto (Keep Warm Color Off) |
| White-balance temperature, raw | 0 (Auto) | 0 (Auto) |
| WhiteBalanceBracket, raw | `2 1` | `2 1` |

Color adjustment order is Yellow, Orange, Orange-red, Red, Magenta, Violet, Blue, Blue-cyan, Cyan, Green-cyan, Green, Yellow-green. The stored range is -5 to +5.

Noise Filter and Gradation were also present in these files, but the agreed recipe scope excludes them from display, completeness checks, and gallery identity.

Both files contain color and mono profile settings, including settings for the inactive mode. Their selected Auto white-balance mode matches, but their measured red/blue levels differ. Gallery equality therefore needs explicit rules for active settings and selected white balance versus measured results.

## Extraction feasibility

The existing EXIF parser exposes a 19,396-byte MakerNote buffer in each file. The header starts with `OM SYSTEM`; the byte-order marker is at offset 12, the first entry count at offset 16, and entries at offset 18. The CameraSettings subdirectory is tag `0x2020`, with an offset relative to the MakerNote. Reading its signed and unsigned values reproduces the relevant ExifTool output without adding an extraction dependency.

Relevant CameraSettings tags include `PictureMode` (`0x0520`), `ToneLevel` (`0x052e`), `MonochromeProfileSettings` (`0x0537`), `FilmGrainEffect` (`0x0538`), `ColorProfileSettings` (`0x0539`), `MonochromeVignetting` (`0x053a`), and `MonochromeColor` (`0x053b`). These mappings come from the installed ExifTool `Olympus.pm`; the public reference is [Olympus tag documentation](https://exiftool.org/TagNames/Olympus.html).

These first two files establish a baseline, not coverage of every profile, setting, or firmware. The later controlled card series below resolves WB axes, nonzero color shading, and fourth-slot recognition. Neutral and non-neutral camera-screen photos now provide visual graph references. The second PictureMode value is not yet interpreted; no agreed recipe field depends on its meaning.

## Controlled card series

The later files came directly from `/Volumes/OM SYSTEM/DCIM/100OMSYS/`. They are different images from the earlier Downloads files with the same basenames. The user supplied them in response to the requested COLOR4 baseline, A2/M3 WB test, +3 shading test, and MONO4 detection test.

| Card file | Raw PictureMode | Raw WB pair | Shading tag 0x053a |
| --- | --- | --- | --- |
| PA200001.JPG | `17 2` | `3 2` | 0 |
| PA200002.JPG | `17 2` | `2 -3` | 0 |
| PA200003.JPG | `17 2` | `2 -3` | +3 |
| PA200004.JPG | `18 2` | `0 0` | 0 |

The A2/M3 test establishes the WB pair as `[A, G]`: positive A is amber, negative A blue, positive G green, and negative G magenta. Baseline file 1 actually retained A3/G2 rather than neutral WB; the WB-test mapping does not depend on a neutral baseline.

The shading test changes `0x053a` from 0 to +3, while `0x053c` stays zero. Thus `0x053a`, named MonochromeVignetting by ExifTool, also holds the color shading effect.

For this PEN, explicit COLOR4 produces PictureMode `17 2`, and MONO4 produces `18 2`. ExifTool's generic description of 17 as Art Mode does not apply to the supplied COLOR4 files. Recognition must account for the verified camera-specific meaning rather than excluding these files through the generic label.

All four files have zero shadow/midtone/highlight controls, zero twelve-color adjustments, and zero sharpness/contrast. They do not provide a non-neutral tone-graph reference.

## Display references and limits

The [current PEN manual](https://cdn.sanity.io/files/ipox1240/live/2f4680f605a98437907f609b8e0f5fc996f0c401.pdf), pages 246 and 249, shows blue (B) to the left, amber/red (A) to the right, green (G) above, and magenta (M) below. The controlled card series now establishes the raw pair order and signs too. No further WB-axis sample is needed for that mapping.

Pages 240 and 349 describe independent shadow, midtone, and highlight adjustments but provide no numerical interpolation or transfer function. The three selected values are recoverable. The supplied camera-screen references are sufficient to build and visually check a camera-style settings graph. They do not establish OM's internal image-processing transfer function or its exact interpolation at every possible combination; numerical setting labels remain exact.

The user's subsequent camera-screen photo shows COLOR4 with Sh 0, Mid 0, and Hi 0: a straight bottom-left to top-right diagonal, horizontal and vertical center grid lines, and two visible cross-shaped markers. This provides a neutral visual reference, not evidence for the curve's shape at nonzero settings. The screen also displays "Color Vivid" below COLOR4. Page 241 calls that sidebar item Color/Vivid and defines it as the twelve-color saturation control; page 236 shows it beneath a different preset. It does not establish a separate base-style field.

The final camera-screen photo shows MONO1 with Sh -4, Mid 0, and Hi +4. It retains the diagonal reference line and shows a smooth S-shaped curve: below the diagonal in the shadow region, crossing at the grid center, and above the diagonal in the highlight region. The endpoints remain at the lower-left and upper-right corners. Two cross-shaped markers sit on the curved shadow and highlight portions. This closes the requested non-neutral visual-reference check; no further camera samples are required to finish the design interview.

Pages 236, 237, and 240 confirm a -5 to +5 shading effect for color and mono profiles. The controlled card series establishes `0x053a` as the shared shading-effect tag. `ShadingCompensation` is a lens-correction switch and must not be substituted for the recipe's shading effect.

No Gradation sample is needed for this feature: Gradation is outside the recipe contract. Its raw interpretation must not affect whether a recipe is complete.

Pages 236 and 237 list four explicit COLOR profiles and four explicit MONO profiles. COLOR4 has a factory name referring to Natural and MONO4 to Monotone. They still count as explicit profiles under the agreed scope. Their raw values are now verified in the controlled card series; older decoder labels must not determine whether they qualify.

Page 192 also describes Low ISO Processing as a separate camera-level preference. The agreed recipe scope excludes it, Noise Filter, Gradation, and long-exposure Noise Reduction.

## Existing-photo cost

Photo and gallery reads use stored metadata. Existing recipe extraction fetches the entire stored original with caching disabled, then parses it. These samples are about 10.5 MB and 14.1 MB, so downloading old originals is material even though decoding and hashing their small settings payloads are cheap.

Normal admin Sync can also generate blur data, AI content, and image color data. The recipe-only admin batch avoids those steps and persists extracted settings once. Missing OM recipe data is not currently part of the admin update queue criteria.

The initial decoder supports the verified automatic and preset WB modes plus explicitly selected Kelvin. One-touch WB modes are withheld because the selected slot alone cannot identify its saved calibration. Unknown modes or missing selected Kelvin produce no public recipe.
