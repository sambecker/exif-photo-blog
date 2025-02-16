import {
  getGitHubMeta,
  getGitHubPublicFork,
} from '@/platforms/github';
import { TEMPLATE_REPO_OWNER, TEMPLATE_REPO_NAME } from '@/app-core/config';

describe('GitHub', () => {
  it('fetches base repo meta', async () => {
    const meta = await getGitHubMeta({
      owner: TEMPLATE_REPO_OWNER,
      repo: TEMPLATE_REPO_NAME,
    });
    expect(meta).toBeDefined();
    expect(meta.urlRepo).toBeDefined();
    expect(meta.isForkedFromBase).toEqual(false);
    expect(meta.isBehind).toEqual(false);
    expect(meta.isBaseRepo).toBe(true);
  });
  it('fetches fork meta', async () => {
    const fork = await getGitHubPublicFork();
    const metaFork = await getGitHubMeta(fork);
    expect(metaFork.isForkedFromBase).toEqual(true);
  });
  it('handles nonexistent repos', async () => {
    const meta = await getGitHubMeta({
      owner: 'nonexistent',
      repo: 'nonexistent',
    });
    expect(meta).toBeDefined();
    expect(meta.urlRepo).toBeDefined();
    expect(meta.isForkedFromBase).toEqual(false);
    expect(meta.isBehind).toBeUndefined();
  });
  it('handles fetch errors', async () => {
    const meta = await getGitHubMeta({
      owner: 'gibberish / / *',
      repo: 'bad text for a url.com',
    });
    expect(meta).toBeDefined();
    expect(meta.urlRepo).toBeDefined();
    expect(meta.isForkedFromBase).toEqual(false);
    expect(meta.isBehind).toBeUndefined();
  });
});
