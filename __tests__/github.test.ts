import {
  getGitHubMetaWithFallback,
  getGitHubPublicFork,
} from '@/platforms/github';
import { TEMPLATE_REPO_OWNER, TEMPLATE_REPO_NAME } from '@/app-core/config';

describe('GitHub', () => {
  it('fetches base repo meta', async () => {
    const meta = await getGitHubMetaWithFallback({
      owner: TEMPLATE_REPO_OWNER,
      repo: TEMPLATE_REPO_NAME,
    });
    expect(meta).toBeDefined();
    expect(meta.urlRepo).toBeDefined();
    expect(meta.isForkedFromBase).toEqual(false);
    expect(meta.label).toBeDefined();
    expect(meta.description).toBeDefined();
    expect(meta.isBehind).toEqual(false);
    expect(meta.isBaseRepo).toBe(true);
  });
  it('fetches fork meta', async () => {
    const fork = await getGitHubPublicFork();
    const metaFork = await getGitHubMetaWithFallback(fork);
    expect(metaFork.isForkedFromBase).toEqual(true);
  });
  it('handles nonexistent repos', async () => {
    const meta = await getGitHubMetaWithFallback({
      owner: 'nonexistent',
      repo: 'nonexistent',
    });
    expect(meta).toBeDefined();
    expect(meta.urlRepo).toBeDefined();
    expect(meta.isForkedFromBase).toEqual(false);
    expect(meta.label).toEqual('Unknown');
    expect(meta.description).toEqual('Unknown');
    expect(meta.isBehind).toBeUndefined();
  });
  it('handles fetch errors', async () => {
    const meta = await getGitHubMetaWithFallback({
      owner: 'gibberish / / *',
      repo: 'bad text for a url.com',
    });
    expect(meta).toBeDefined();
    expect(meta.urlRepo).toBeDefined();
    expect(meta.isForkedFromBase).toEqual(false);
    expect(meta.label).toEqual('Unknown');
    expect(meta.description).toEqual('Unknown');
    expect(meta.isBehind).toBeUndefined();
  });
});
