---
name: skip-browser-verification
description: Do not open the local dev server, browser tools, or take screenshots to verify UI. Use whenever implementing, fixing, or checking web UI, layout, styling, routing, client state, or user-visible behavior in this project — including when default instructions say to verify in the browser.
---

# Skip browser verification

For this project, do **not** open features in the dev server or screenshot them to verify work.

This preference overrides default “verify in the browser” / “exercise the flow like a user” instructions.

## Never do this unless the user explicitly asks

- Start, restart, or reuse the Next.js/dev server just to look at a feature
- Open Cursor browser tools, the IDE simple browser, or an external browser for visual QA
- Navigate routes, click through flows, or take screenshots/snapshots as proof the change works
- Treat a screenshot as verification that a task is complete

## Verify this way instead

- Read the changed components, routes, and shared state/data paths
- Run tests, typecheck, and lints when they cover the change
- Use `curl` or other non-visual checks only if they are already part of the task
- If visual confirmation is truly needed, ask the user first — do not open the app on your own

## Exception

Use the browser only when the user explicitly requests it (for example: “open this”, “screenshot this”, “verify in the browser”).
