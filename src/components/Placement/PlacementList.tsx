import { useDroppable } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { EntityType } from "../../types/entity";
import type { ColumnType } from "../../types/column";
import type { PlacementType } from "../../types/placement";
import PlacementCard from "./PlacementCard";

type Props = {
  column: ColumnType;
  placements: PlacementType[] | undefined;
  entities: EntityType[];
  boardId: string;
};

export default function PlacementList({
  column,
  placements,
  entities,
}: Readonly<Props>) {
  /*
   * The backend uses sortKey to determine the actual order.
   *
   * We continue sorting by it when displaying the list.
   */
  const sortedPlacements = placements
    ? [...placements].sort((a, b) => {
        if (a.sortKey < b.sortKey) return -1;
        if (a.sortKey > b.sortKey) return 1;
        return 0;
      })
    : [];

  /*
   * The whole column is also a droppable area.
   *
   * This is especially important for empty columns.
   */
  const { setNodeRef } = useDroppable({
    id: `column-${column.id}`,
    data: {
      type: "column",
      columnId: column.id,
    },
  });

  return (
    <SortableContext
      /*
       * These IDs tell dnd-kit which entities belong
       * to this sortable list.
       */
      items={sortedPlacements.map((placement) => placement.entityId)}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} className="min-h-32 p-2">
        {sortedPlacements.map((placement) => {
          const entity = entities.find(
            (entity) => entity.Id === placement.entityId,
          );

          if (!entity) {
            return null;
          }

          return (
            <PlacementCard
              key={placement.entityId}
              entity={entity}
              placement={placement}
            />
          );
        })}
      </div>
    </SortableContext>
  );
}
