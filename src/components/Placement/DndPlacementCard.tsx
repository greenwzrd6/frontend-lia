import type { TaskType } from "../../types/task";
import type { PlacementType } from "../../types/placement";
import { useSortable } from "@dnd-kit/react/sortable";

/** Props for the DndPlacementCard component. */
export type Props = {
  /** The task displayed on the card (id used as the sortable id, title rendered). */
  entity: TaskType;
  /** The placement linking the task to its column; may be null/undefined before hydration. */
  placement: PlacementType | null | undefined;
  /** Id of the column the placement belongs to (the sortable group). */
  columnId: string;
  /** Current position within the column, used for sortable ordering. */
  index: number;
};

/**
 * A draggable task card representing one placement in a column. Registers
 * itself with `useSortable` (`type`/`accept` `"card"`, grouped by
 * `columnId`, positioned by `index`). While dragging it becomes invisible
 * (the DragOverlay preview takes over); when it is a valid drop target it
 * gains the `dnd-over` class (used by the column's hover styling). Renders
 * the task title and its `sortKey` from the placement.
 *
 * @param props - `entity` (task), its `placement` (may be null/undefined
 * before hydration), the owning `columnId`, and the current `index` used
 * for sortable ordering.
 */
export default function DndPlacementCard({
  entity,
  columnId,
  index,
  placement,
}: Readonly<Props>) {
  const { ref, isDropTarget, isDragging } = useSortable({
    id: entity.id,
    index,
    group: columnId,
    type: "card",
    accept: "card",
    data: {
      type: "card",
      entityId: entity.id,
      columnId,
    },
  });

  return (
    <article
      ref={ref}
      className={`flex flex-col items-center justify-center bg-white rounded-2xl p-5 border border-gray-200 select-none cursor-grab active:cursor-grabbing
        ${isDragging ? "opacity-0" : ""}
        ${isDropTarget ? "dnd-over" : ""}`}
    >
      <h3>{entity.title}</h3>
      <small>sortKey: {placement?.sortKey}</small>
      {/* <br></br>
      <small>entityId: {placement?.entityId}</small> */}
    </article>
  );
}
