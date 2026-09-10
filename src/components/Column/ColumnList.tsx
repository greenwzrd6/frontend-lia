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

  const [sourceColumnId, setSourceColumnId] = useState<string | null>(null);
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null);

  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  function getColumnPlacements(columnId: string): PlacementType[] {
    const placements =
      queryClient.getQueryData<PlacementType[]>(
        placementKeys.byColumnId(columnId),
      ) ?? [];

    return placements.filter((placement) =>
      entities.some((entity) => entity.Id === placement.entityId),
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

    console.log(args);

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
    const columnId = event.active.data.current?.columnId ?? null;

    setSourceColumnId(columnId);
    setTargetColumnId(columnId);
  }

  function handleDragCancel() {
    setActiveEntityId(null);
    setTargetColumnId(null);
    setSourceColumnId(null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      setActiveEntityId(null);
      setTargetColumnId(null);
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

    const finalTargetColumnId = over.data.current?.columnId ?? targetColumnId;

    if (!finalTargetColumnId || !sourceColumnId) {
      setActiveEntityId(null);
      setSourceColumnId(null);
      setTargetColumnId(null);
      return;
    }

    /*
     * If the drag stayed in the same column and was dropped
     * on itself, there is nothing to save.
     */
    if (
      sourceColumnId === finalTargetColumnId &&
      String(over.id) === draggedEntityId
    ) {
      setActiveEntityId(null);
      setTargetColumnId(null);
      return;
    }

    const targetPlacements = getColumnPlacements(finalTargetColumnId)
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
        columnId: finalTargetColumnId,
        beforeEntityId: null,
        afterEntityId: null,
        sourceColumnId,
      });

      setActiveEntityId(null);
      setActiveEntityId(null);
      setTargetColumnId(null);
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
     * If we're dropping on a card, put the dragged card before or after it depending on where we drop.
     */
    if (over.data.current?.type === "card" && targetIndex !== -1) {
      const targetEntityId = targetPlacements[targetIndex].entityId;

      const activeRect = active.rect.current.translated;
      const overRect = over.rect;

      const isBelow =
        activeRect !== null &&
        activeRect.top + activeRect.height / 2 >
          overRect.top + overRect.height / 2;

      await createPlacement({
        entityIds: [draggedEntityId],
        boardId,
        columnId: finalTargetColumnId,
        beforeEntityId: isBelow ? null : targetEntityId,
        afterEntityId: isBelow ? targetEntityId : null,
        sourceColumnId,
      });

      setActiveEntityId(null);
      setActiveEntityId(null);
      setTargetColumnId(null);
      return;
    }

    /*
     * Dropping on the column itself means the bottom.
     */
    const lastPlacement = targetPlacements[targetPlacements.length - 1];

    await createPlacement({
      entityIds: [draggedEntityId],
      boardId,
      columnId: finalTargetColumnId,
      beforeEntityId: null,
      afterEntityId: lastPlacement.entityId,
      sourceColumnId,
    });

    setActiveEntityId(null);
    setActiveEntityId(null);
    setTargetColumnId(null);
  }

  const activeEntity = activeEntityId
    ? entities.find((entity) => entity.Id === activeEntityId)
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
          <article
            className="
              outline my-3 py-1 px-1
              flex flex-col items-left justify-center
              select-none shadow-2xl cursor-grabbing bg-white opacity-95
            "
          >
            <h3>{activeEntity.Title}</h3>
            <small>Entity: {activeEntity.Id}</small>
            <small>sortKey: {activePlacement?.sortKey}</small>
            <small>Parent: {activeEntity.ParentId}</small>
          </article>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
