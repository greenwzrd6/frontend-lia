import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  closestCenter,
  DndContext,
  DragOverlay,
  pointerWithin,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
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

  const [dragColumnId, setDragColumnId] = useState<string | null>(null);

  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  function getColumnPlacements(columnId: string): PlacementType[] {
    return (
      queryClient.getQueryData<PlacementType[]>(
        placementKeys.byColumnId(columnId),
      ) ?? []
    );
  }

  /*
   * Collision detection:
   *
   * 1. Cards are checked first.
   * 2. Empty columns are checked with pointerWithin.
   * 3. Otherwise closestCenter is used between cards.
   */
  const kanbanCollisionDetection: CollisionDetection = (args) => {
    const { droppableContainers } = args;

    const cardContainers = droppableContainers.filter(
      (container) => container.data.current?.type !== "column",
    );

    const columnContainers = droppableContainers.filter(
      (container) => container.data.current?.type === "column",
    );

    // Pointer is directly over a card.
    const cardCollisions = pointerWithin({
      ...args,
      droppableContainers: cardContainers,
    });

    if (cardCollisions.length > 0) {
      return cardCollisions;
    }

    // Find empty columns.
    const emptyColumnContainers = columnContainers.filter((container) => {
      const columnId = container.data.current?.columnId;

      if (!columnId) {
        return false;
      }

      const columnPlacements = getColumnPlacements(columnId);

      return columnPlacements.length === 0;
    });

    // Pointer is inside an empty column.
    const emptyColumnCollisions = pointerWithin({
      ...args,
      droppableContainers: emptyColumnContainers,
    });

    if (emptyColumnCollisions.length > 0) {
      return emptyColumnCollisions;
    }

    // Otherwise find the closest card.
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

    // The column where the drag started.
    setDragColumnId(event.active.data.current?.columnId ?? null);
  }

  function handleDragCancel() {
    setActiveEntityId(null);
    setDragColumnId(null);
  }

  /*
   * When the dragged card enters another column, we temporarily
   * move it into that column's placement list.
   */
  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const draggedEntityId = String(active.id);

    const sourceColumnId = dragColumnId;

    if (!sourceColumnId) {
      return;
    }

    const targetColumnId = over.data.current?.columnId;

    if (!targetColumnId) {
      return;
    }

    /*
     * We're still in the same column.
     *
     * SortableContext handles the visual movement for us.
     */
    if (sourceColumnId === targetColumnId) {
      return;
    }

    const sourcePlacements = getColumnPlacements(sourceColumnId);
    const targetPlacements = getColumnPlacements(targetColumnId);

    const draggedPlacement = sourcePlacements.find(
      (placement) => placement.entityId === draggedEntityId,
    );

    if (!draggedPlacement) {
      return;
    }

    /*
     * Remove the dragged placement from its old column.
     */
    const newSourcePlacements = sourcePlacements.filter(
      (placement) => placement.entityId !== draggedEntityId,
    );

    /*
     * Prevent adding the same entity multiple times.
     */
    const targetWithoutDragged = targetPlacements.filter(
      (placement) => placement.entityId !== draggedEntityId,
    );

    /*
     * Determine where the dragged item should appear
     * in the target column.
     *
     * If we're over a card, put the dragged item before it.
     * If we're over the column itself, put it at the bottom.
     */
    let targetIndex = targetWithoutDragged.length;

    if (over.data.current?.type !== "column") {
      const overEntityId = String(over.id);

      const overIndex = targetWithoutDragged.findIndex(
        (placement) => placement.entityId === overEntityId,
      );

      if (overIndex !== -1) {
        targetIndex = overIndex;
      }
    }

    const newTargetPlacements = [...targetWithoutDragged];

    newTargetPlacements.splice(targetIndex, 0, {
      ...draggedPlacement,
      columnId: targetColumnId,
    });

    /*
     * Temporarily update the React Query cache.
     *
     * This is only for the visual drag operation.
     */
    queryClient.setQueryData(
      placementKeys.byColumnId(sourceColumnId),
      newSourcePlacements,
    );

    queryClient.setQueryData(
      placementKeys.byColumnId(targetColumnId),
      newTargetPlacements,
    );

    /*
     * The dragged card now belongs to the target column
     * for the duration of this drag.
     */
    setDragColumnId(targetColumnId);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      setActiveEntityId(null);
      setDragColumnId(null);
      return;
    }

    const draggedEntityId = String(active.id);

    /*
     * active.data.current.columnId can have changed because
     * handleDragOver temporarily moved the card.
     *
     * Therefore we use dragColumnId as the final target column,
     * and retrieve the original column from the placement
     * that existed before the drag.
     */

    const targetColumnId = over.data.current?.columnId ?? dragColumnId;

    if (!targetColumnId) {
      setActiveEntityId(null);
      setDragColumnId(null);
      return;
    }

    /*
     * Find the original placement information.
     *
     * The original placements prop contains the placements
     * from when the board was loaded.
     */
    const originalPlacement = placements.find(
      (placement) => placement.entityId === draggedEntityId,
    );

    const sourceColumnId = originalPlacement?.columnId ?? null;

    /*
     * If the drag stayed in the same column and was dropped
     * on itself, there is nothing to save.
     */
    if (
      sourceColumnId === targetColumnId &&
      String(over.id) === draggedEntityId
    ) {
      setActiveEntityId(null);
      setDragColumnId(null);
      return;
    }

    const targetPlacements = getColumnPlacements(targetColumnId)
      .filter((placement) => placement.entityId !== draggedEntityId)
      .sort((a, b) => {
        if (a.sortKey < b.sortKey) return -1;
        if (a.sortKey > b.sortKey) return 1;
        return 0;
      });

    /*
     * If the column is empty after removing the dragged card,
     * create it without a before/after entity.
     */
    if (targetPlacements.length === 0) {
      await createPlacement({
        entityIds: [draggedEntityId],
        boardId,
        columnId: targetColumnId,
        beforeEntityId: null,
        afterEntityId: null,
        sourceColumnId,
      });

      setActiveEntityId(null);
      setDragColumnId(null);
      return;
    }

    /*
     * Find the dragged card's final position in the temporary
     * target list.
     */
    const targetIndex = targetPlacements.findIndex(
      (placement) => placement.entityId === String(over.id),
    );

    /*
     * If we're dropping on a card, put the dragged card before it.
     */
    if (over.data.current?.type !== "column" && targetIndex !== -1) {
      const targetEntityId = targetPlacements[targetIndex].entityId;

      await createPlacement({
        entityIds: [draggedEntityId],
        boardId,
        columnId: targetColumnId,
        beforeEntityId: targetEntityId,
        afterEntityId: null,
        sourceColumnId,
      });

      setActiveEntityId(null);
      setDragColumnId(null);
      return;
    }

    /*
     * Dropping on the column itself means the bottom.
     */
    const lastPlacement = targetPlacements[targetPlacements.length - 1];

    await createPlacement({
      entityIds: [draggedEntityId],
      boardId,
      columnId: targetColumnId,
      beforeEntityId: null,
      afterEntityId: lastPlacement.entityId,
      sourceColumnId,
    });

    setActiveEntityId(null);
    setDragColumnId(null);
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
      onDragOver={handleDragOver}
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
