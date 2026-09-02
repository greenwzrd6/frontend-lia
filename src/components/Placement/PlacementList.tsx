import type { DragEvent } from "react";
import type { EntityType } from "../../types/entity";

import PlacementCard from "./PlacementCard";
import { useCreatePlacement } from "../../hooks/useCreatePlacements";
import type { ColumnType } from "../../types/column";
import type { PlacementType } from "../../types/placement";

type Props = {
  column: ColumnType;
  placements: PlacementType[];
  entities: EntityType[];
};

export default function PlacementList({
  column,
  placements,
  entities,
}: Readonly<Props>) {
  const createPlacement = useCreatePlacement();

  const sortedPlacements = [...placements].sort((a, b) =>
    a.position.localeCompare(b.position),
  );

  async function handleCardDrop(
    draggedEntityId: string,
    targetEntityId: string,
    dropBefore: boolean,
  ) {
    await createPlacement.mutateAsync({
      entityId: draggedEntityId,
      columnId: column.id,
      afterEntityId: dropBefore ? null : targetEntityId,
      beforeEntityId: dropBefore ? targetEntityId : null,
    });
  }

  async function handleDropAtStart(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const draggedEntityId = event.dataTransfer.getData("text/plain");

    if (!draggedEntityId) {
      return;
    }

    const remainingPlacements = sortedPlacements.filter(
      (placement) => placement.entityId !== draggedEntityId,
    );

    const firstPlacement = remainingPlacements.at(0);

    await createPlacement.mutateAsync({
      entityId: draggedEntityId,
      columnId: column.id,
      afterEntityId: null,
      beforeEntityId: firstPlacement?.entityId ?? null,
    });
  }

  async function handleDropAtEnd(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const draggedEntityId = event.dataTransfer.getData("text/plain");

    if (!draggedEntityId) {
      return;
    }

    const remainingPlacements = sortedPlacements.filter(
      (placement) => placement.entityId !== draggedEntityId,
    );

    const lastPlacement = remainingPlacements.at(-1);

    await createPlacement.mutateAsync({
      entityId: draggedEntityId,
      columnId: column.id,
      afterEntityId: lastPlacement?.entityId ?? null,
      beforeEntityId: null,
    });
  }

  return (
    <div className="min-h-32 p-2">
      <div
        className="min-h-6"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDropAtStart}
      />

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
            onDrop={handleCardDrop}
          />
        );
      })}

      <div
        className="min-h-6"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDropAtEnd}
      />
    </div>
  );
}
