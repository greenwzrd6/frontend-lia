import { useQueryClient } from "@tanstack/react-query";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { useRef } from "react";
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

  const sortedColumns = [...columns].sort(
    (a, b) => a.position - b.position,
  );

  const sourceParentRef = useRef<Element | null>(null);

  useBoardHub(async (event) => {
    const { sourceColumnId, targetColumnId } = event;

    if (sourceColumnId === targetColumnId) {
      await queryClient.invalidateQueries({
        queryKey: placementKeys.byColumnId(targetColumnId),
        exact: true,
      });

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
  });

  function handleDragStart(event: any) {
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

    if (dragEvent.canceled) {
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

    if (
      sourceColumnId === targetColumnId &&
      initialIndex === index
    ) {
      return;
    }

    // Get placements directly from tanstack cache 
    const sourcePlacements =
      queryClient.getQueryData<PlacementType[]>(
        placementKeys.byColumnId(sourceColumnId),
      ) ?? [];

    const targetPlacements =
      sourceColumnId === targetColumnId
        ? sourcePlacements
        : queryClient.getQueryData<PlacementType[]>(
              placementKeys.byColumnId(targetColumnId),
            ) ?? [];

    const otherPlacements = targetPlacements.filter(
      (placement) =>
        placement.entityId !== sourceData.entityId,
    );

    const targetIndex =
      target?.data?.type === "column" &&
      otherPlacements.length === 0
        ? 0
        : index;

    const itemAfter = otherPlacements[targetIndex];

    const itemBefore =
      targetIndex > 0
        ? otherPlacements[targetIndex - 1]
        : undefined;

    const movedPlacement = sourcePlacements.find(
      (placement) =>
        placement.entityId === sourceData.entityId,
    );

    if (!movedPlacement) {
      return;
    }

    // optimistic update of tanstack cache.
    flushSync(() => {
      if (sourceColumnId === targetColumnId) {
        const reordered = [...sourcePlacements];

        const [removed] = reordered.splice(initialIndex, 1);
        reordered.splice(index, 0, removed);

        queryClient.setQueryData(
          placementKeys.byColumnId(sourceColumnId),
          reordered,
        );

        return;
      }

      const newSourcePlacements = sourcePlacements.filter(
        (placement) =>
          placement.entityId !== movedPlacement.entityId,
      );

      const newTargetPlacements = [...targetPlacements];

      newTargetPlacements.splice(targetIndex, 0, {
        ...movedPlacement,
        columnId: targetColumnId,
      });

      queryClient.setQueryData(
        placementKeys.byColumnId(sourceColumnId),
        newSourcePlacements,
      );

      queryClient.setQueryData(
        placementKeys.byColumnId(targetColumnId),
        newTargetPlacements,
      );
    });

    await createPlacement({
      entityIds: [sourceData.entityId],
      boardId,
      sourceColumnId,
      columnId: targetColumnId,
      beforeEntityId: itemAfter?.entityId ?? null,
      afterEntityId: itemAfter
        ? null
        : (itemBefore?.entityId ?? null),
    });
  }

  return (
    <DragDropProvider
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
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
    </DragDropProvider>
  );
}