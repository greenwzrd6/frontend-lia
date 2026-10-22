# Kanban Frontend Documentation

Documentation site for `kanban-frontend-lia`, built with [Docusaurus](https://docusaurus.io/). It mirrors the DocFX documentation used by the backends: handwritten concept pages in `docs/` plus an auto-generated API reference in `docs/api/`.

The API reference is generated from TSDoc comments in `../src` by [docusaurus-plugin-typedoc](https://typedoc-plugin-markdown.org/plugins/docusaurus) as part of every start/build — there is no separate generation step.

## Commands

Run these from the repository root:

```bash
npm run docs        # start the dev server (TypeDoc regenerates automatically)
npm run docs:build  # production build into docs-site/build/
```

Or directly from this folder: `npm start`, `npm run build`, `npm run serve`.

## Structure

| Path | Purpose |
| --- | --- |
| `docs/introduction.md` | Architecture overview (landing page at `/`) |
| `docs/getting-started.md` | Setup guide |
| `docs/api/` | Generated API reference (git-ignored, do not edit) |
| `docusaurus.config.ts` | Site config + TypeDoc plugin options |
| `sidebars.ts` | Nav: Introduction, Getting Started, API |

## Writing API docs

Add TSDoc comments (`/** … */`) to exported symbols in `src/` — especially `services/`, `hooks/` and `types/` — and they will appear in the API section on the next build.
