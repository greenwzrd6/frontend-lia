import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  closestCenter,
  DndContext,
  DragOverlay,
  pointerWithin,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import type { ColumnType } from "../../types/column";
import type { PlacementType } from "../../types/placement";
import type { EntityType } from "../../types/entity";
import Column from "./Column";
import PlacementCard from "../Placement/PlacementCard";
import { invalidateColumnPlacements } from "../../hooks/usePlacement";
import { useBoardHub } from "../../hooks/useBoardHub";
import { createPlacement } from "../../services/placementApi";
import { placementKeys } from "../../utils/queryKeys";

type Props = {
  columns: ColumnType[];
  placements: PlacementType[];
  boardId: string;
  entities: EntityType[];
};

export default function ColumnList({
  columns,
  boardId,
  entities,
  placements,
}: Readonly<Props>) {
  const queryClient = useQueryClient();

  const [activeEntityId, setActiveEntityId] = useState<string | null>(null);

  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  const kanbanCollisionDetection: CollisionDetection = (args) => {
    const { droppableContainers } = args;

    const cardContainers = droppableContainers.filter(
      (container) => container.data.current?.type !== "column",
    );

    const columnContainers = droppableContainers.filter(
      (container) => container.data.current?.type === "column",
    );

    // For dropping onto cards
    const cardCollisions = pointerWithin({
      ...args,
      droppableContainers: cardContainers,
    });

    if (cardCollisions.length > 0) {
      return cardCollisions;
    }

    // Find empty columns
    const emptyColumnContainers = columnContainers.filter((container) => {
      const columnId = container.data.current?.columnId;

      if (!columnId) return false;

      const columnPlacements = queryClient.getQueryData<PlacementType[]>(
        placementKeys.byColumnId(columnId),
      );

      return !columnPlacements || columnPlacements.length === 0;
    });

    // For empty columns
    const emptyColumnCollisions = pointerWithin({
      ...args,
      droppableContainers: emptyColumnContainers,
    });

    if (emptyColumnCollisions.length > 0) {
      return emptyColumnCollisions;
    }

    // For dropping in margins
    return closestCenter({
      ...args,
      droppableContainers: cardContainers,
    });
  };

  useBoardHub((event) => {
    if (
      !event.sourceColumnId ||
      event.sourceColumnId === event.targetColumnId
    ) {
      invalidateColumnPlacements(queryClient, [event.targetColumnId]);
    } else {
      invalidateColumnPlacements(queryClient, [
        event.sourceColumnId,
        event.targetColumnId,
      ]);
    }
  });

  function handleDragStart(event: DragStartEvent) {
    setActiveEntityId(String(event.active.id));
  }

  function handleDragCancel() {
    setActiveEntityId(null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    // Remove the overlay when the drag finishes
    setActiveEntityId(null);

    const { active, over } = event;

    if (!over) {
      return;
    }

    const draggedEntityId = String(active.id);
    const sourceColumnId = active.data.current?.columnId;

    if (!sourceColumnId) {
      return;
    }

    const overType = over.data.current?.type;

    // Dropped on the column itself
    if (overType === "column") {
      const targetColumnId = over.data.current?.columnId;

      if (!targetColumnId) {
        return;
      }

      const targetPlacements = queryClient.getQueryData<PlacementType[]>(
        placementKeys.byColumnId(targetColumnId),
      );

      // Empty column
      if (!targetPlacements || targetPlacements.length === 0) {
        await createPlacement({
          entityIds: [draggedEntityId],
          boardId,
          columnId: targetColumnId,
          beforeEntityId: null,
          afterEntityId: null,
          sourceColumnId,
        });

        return;
      }

      // Dropped at the bottom of a column
      const sortedTargetPlacements = [...targetPlacements].sort((a, b) => {
        if (a.sortKey < b.sortKey) return -1;
        if (a.sortKey > b.sortKey) return 1;
        return 0;
      });

      const lastPlacement =
        sortedTargetPlacements[sortedTargetPlacements.length - 1];

      await createPlacement({
        entityIds: [draggedEntityId],
        boardId,
        columnId: targetColumnId,
        beforeEntityId: null,
        afterEntityId: lastPlacement.entityId,
        sourceColumnId,
      });

      return;
    }

    // Dropped on another card

    const targetEntityId = String(over.id);
    const targetColumnId = over.data.current?.columnId;

    if (!targetColumnId) {
      return;
    }

    // Dropped on itself
    if (draggedEntityId === targetEntityId) {
      return;
    }

    const targetPlacements = queryClient.getQueryData<PlacementType[]>(
      placementKeys.byColumnId(targetColumnId),
    );

    if (!targetPlacements) {
      return;
    }

    // Decide if the dragged cards center is above or below the target cards center
    const activeRect = active.rect.current.translated;

    if (!activeRect) {
      return;
    }

    const activeCenterY = activeRect.top + activeRect.height / 2;

    const targetCenterY = over.rect.top + over.rect.height / 2;

    const dropBefore = activeCenterY < targetCenterY;

    await createPlacement({
      entityIds: [draggedEntityId],
      boardId,
      columnId: targetColumnId,
      beforeEntityId: dropBefore ? targetEntityId : null,
      afterEntityId: dropBefore ? null : targetEntityId,
      sourceColumnId,
    });
  }

  const activeEntity = activeEntityId
    ? entities.find((entity) => entity.id === activeEntityId)
    : null;

  const activePlacement = activeEntityId
    ? placements.find((placement) => placement.entityId === activeEntityId)
    : null;

  return (
    <DndContext
      collisionDetection={kanbanCollisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex justify-evenly">
        {sortedColumns.map((column) => (
          <Column
            key={column.id}
            column={column}
            boardId={boardId}
            entities={entities}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeEntity ? (
          <PlacementCard
            entity={activeEntity}
            placement={activePlacement}
            isOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
