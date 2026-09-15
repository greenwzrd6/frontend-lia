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

  const [dragPlacements, setDragPlacements] = useState<
    Record<string, PlacementType[]>
  >({});

  const placementsSnapshot = useRef<Record<string, PlacementType[]>>({});

  useBoardHub(async (event) => {
    const { sourceColumnId, targetColumnId } = event;

    console.log("SIGNALR PlacementCreated:", {
      sourceColumnId,
      targetColumnId,
    });

    if (sourceColumnId === targetColumnId) {
      console.log("SAME COLUMN - invalidating:", sourceColumnId);

      await queryClient.invalidateQueries({
        queryKey: placementKeys.byColumnId(targetColumnId),
        exact: true,
      });

      console.log("SAME COLUMN - invalidate/refetch finished:", targetColumnId);
      // if (!isDragging.current) {
      //   setDragPlacements({});
      // }

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

    // if (!isDragging.current) {
    //   setDragPlacements({});
    // }
  });

  function handleDragStart(event: any) {
    isDragging.current = true;

    sourceParentRef.current =
      event.operation.source?.element?.parentElement ?? null;

    const columnPlacements: Record<string, PlacementType[]> = {};
    columns.forEach((column) => {
      queryClient
        .getQueryData<PlacementType[]>(placementKeys.byColumnId(column.id))
        ?.forEach((p) => {
          if (columnPlacements[column.id]) columnPlacements[column.id].push(p);
          else columnPlacements[column.id] = [p];
        });
    });

    placementsSnapshot.current = structuredClone(columnPlacements);
    setDragPlacements(columnPlacements);
  }

  async function handleDragEnd(dragEvent: any) {
    const sourceElement = dragEvent.operation.source?.element;

    const previousParent = sourceParentRef.current;

    sourceParentRef.current = null;

    // if (
    //   sourceElement &&
    //   previousParent &&
    //   sourceElement.parentElement !== previousParent
    // ) {
    //   previousParent.appendChild(sourceElement);
    // }

    isDragging.current = false;

    if (dragEvent.canceled) {
      setDragPlacements(placementsSnapshot.current);
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
      setDragPlacements(placementsSnapshot.current);
      return;
    }

    const targetColumnPlacements = dragPlacements[targetColumnId];

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

        const sourcePlacements = currentPlacements[sourceColumnId].filter(
          (placement) => placement.columnId === sourceColumnId,
        );

        const targetPlacements =
          sourceColumnId === targetColumnId
            ? sourcePlacements
            : currentPlacements[targetColumnId].filter(
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

          // const unaffectedPlacements = currentPlacements.filter(
          //   (placement) => placement.columnId !== sourceColumnId,
          // );

          currentPlacements[sourceColumnId] = reordered;

          return currentPlacements;
        }

        const newSourcePlacements = sourcePlacements.filter(
          (placement) => placement.entityId !== movedPlacement.entityId,
        );

        const newTargetPlacements = [...targetPlacements];

        newTargetPlacements.splice(targetIndex, 0, {
          ...movedPlacement,
          columnId: targetColumnId,
        });

        // const unaffectedPlacements = currentPlacements.filter(
        //   (placement) =>
        //     placement.columnId !== sourceColumnId &&
        //     placement.columnId !== targetColumnId,
        // );

        currentPlacements[sourceColumnId] = newSourcePlacements;
        currentPlacements[targetColumnId] = newTargetPlacements;

        return currentPlacements;
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
    // setDragPlacements({});
  }

  return (
    <DragDropProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex justify-evenly">
        {sortedColumns.map((column) => {
          return (
            <Column
              key={column.id}
              column={column}
              boardId={boardId}
              entities={entities}
              dragPlacements={dragPlacements[column.id]}
            />
          );
        })}
      </div>
    </DragDropProvider>
  );
}
