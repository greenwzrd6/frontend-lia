import { useQueryClient } from "@tanstack/react-query";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import type { ColumnType } from "../../types/column";
import type { EntityType } from "../../types/entity";
import type { PlacementType } from "../../types/placement";

import Column from "./Column";
import { useBoardHub } from "../../hooks/useBoardHub";
import { createPlacement } from "../../services/placementApi";
import { placementKeys } from "../../utils/queryKeys";

type Props = {
  columns: ColumnType[];
  boardId: string;
  entities: EntityType[];
};

export default function ColumnList({
  columns,
  boardId,
  entities,
}: Readonly<Props>) {
  const queryClient = useQueryClient();

  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  const isDragging = useRef(false);

  const sourceParentRef = useRef<Element | null>(null);

  const [dragPlacements, setDragPlacements] = useState<PlacementType[] | null>(
    null,
  );

  useBoardHub(async (event) => {
    const { sourceColumnId, targetColumnId } = event;

    if (sourceColumnId === targetColumnId) {
      await queryClient.invalidateQueries({
        queryKey: placementKeys.byColumnId(targetColumnId),
        exact: true,
      });

      if (!isDragging.current) {
        setDragPlacements(null);
      }

      return;
    }

    // Invalidate and refetch sourceColumn
    if (sourceColumnId) {
      await queryClient.invalidateQueries({
        queryKey: placementKeys.byColumnId(sourceColumnId),
        exact: true,
      });
    }

    // when source is done, invalidate and refetch targetColumn
    await queryClient.invalidateQueries({
      queryKey: placementKeys.byColumnId(targetColumnId),
      exact: true,
    });

    if (!isDragging.current) {
      setDragPlacements(null);
    }
  });

  function handleDragStart(event: any) {
    isDragging.current = true;

    sourceParentRef.current =
      event.operation.source?.element?.parentElement ?? null;

    const placements = columns.flatMap((column) => {
      const columnPlacements =
        queryClient.getQueryData<PlacementType[]>(
          placementKeys.byColumnId(column.id),
        ) ?? [];

      return columnPlacements.filter((placement) =>
        entities.some((entity) => entity.Id === placement.entityId),
      );
    });

    setDragPlacements(placements);
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
      setDragPlacements(null);
      return;
    }

    if (!dragPlacements) {
      return;
    }

    const { source, target } = dragEvent.operation;

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
      setDragPlacements(null);
      return;
    }

    const targetColumnPlacements = dragPlacements.filter(
      (placement) => placement.columnId === targetColumnId,
    );

    const otherPlacements = targetColumnPlacements.filter(
      (placement) => placement.entityId !== sourceData.entityId,
    );

    const targetIndex =
      target?.data?.type === "column" ? otherPlacements.length : index;

    const itemAfter = otherPlacements[targetIndex];

    const itemBefore =
      targetIndex > 0 ? otherPlacements[targetIndex - 1] : undefined;

    flushSync(() => {
      setDragPlacements((currentPlacements) => {
        if (!currentPlacements) {
          return currentPlacements;
        }

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
          const columnDragPlacements = dragPlacements?.filter(
            (placement) => placement.columnId === column.id,
          );
          return (
            <Column
              key={column.id}
              column={column}
              boardId={boardId}
              entities={entities}
              dragPlacements={columnDragPlacements}
            />
          );
        })}
      </div>
    </DragDropProvider>
  );
}
