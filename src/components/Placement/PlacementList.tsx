import { useDroppable } from "@dnd-kit/core";

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
  const sortedPlacements = placements
    ? [...placements].sort((a, b) => {
        if (a.sortKey < b.sortKey) return -1;
        if (a.sortKey > b.sortKey) return 1;
        return 0;
      })
    : [];

  const { setNodeRef } = useDroppable({
    id: `column-${column.id}`,
    data: {
      type: "column",
      columnId: column.id,
    },
  });

  return (
    <div ref={setNodeRef} className="min-h-32 p-2">
      {sortedPlacements.map((placement) => {
        const entity = entities.find(
          (entity) => entity.id === placement.entityId,
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
  );
}
