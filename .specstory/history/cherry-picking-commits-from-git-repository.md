## SpecStory

## Cherry-Picking Commits from Git Repository (1/26/2025, 7:52:25 PM)

_**User**_

I want to cherry pick all the commits except for the first commit of  the main branch of git@github.com:xingfanxia/exif-photo-blog.git onto this project

---

_**Assistant**_

I'll help you cherry-pick all commits except the first one from that repository. Here's how to do it:

1. First, let's add the remote repository and fetch its contents:

```bash
git remote add source git@github.com:xingfanxia/exif-photo-blog.git
git fetch source
```

2. To find all commits in the main branch, we can use:

```bash
git log source/main --oneline
```

3. Once you have the list of commits, you can cherry-pick all commits except the first one. Assuming the commits are in chronological order (oldest first), you can use:

```bash
git cherry-pick OLDEST_COMMIT_HASH^..NEWEST_COMMIT_HASH
```

Or if you want to do it manually, you can cherry-pick each commit individually (excluding the first one):

```bash
git cherry-pick <commit-hash>
```

If you encounter any merge conflicts during the cherry-pick process, you'll need to:
1. Resolve the conflicts
2. `git add` the resolved files
3. `git cherry-pick --continue`

Would you like me to help you identify the specific commit hashes to cherry-pick?

---



---

