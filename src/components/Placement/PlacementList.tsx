import type { DragEvent } from "react";
import type { EntityType } from "../../types/entity";

import PlacementCard from "./PlacementCard";
import { useCreatePlacement } from "../../hooks/useCreatePlacements";
import type { ColumnType } from "../../types/column";
import type { PlacementType } from "../../types/placement";
import type { BoardId } from "../../types/board";

type Props = {
  column: ColumnType;
  placements: PlacementType[] | undefined;
  entities: EntityType[];
  boardId: BoardId;
};

export default function PlacementList({
  column,
  placements,
  entities,
  boardId,
}: Readonly<Props>) {
  const { mutateAsync: createPlacement } = useCreatePlacement();

  const sortedPlacements = placements
    ? [...placements].sort((a, b) => {
        if (a.sortKey < b.sortKey) return -1;
        if (a.sortKey > b.sortKey) return 1;
        return 0;
      })
    : [];

  async function handleCardDrop(
    draggedEntityId: string,
    targetEntityId: string,
    dropBefore: boolean,
  ) {
    await createPlacement({
      entityId: draggedEntityId,
      boardId: boardId.id,
      columnId: column.id.id,
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
      (placement) => placement.entityId.id !== draggedEntityId,
    );

    const firstPlacement = remainingPlacements.at(0);

    await createPlacement({
      entityId: draggedEntityId,
      boardId: boardId.id,
      columnId: column.id.id,
      afterEntityId: null,
      beforeEntityId: firstPlacement?.entityId.id ?? null,
    });
  }

  async function handleDropAtEnd(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const draggedEntityId = event.dataTransfer.getData("text/plain");

    if (!draggedEntityId) {
      return;
    }

    const remainingPlacements = sortedPlacements.filter(
      (placement) => placement.entityId.id !== draggedEntityId,
    );

    const lastPlacement = remainingPlacements.at(-1);

    await createPlacement({
      entityId: draggedEntityId,
      boardId: boardId.id,
      columnId: column.id.id,
      afterEntityId: lastPlacement?.entityId.id ?? null,
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
          (entity) => entity.id === placement.entityId.id,
        );

        if (!entity) {
          return null;
        }

        return (
          <PlacementCard
            key={placement.entityId.id}
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
