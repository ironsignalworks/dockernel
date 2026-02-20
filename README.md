
# DocKernel

DocKernel is a browser-native PDF editor built with React + Vite.

## Tech stack

- React
- Vite
- Tailwind CSS
- Radix UI
- Lucide icons

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build (uses `/dockernel/` base path for GitHub Pages)
- `npm run deploy` - publish `dist/` to `gh-pages` branch

## GitHub Pages deployment

This repo supports:

1. GitHub Actions deploy from `main` (recommended)
2. Manual deploy with `npm run deploy`

### One-time GitHub setup

1. Push repository to GitHub.
2. Open `Settings > Pages`.
3. Set **Source** to **GitHub Actions**.
4. Site URL will be:

```txt
https://ironsignalworks.github.io/dockernel/
```

### Manual deploy

```bash
npm run deploy
```

This publishes the current `dist/` output to the `gh-pages` branch.

## Notes

- If GitHub Pages is not updating, confirm the Pages source is set to **GitHub Actions** and that the latest workflow run succeeded.
- If you use both `main` and `gh-pages`, keep in mind only the configured Pages source branch/workflow controls what is live.
- Paginator/asset-pipeline features were split from this app; this repo now focuses on editing, previewing, and exporting documents.
