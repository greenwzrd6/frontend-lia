import type { TaskType } from "../types/task";

/**
 * Local mock tasks used by the board. The app no longer connects to the TOJ
 * system, so BoardPage imports this file directly instead of fetching tasks.
 *
 * The root id must match the board roots stored in the database (see the
 * V20260912.1337 seed migration in kanban-lia): the board shows the
 * descendants of its roots, so every card below hangs under that root.
 * Cards without a placement are auto-placed into the Inbox column on load.
 */
const ROOT = "c3550d6e-2d34-f111-ae9c-3cecef9b8585";
const AUTH = "00000000-0000-4000-8000-000000000001";
const DESIGN_LOGIN = "00000000-0000-4000-8000-000000000002";
const IDENTITY_PROVIDER = "00000000-0000-4000-8000-000000000003";
const WEBHOOKS = "00000000-0000-4000-8000-000000000004";
const EXPONENTIAL_BACKOFF = "00000000-0000-4000-8000-000000000005";
const RETRY_TESTS = "00000000-0000-4000-8000-000000000006";
const DRAG_AND_DROP = "00000000-0000-4000-8000-000000000007";
const MIGRATE_DND_KIT = "00000000-0000-4000-8000-000000000008";
const KEYBOARD_NAVIGATION = "00000000-0000-4000-8000-000000000009";

export const mockTasks: TaskType[] = [
  { id: ROOT, parentId: null, title: "Development" },
  { id: AUTH, parentId: ROOT, title: "Implement user authentication" },
  { id: DESIGN_LOGIN, parentId: AUTH, title: "Design login screen" },
  { id: IDENTITY_PROVIDER, parentId: ROOT, title: "Integrate identity provider" },
  { id: WEBHOOKS, parentId: ROOT, title: "Fix payment webhook retries" },
  { id: EXPONENTIAL_BACKOFF, parentId: WEBHOOKS, title: "Add exponential backoff" },
  { id: RETRY_TESTS, parentId: WEBHOOKS, title: "Write retry unit tests" },
  { id: DRAG_AND_DROP, parentId: ROOT, title: "Improve board drag and drop" },
  { id: MIGRATE_DND_KIT, parentId: DRAG_AND_DROP, title: "Migrate to dnd-kit" },
  { id: KEYBOARD_NAVIGATION, parentId: DRAG_AND_DROP, title: "Add keyboard navigation" },
];
