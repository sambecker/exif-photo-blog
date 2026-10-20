# Group OM photos by matching recipe settings

OM recipe galleries group photos by matching recipe settings rather than a user-assigned name or numbered camera slot. This lets visitors find photos made with the same recipe even when that recipe occupied different slots. Color and mono recipes remain distinct, and exposure compensation does not affect membership because it describes the shot rather than the recipe.

Derive gallery identity from a hash of normalized active profile settings. Include selected white-balance mode and adjustments, and include Kelvin when explicitly selected. Exclude measured Auto white-balance results, inactive settings, and stored minimum/maximum ranges. Noise Filter, Gradation, Low ISO Processing, and long-exposure noise reduction do not participate in matching. Missing those excluded fields does not make a recipe incomplete. Do not assign an exact-match gallery to incomplete recipes.

Use `om-pen-v1-{color|mono}-{sha256}` as the persistent identity, hashing the validated settings in a fixed serialization order. Version the identity rules so future changes can be handled explicitly: changes to these rules can change gallery membership and URLs. Initial camera support remains limited to the PEN; support for future models requires a separate decision about compatibility.

Initially, visitors discover OM recipe galleries through recipe links on photos and in viewers. Do not add unnamed groups to the global Recipes sidebar or command menu; many identical text labels would need a separate discovery design.
