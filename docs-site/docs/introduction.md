---
slug: /
---

# Introduction

kanban-frontend-lia is the React front-end for the Kanban board. It is written in React 19 + TypeScript, built with Vite, styled with Tailwind CSS 4, and talks to the `kanban-lia` API over HTTP and SignalR. Server state is managed by TanStack React Query; drag-and-drop is handled by dnd-kit and column-to-column edges are drawn with `@xyflow/react`.

## Request flow

A typical read/write flows:

```
Component (Board/Column/Placement)
        │
        ▼
Hook (React Query query/mutation)
        │
        ▼
Service (services/, fetch via apiRequest) ──► kanban-lia API (VITE_API_URL)
        ▲                                             │
        │                                             ▼
        └── query cache invalidation ◄── useBoardHub (SignalR /hubs/board)
```

- **Components** (`components/`) — `Board/` renders the board header and the dnd-kit drop areas, `Column/` renders columns (with `Flow/` sub-components for the `@xyflow/react` edge diagrams), and `Placement/` renders draggable placement cards.
- **Pages** (`pages/`) — routed via React Router; `BoardPage` is the main screen.
- **Hooks** (`hooks/`) — one React Query hook per server interaction: `useBoard`, `useColumns`, `usePlacements`, `usePlacementsByColumn`, `useColumnEdges`, `useTasks` for reads and `useCreateColumn`, `useRenameColumn`, `useDeleteColumn`, `useCreatePlacement`, `useCreateColumnEdge`, `useDeleteColumnEdge`, `useRenameBoard` for writes.
- **Services** (`services/`) — thin `fetch` wrappers grouped by aggregate (`boardApi`, `columnApi`, `columnEdgeApi`, `placementApi`, `taskApi`) on top of the shared `apiRequest` helper in `services/api.ts`. The base URL comes from `VITE_API_URL`.
- **Types** (`types/`) — shared interfaces for boards, columns, placements, column edges and tasks.
- **Utils** (`utils/`) — React Query key factories (`queryKeys.ts`), entity tree helpers (`entityTree.ts`) and placement sorting (`sortPlacements.ts`).

## Cross-cutting concerns

- **Realtime** — `useBoardHub` opens a SignalR connection to `/hubs/board?boardId=…` with automatic reconnect and invokes its callback on `PlacementCreated` events; `DndBoard` uses it to refresh the query cache when another client creates a placement.
- **Cache** — all query keys are built from the factories in `utils/queryKeys.ts`, so invalidation after mutations is consistent across hooks.
- **Proxying** — Vite dev server proxies `/toj-api` to `https://localhost:44301` (see `vite.config.ts`).
- **CORS** — the backend allows this app's dev origin (`http://localhost:5173`) with credentials.
- **Testing** — Jest + React Testing Library; tests live under `src/tests/`.
