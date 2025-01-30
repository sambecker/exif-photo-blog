const GITHUB_API_URL =
  'https://api.github.com/repos/sambecker/exif-photo-blog/commits/main';

export const fetchLatestRepoCommit = async () => {
  const response = await fetch(GITHUB_API_URL);
  const data = await response.json();
  return data.sha.slice(0, 7);
};
