/* eslint-disable max-len */
import type { Config } from 'jest';
import nextJest from 'next/jest.js';
 
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});
 
// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
 
// ESM-only packages (reached transitively via `camelcase-keys` in src/photo)
// that must be transformed instead of ignored under pnpm's nested layout.
const ESM_PACKAGES_TO_TRANSFORM = ['camelcase-keys', 'map-obj', 'camelcase', 'quick-lru', 'nanoid'];
 
// next/jest injects its own `transformIgnorePatterns` (which, with OR
// semantics, re-ignore any package we try to allow-list by merely appending).
// Resolve its config first, then widen the pnpm/node_modules ignore patterns
// so the ESM packages above are transformed too, leaving the SWC transform and
// every other next/jest default untouched.
const createFinalJestConfig = async (): Promise<Config> => {
  const resolved = await createJestConfig(config)();
  const allow = ['geist', ...ESM_PACKAGES_TO_TRANSFORM].join('|');
  const transformIgnorePatterns = (resolved.transformIgnorePatterns ?? []).map(pattern => {
    if (pattern === '/node_modules/.pnpm/(?!(geist)@)') {
      return `/node_modules/.pnpm/(?!(${allow})@)`;
    }
    if (pattern === '/node_modules/(?!.pnpm)(?!(geist)/)') {
      return `/node_modules/(?!.pnpm)(?!(${allow})/)`;
    }
    return pattern;
  });
  return { ...resolved, transformIgnorePatterns };
};
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createFinalJestConfig;
