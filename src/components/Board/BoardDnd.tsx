import { useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  DragDropProvider,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";

import { useBoardHub } from "../../hooks/useBoardHub";
import { useMovePlacement } from "../../hooks/useMovePlacement";
import { usePlacements } from "../../hooks/usePlacements";
import { placementKeys } from "../../utils/queryKeys";
import type { ColumnType } from "../../types/column";
import type { EntityType } from "../../types/entity";
import type { PlacementType } from "../../types/placement";
import DndColumn from "../Column/DndColumn";

type Items = Record<string, string[]>;

type Props = {
  columns: ColumnType[];
  boardId: string;
  entities: EntityType[];
};

export default function BoardDnd({
  columns,
  boardId,
  entities,
}: Readonly<Props>) {
  const queryClient = useQueryClient();
  const { mutateAsync: movePlacement } = useMovePlacement();

  const sortedColumns = useMemo(
    () => [...columns].sort((a, b) => a.position - b.position),
    [columns],
  );

  const entitiesById = useMemo(() => {
    const map = new Map<string, EntityType>();
    for (const entity of entities) map.set(entity.Id, entity);
    return map;
  }, [entities]);

  // Seeds the per-column caches and creates any missing placements once.
  const bootstrap = usePlacements(entities, boardId, columns);

  // --- Interaction state ---------------------------------------------------
  // Non-null only while a drag is in flight. This is the ONLY place the live
  // drag order lives; the query cache is never touched until the drop. No
  // per-frame cache churn, no "which cache is authoritative mid-drag" bugs.
  const [dragItems, setDragItems] = useState<Items | null>(null);
  const dragStart = useRef<Items>({});

  const readCacheItems = (): Items => {
    const items: Items = {};
    for (const column of sortedColumns) {
      const placements =
        queryClient.getQueryData<PlacementType[]>(
          placementKeys.byColumnId(column.id),
        ) ?? [];
      items[column.id] = placements.map((placement) => placement.entityId);
    }
    return items;
  };

  useBoardHub((event) => {
    if (dragItems) return; // don't fight an in-flight local drag

    const affected = new Set(
      [event.sourceColumnId, event.targetColumnId].filter(
        (id): id is string => !!id,
      ),
    );
    for (const columnId of affected) {
      queryClient.invalidateQueries({
        queryKey: placementKeys.byColumnId(columnId),
        exact: true,
      });
    }
  });

  function handleDragStart() {
    const items = readCacheItems();
    dragStart.current = items;
    setDragItems(items);
  }

  function handleDragOver(event: DragOverEvent) {
    setDragItems((prev) => {
      if (!prev) {
        return prev;
      }

      const { source, target } = event.operation;

      if (!source || !target) {
        return prev;
      }

      if (target.data?.type !== "column") {
        return move(prev, event);
      }

      const entityId = String(source.id);
      const targetColumnId = String(target.data.columnId);

      const current = locate(prev, entityId);

      if (!current) {
        return prev;
      }

      const next = { ...prev };

      // Ta bort kortet från kolumnen där det ligger just nu
      next[current.columnId] = prev[current.columnId].filter(
        (id) => id !== entityId,
      );

      // Lägg kortet SIST i target-kolumnen
      next[targetColumnId] = [
        ...next[targetColumnId].filter((id) => id !== entityId),
        entityId,
      ];

      return next;
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const items = dragItems;

    // A no-op drop (canceled, or dropped where it started) can release the
    // override immediately — nothing to persist, cache is already correct.
    if (event.canceled || !items) {
      setDragItems(null);
      return;
    }

    const { source } = event.operation;
    if (!isSortable(source)) {
      setDragItems(null);
      return;
    }

    const entityId = String(source.id);

    // Derive origin from our own pre-drag snapshot, not from the library — a
    // cross-column move remounts the sortable and resets source.initialGroup.
    const from = locate(dragStart.current, entityId);
    const to = locate(items, entityId);
    if (
      !to ||
      (from?.columnId === to.columnId && from.index === to.index)
    ) {
      setDragItems(null);
      return;
    }

    const targetIds = items[to.columnId] ?? [];
    const itemAfter = targetIds[to.index + 1];
    const itemBefore = targetIds[to.index - 1];

    // Only the columns that actually changed need an optimistic write.
    const order: Items = { [to.columnId]: targetIds };
    if (from && from.columnId !== to.columnId) {
      order[from.columnId] = items[from.columnId];
    }

    try {
      // Pin the local order until the mutation settles. onMutate writes the
      // cache, so by the time we release the override the query data already
      // agrees — no frame ever renders the pre-move order (the revert flash).
      await movePlacement({
        request: {
          entityIds: [entityId],
          boardId,
          columnId: to.columnId,
          sourceColumnId: from ? from.columnId : null,
          beforeEntityId: itemAfter ?? null,
          afterEntityId: itemAfter ? null : (itemBefore ?? null),
        },
        order,
      });
    } catch {
      // onError already rolled the caches back to the pre-drag snapshot.
    } finally {
      // Always release, even on failure, so the (rolled-back) cache shows.
      setDragItems(null);
    }
  }

  return (
    <DragDropProvider
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex justify-evenly">
        {sortedColumns.map((column) => {
          // Only hand a column its live drag order if that order has actually
          // diverged from the pre-drag snapshot. `move()` preserves the array
          // reference for every group it didn't touch, so an untouched column
          // compares === here and keeps rendering from its own cache — it never
          // re-renders during the drag. Memoized DndColumn does the rest: only
          // the source/target column(s) re-render per pointer frame, regardless
          // of how many columns or cards the board holds.
          const liveOrder = dragItems?.[column.id];
          const orderedIds =
            liveOrder && liveOrder !== dragStart.current[column.id]
              ? liveOrder
              : undefined;

          return (
            <DndColumn
              key={column.id}
              column={column}
              boardId={boardId}
              entitiesById={entitiesById}
              enabled={bootstrap.isSuccess}
              orderedIds={orderedIds}
            />
          );
        })}
      </div>
    </DragDropProvider>
  );
}

function locate(
  items: Items,
  entityId: string,
): { columnId: string; index: number } | null {
  for (const columnId of Object.keys(items)) {
    const index = items[columnId].indexOf(entityId);
    if (index !== -1) return { columnId, index };
  }
  return null;
}
