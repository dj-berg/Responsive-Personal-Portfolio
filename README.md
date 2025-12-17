# Portfolio (Daniel J. Berg)

This is a static portfolio site. Below are quick steps to deploy to Vercel.

---

## Deploy with Vercel CLI (quickest)
1. Install Vercel CLI (if you don't have it):
   - npm i -g vercel
2. Login to Vercel:
   - vercel login
3. From the project root (this folder) run:
   - vercel # first-time run will prompt for a project name and settings
   - vercel --prod # promote a deployment to production
4. Redeploy quickly: `vercel --prod` or `vercel`

Notes: The included `vercel.json` sets `index.html` to be served for all routes (good for single-page apps).

---

## Deploy via GitHub (recommended for CI)
1. Push this repository to GitHub.
2. Go to https://vercel.com and import the repository (New Project → Import Git Repository).
3. Set the root directory to `/` and confirm.
4. Vercel will build and deploy on each push to the linked GitHub branch.

---

## Useful tips
- If you use client-side routing, the `routes` entry in `vercel.json` ensures every request serves `index.html`.
- If you want automatic preview branches, keep using the GitHub integration — Vercel creates a preview for every PR.

If you want, I can:
- Add a GitHub Action to automatically run `vercel` on specific branches, or
- Walk you through an initial CLI deployment step-by-step.
