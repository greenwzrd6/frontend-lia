import {
  closestCenter,
  DndContext,
  pointerWithin,
  type CollisionDetection,
  type DragEndEvent,
} from "@dnd-kit/core";

import { useQueryClient } from "@tanstack/react-query";

import type { ColumnType } from "../../types/column";
import type { PlacementType } from "../../types/placement";

import Column from "./Column";

import { invalidateColumnPlacements } from "../../hooks/usePlacement";
import { useBoardHub } from "../../hooks/useBoardHub";
import { createPlacement } from "../../services/placementApi";
import { placementKeys } from "../../utils/queryKeys";

type Props = {
  columns: ColumnType[];
  placements: PlacementType[];
  boardId: string;
};

export default function ColumnList({ columns, boardId }: Readonly<Props>) {
  const queryClient = useQueryClient();

  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  const kanbanCollisionDetection: CollisionDetection = (args) => {
    const { droppableContainers } = args;

    // Cards have priority over the column container.
    const cardContainers = droppableContainers.filter(
      (container) => container.data.current?.type !== "column",
    );

    const cardCollisions = pointerWithin({
      ...args,
      droppableContainers: cardContainers,
    });

    if (cardCollisions.length > 0) {
      return cardCollisions;
    }

    // If we're not directly over a card, fall back to
    // the column droppable.
    const columnContainers = droppableContainers.filter(
      (container) => container.data.current?.type === "column",
    );

    return closestCenter({
      ...args,
      droppableContainers: columnContainers,
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

  async function handleDragEnd(event: DragEndEvent) {
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

    /*
     * --------------------------------------------------
     * Dropped on the column itself
     * --------------------------------------------------
     */
    if (overType === "column") {
      const targetColumnId = over.data.current?.columnId;

      if (!targetColumnId) {
        return;
      }

      const targetPlacements = queryClient.getQueryData<PlacementType[]>(
        placementKeys.byColumnId(targetColumnId),
      );

      /*
       * Empty column
       */
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

      /*
       * Dropped in the empty space at the bottom
       * of a non-empty column.
       */
      const lastPlacement = [...targetPlacements].sort((a, b) => {
        if (a.sortKey < b.sortKey) return -1;
        if (a.sortKey > b.sortKey) return 1;
        return 0;
      })[targetPlacements.length - 1];

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

    /*
     * --------------------------------------------------
     * Dropped on another card
     * --------------------------------------------------
     */

    const targetEntityId = String(over.id);
    const targetColumnId = over.data.current?.columnId;

    if (!targetColumnId) {
      return;
    }

    // Don't create a placement against itself.
    if (draggedEntityId === targetEntityId) {
      return;
    }

    const targetPlacements = queryClient.getQueryData<PlacementType[]>(
      placementKeys.byColumnId(targetColumnId),
    );

    if (!targetPlacements) {
      return;
    }

    const targetIndex = targetPlacements.findIndex(
      (placement) => placement.entityId === targetEntityId,
    );

    if (targetIndex === -1) {
      return;
    }

    /*
     * Determine whether the dragged card's center
     * is above or below the target card's center.
     *
     * Above  -> insert BEFORE target
     * Below  -> insert AFTER target
     */
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

  return (
    <DndContext
      collisionDetection={kanbanCollisionDetection}
      onDragEnd={handleDragEnd}
    >
      <div className="flex justify-evenly">
        {sortedColumns.map((column) => (
          <Column key={column.id} column={column} boardId={boardId} />
        ))}
      </div>
    </DndContext>
  );
}
