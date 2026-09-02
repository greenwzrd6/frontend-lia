import type { DragEvent } from "react";
import type { EntityType } from "../../types/entity";

import PlacementCard from "./PlacementCard";
import { useCreatePlacement } from "../../hooks/useCreatePlacements";
import { usePlacements } from "../../hooks/usePlacements";

type Props = {
  columnId: string;
  entities: EntityType[];
};

export default function PlacementList({ columnId, entities }: Readonly<Props>) {
  const { placements, isLoading, isError } = usePlacements(columnId);

  const createPlacement = useCreatePlacement();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Could not load placements.</p>;
  }

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
      columnId,
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
      columnId,
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
      columnId,
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
