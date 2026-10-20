# Keep OM settings separate from Fujifilm recipe data

Store PEN settings, gallery keys, and extraction versions in dedicated photo columns. Existing Fujifilm recipe JSON and user-assigned titles have their own assumptions throughout editing, title propagation, overlays, and sharing. A separate OM representation avoids requiring every Fujifilm consumer to understand a new settings shape. Recipe routes select OM groups by their validated key while named recipes continue to use titles. An index on the OM key supports gallery queries without downloading originals.

Persist the extraction version for absent/incomplete results as well as successful imports. Failed fetches and writes remain retryable. This makes the one-time backfill resumable and prevents repeatedly downloading photos whose required metadata is unavailable.
