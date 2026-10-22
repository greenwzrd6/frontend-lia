import { memo, useMemo, useRef } from "react";
import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import { useVirtualizer } from "@tanstack/react-virtual";

import ColumnHeader from "./ColumnHeader";
import DndPlacementCard from "../Placement/DndPlacementCard";
import { usePlacementsByColumn } from "../../hooks/usePlacementsByColumn";
import type { ColumnType } from "../../types/column";
import type { TaskType } from "../../types/task";
import type { PlacementType } from "../../types/placement";

/** Props for the DndColumn component. */
export type Props = {
  /** The column rendered as a droppable Kanban column. */
  column: ColumnType;
  /** Id of the board the column belongs to (placement query scope). */
  boardId: string;
  /** Task lookup by id, used to resolve placement entity ids to cards. */
  entitiesById: Map<string, TaskType>;
  /** Enables the placements query (set once the board-level bootstrap succeeds). */
  enabled: boolean;
  /** Optional override of the cached card order during a drag. */
  orderedIds?: string[];
  /** Whether the column header renders in edit mode. */
  isEditMode?: boolean;
  /** Whether to focus the header's rename input on mount. Defaults to `false`. */
  autoFocus?: boolean;
};

/**
 * A single Kanban column that is a droppable target for cards. Registers a
 * `useDroppable` region (accepts `"card"`, low collision priority), fetches
 * this column's placements via `usePlacementsByColumn` (enabled once the
 * board-level bootstrap succeeds), and renders a memoized, virtually
 * scrolled list of {@link DndPlacementCard}s using `@tanstack/react-virtual`.
 *
 * @param props - `column`, `boardId`, `entitiesById` task lookup, `enabled`
 * for the placements query, optional `orderedIds` overriding the cached
 * order during a drag, optional `isEditMode`, and `autoFocus` forwarded to
 * the column header's rename input (set for the first column).
 */
const DndColumn = memo(function DndColumn({
  column,
  boardId,
  entitiesById,
  enabled,
  orderedIds,
  isEditMode,
  autoFocus = false,
}: Readonly<Props>) {
  const { ref } = useDroppable({
    id: column.id,
    type: "column",
    accept: "card",
    collisionPriority: CollisionPriority.Low,
    data: {
      type: "column",
      columnId: column.id,
    },
  });

  const { data: placements = [] } = usePlacementsByColumn(
    column.id,
    boardId,
    enabled,
  );

  const placementById = useMemo(() => {
    const map = new Map<string, PlacementType>();

    for (const placement of placements) {
      map.set(placement.entityId, placement);
    }

    return map;
  }, [placements]);

  const ids =
    orderedIds ??
    placements
      .map((placement) => placement.entityId)
      .filter((entityId) => entitiesById.has(entityId));

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: ids.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 74,
    getItemKey: (index) => ids[index] ?? index,
    measureElement: (element) => (element as HTMLElement).offsetHeight,
    overscan: 5,
  });

  return (
    <section className="flex flex-col content-center max-h-full w-75 rounded-xl has-[.dnd-over]:bg-gray-100">
      <ColumnHeader
        column={column}
        isEditMode={isEditMode}
        autoFocus={autoFocus}
      />

      <div
        ref={(node) => {
          parentRef.current = node;
          ref(node);
        }}
        className="min-h-0 overflow-y-auto p-2 scrollbar-thin scrollbar-gutter-stable scrollbar-thumb-gray-200"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const entityId = ids[virtualItem.index];
            const entity = entitiesById.get(entityId);

            if (!entity) return null;

            return (
              <div
                key={entityId}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  paddingBlock: "4px",
                  boxSizing: "border-box",
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <DndPlacementCard
                  entity={entity}
                  placement={placementById.get(entityId) ?? null}
                  columnId={column.id}
                  index={virtualItem.index}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default DndColumn;
