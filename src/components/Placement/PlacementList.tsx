import { useDroppable } from "@dnd-kit/react";

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

  const visiblePlacements = placements 
  ? placements.filter((placement) => 
    entities.some((entity) => entity.Id === placement.entityId),
) : [];
  /*
   * The backend uses sortKey to determine the actual order.
   *
   * We continue sorting by it when displaying the list.
   */
  const sortedPlacements = [...visiblePlacements].sort((a, b) => {
        if (a.sortKey < b.sortKey) return -1;
        if (a.sortKey > b.sortKey) return 1;
        return 0;
      });

  const { ref } = useDroppable({
    id: `${column.id}`,
    data: {
      type: "column",
      columnId: column.id,
    },
  });

  return (
      <div ref={ref} className="min-h-32 p-2">
        {sortedPlacements.map((placement, index) => {
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
              index={index}
            />
          );
        })}
      </div>
  );
}
