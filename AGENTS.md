<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Test coverage

Keep tests proportional to the change. Small changes (roughly 50 lines or fewer), UI/styling, config, dependency bumps, behavior-preserving refactors, and glue code (server actions, routes, code that executes database queries, storage, auth) should not come with new tests. Reserve tests for significant changes to pure logic (including SQL string builders), and for logic bug fixes add one or a few regression cases to the existing file in `__tests__/`. A refactor that extracts a new pure function, especially one with security or privacy implications, may add a few cases. Test code should rarely exceed the size of the change it covers. Full guidance: `.cursor/skills/proportional-test-coverage/SKILL.md`.
