---
name: proportional-test-coverage
description: Keeps test additions proportional to the size and risk of a change, and skips tests entirely for small changes. Use whenever writing, fixing, or refactoring code in this project, opening a pull request, or deciding whether to add or expand tests in `__tests__/`.
---

# Proportional test coverage

This repo values small, focused changes. Tests are welcome when they protect meaningful logic, but large test suites attached to small changes are a burden on reviewers and maintainers. When in doubt, write fewer tests.

## Default: no new tests for small changes

Do **not** add tests for:

- Changes of roughly 50 lines or fewer, unless they fix a bug in pure logic (see below)
- UI, layout, styling, copy, or component markup changes
- Config, environment variable, dependency, or build changes
- Refactors that don't change behavior (existing tests should keep passing), unless the refactor extracts a new pure function, especially one with security or privacy implications, in which case a few cases are fine
- Glue code: server actions, route handlers, code that executes database queries, storage/upload wiring, auth

## When tests are appropriate

Add tests only when the change is significant **and** the logic is testable in isolation:

- New or substantially changed pure logic, such as EXIF parsing, camera/lens/film recipe handling, SQL string builders, date, string, URL, or path utilities
- A bug fix in pure logic: add one or a few focused regression cases to the existing test file for that module
- A new feature large enough that a reviewer would reasonably ask "how do we know this works?"

## Keep tests small

- Test code should rarely exceed the size of the change it covers. A 20-line change gets at most a few lines of tests, and usually none.
- Extend the existing file in `__tests__/` rather than creating a new one.
- Prefer a few table-style cases covering the main path and one meaningful edge case over exhaustive permutations.
- Don't add snapshot tests, rendering tests for presentational components, or tests of third-party library behavior.
- Don't build extensive mocks (database, storage, auth, Next.js internals) to test a small change. If testing needs heavy mocking, skip it.
- Don't add large fixtures. Reuse what is already in `__tests__/fixtures/`.

## Existing tests

- Update existing tests when behavior intentionally changes. Don't delete or weaken them to make a change pass.
- Run the relevant existing tests (`pnpm test`) for the area you touched.

## Pull requests

If you skipped tests under this policy, it's fine to say so briefly in the PR description. Maintainers will ask for coverage if they want it.
