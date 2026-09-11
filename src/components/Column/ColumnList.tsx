import { useQueryClient } from "@tanstack/react-query";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import type { ColumnType } from "../../types/column";
import type { PlacementType } from "../../types/placement";
import type { EntityType } from "../../types/entity";
import Column from "./Column";
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
  placements,
  boardId,
  entities,
}: Readonly<Props>) {
  const queryClient = useQueryClient();

  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  const isDragging = useRef(false);

  const sourceParentRef = useRef<Element | null>(null);

  const [dragPlacements, setDragPlacements] =
    useState<PlacementType[]>(placements);

  useEffect(() => {
    console.log("NEW PLACEMENTS FROM QUERY:", placements);

    if (!isDragging.current) {
      const sorted = [...placements].sort((a, b) => {
        if (a.columnId !== b.columnId) {
          return a.columnId.localeCompare(b.columnId);
        }

        if (a.sortKey < b.sortKey) return -1;
        if (a.sortKey > b.sortKey) return 1;
        return 0;
      });

      setDragPlacements(sorted);
    }
  }, [placements]);

  useBoardHub((event) => {
    const columnIds = new Set(
      [event.sourceColumnId, event.targetColumnId].filter(
        (id): id is string => id !== null,
      ),
    );

    columnIds.forEach((columnId) => {
      queryClient.invalidateQueries({
        queryKey: placementKeys.byColumnId(columnId),
        exact: true,
      });
    });
  });

  function handleDragStart(event: any) {
    isDragging.current = true;

    sourceParentRef.current =
      event.operation.source?.element?.parentElement ?? null;
  }

  async function handleDragEnd(dragEvent: any) {
    const sourceElement = dragEvent.operation.source?.element;

    const previousParent = sourceParentRef.current;

    sourceParentRef.current = null;

    if (
      sourceElement &&
      previousParent &&
      sourceElement.parentElement !== previousParent
    ) {
      previousParent.appendChild(sourceElement);
    }

    isDragging.current = false;

    if (dragEvent.canceled) {
      setDragPlacements(placements);
      return;
    }

    const { source, target } = dragEvent.operation;

    console.log("DRAG END", {
      initialGroup: source.initialGroup,
      group: source.group,
      initialIndex: source.initialIndex,
      index: source.index,
    });

    if (!isSortable(source)) {
      return;
    }

    const {
      data: sourceData,
      initialIndex,
      index,
      initialGroup,
      group,
    } = source;

    if (initialGroup == null) {
      return;
    }

    const sourceColumnId = String(initialGroup);
    const targetColumnId =
      target?.data?.type === "column"
        ? String(target.data.columnId)
        : String(group);

    if (sourceColumnId === targetColumnId && initialIndex === index) {
      return;
    }

    const targetColumnPlacements = dragPlacements.filter(
      (placement) => placement.columnId === targetColumnId,
    );

    const otherPlacements = targetColumnPlacements.filter(
      (placement) => placement.entityId !== sourceData.entityId,
    );

    const targetIndex =
      target?.data?.type === "column"
        ? otherPlacements.length === 0
          ? 0
          : otherPlacements.length
        : index;

    const itemAfter = otherPlacements[targetIndex];

    const itemBefore =
      targetIndex > 0 ? otherPlacements[targetIndex - 1] : undefined;

    flushSync(() => {
      setDragPlacements((currentPlacements) => {
        const sourcePlacements = currentPlacements.filter(
          (placement) => placement.columnId === sourceColumnId,
        );

        const targetPlacements =
          sourceColumnId === targetColumnId
            ? sourcePlacements
            : currentPlacements.filter(
                (placement) => placement.columnId === targetColumnId,
              );

        const movedPlacement = sourcePlacements.find(
          (placement) => placement.entityId === sourceData.entityId,
        );

        if (!movedPlacement) {
          return currentPlacements;
        }

        if (sourceColumnId === targetColumnId) {
          const reordered = [...sourcePlacements];

          const [removed] = reordered.splice(initialIndex, 1);
          reordered.splice(index, 0, removed);

          const unaffectedPlacements = currentPlacements.filter(
            (placement) => placement.columnId !== sourceColumnId,
          );

          return [...unaffectedPlacements, ...reordered];
        }

        const newSourcePlacements = sourcePlacements.filter(
          (placement) => placement.entityId !== movedPlacement.entityId,
        );

        const newTargetPlacements = [...targetPlacements];

        newTargetPlacements.splice(targetIndex, 0, {
          ...movedPlacement,
          columnId: targetColumnId,
        });

        const unaffectedPlacements = currentPlacements.filter(
          (placement) =>
            placement.columnId !== sourceColumnId &&
            placement.columnId !== targetColumnId,
        );

        return [
          ...unaffectedPlacements,
          ...newSourcePlacements,
          ...newTargetPlacements,
        ];
      });
    });

    console.log("CREATE PLACEMENT:", {
      entityId: sourceData.entityId,
      sourceColumnId,
      targetColumnId,
      initialIndex,
      index,
      beforeEntityId: itemAfter?.entityId ?? null,
      afterEntityId: itemAfter ? null : (itemBefore?.entityId ?? null),
    });
    await createPlacement({
      entityIds: [sourceData.entityId],
      boardId,
      sourceColumnId,
      columnId: targetColumnId,
      beforeEntityId: itemAfter?.entityId ?? null,
      afterEntityId: itemAfter ? null : (itemBefore?.entityId ?? null),
    });
  }

  return (
    <DragDropProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex justify-evenly">
        {sortedColumns.map((column) => {
          const columnPlacements = dragPlacements.filter(
            (placement) => placement.columnId === column.id,
          );

          return (
            <Column
              key={column.id}
              column={column}
              boardId={boardId}
              entities={entities}
              placements={columnPlacements}
            />
          );
        })}
      </div>
    </DragDropProvider>
  );
}
