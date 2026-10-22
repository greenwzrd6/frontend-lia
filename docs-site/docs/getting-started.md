# Getting Started

## Prerequisites

- Node.js 20 or newer
- the `kanban-lia` backend running (see its Getting Started guide)

## 1. Install dependencies

From the `kanban-frontend-lia/` folder:

```bash
npm install
```

## 2. Configure

Settings live in `.env` and are read as Vite environment variables:

| Setting | Purpose |
| --- | --- |
| `VITE_API_URL` | Base URL of the `kanban-lia` API (e.g. `https://localhost:7265`) |
| `VITE_TOJ_API_URL` | Base URL of the TOJ API (e.g. `https://localhost:44301`) |

## 3. Run the app

```bash
npm run dev
```

- Vite dev server: `http://localhost:5173` (already allowed through the backend's CORS)
- The `/toj-api` path is proxied to the TOJ API by the Vite config

Other useful scripts: `npm run build` (type-check + production build), `npm run lint`, `npm test`.

## 4. Work on this documentation

```bash
npm run docs
```

This starts Docusaurus from the repository root. The API reference under `/api` is regenerated from TSDoc comments automatically on every start/build — no separate generation step is needed. Use `npm run docs:build` for a static production build in `docs-site/build/`.

## Next steps

- Read the [API reference](/api) generated from the source
- See the [Introduction](/) for the architecture overview
