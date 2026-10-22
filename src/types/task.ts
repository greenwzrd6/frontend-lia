/** A task/entity shown as a card, mapped from the TOJ API's node items. */
export type TaskType = {
  id: string;
  /** Parent task id, or null for a root task. */
  parentId: string | null;
  title: string;
};
