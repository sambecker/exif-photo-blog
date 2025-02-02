import { getGitHubMetaWithFallback, getGitHubPublicFork } from '@/admin/github';
import { TEMPLATE_BASE_OWNER, TEMPLATE_BASE_REPO } from '@/site/config';

describe('GitHub', () => {
  it('fetches base repo meta', async () => {
    const meta = await getGitHubMetaWithFallback({
      owner: TEMPLATE_BASE_OWNER,
      repo: TEMPLATE_BASE_REPO,
    });
    expect(meta).toBeDefined();
    expect(meta.url).toBeDefined();
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
    expect(meta.url).toBeDefined();
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
    expect(meta.url).toBeDefined();
    expect(meta.isForkedFromBase).toEqual(false);
    expect(meta.label).toEqual('Unknown');
    expect(meta.description).toEqual('Unknown');
    expect(meta.isBehind).toBeUndefined();
  });
});
