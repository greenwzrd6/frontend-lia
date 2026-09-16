import { memo, useMemo } from "react";
import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";

import ColumnHeader from "./ColumnHeader";
import PlacementCard from "../Placement/PlacementCard";
import { usePlacementsByColumn } from "../../hooks/usePlacementsByColumn";
import type { ColumnType } from "../../types/column";
import type { EntityType } from "../../types/entity";
import type { PlacementType } from "../../types/placement";

type Props = {
  column: ColumnType;
  boardId: string;
  entitiesById: Map<string, EntityType>;
  enabled: boolean;
  orderedIds?: string[];
};

const DndColumn = memo(function DndColumn({
  column,
  boardId,
  entitiesById,
  enabled,
  orderedIds,
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

  const ids = orderedIds ?? placements.map((placement) => placement.entityId);

  return (
    <section className="flex flex-col w-75 hover:bg-gray-100">
      <ColumnHeader column={column} />

      <div ref={ref} className="min-h-32 p-2">
        {ids.map((entityId, index) => {
          const entity = entitiesById.get(entityId);

          if (!entity) {
            return null;
          }

          return (
            <PlacementCard
              key={entityId}
              entity={entity}
              placement={placementById.get(entityId) ?? null}
              columnId={column.id}
              index={index}
            />
          );
        })}
      </div>
    </section>
  );
});

export default DndColumn;
