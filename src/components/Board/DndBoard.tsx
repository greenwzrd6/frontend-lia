import { useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
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
  isEditMode?: boolean;
};

export default function DndBoard({
  columns,
  boardId,
  entities,
  isEditMode = false,
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

  const bootstrap = usePlacements(entities, boardId, columns);

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
    if (dragItems) return;

    const affected = new Set(
      event.changes.flatMap((change) =>
        [change.sourceColumnId, change.targetColumnId].filter(
          (id): id is string => !!id,
        ),
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

  async function handleDragEnd(event: DragEndEvent) {
    const items = dragItems;

    if (event.canceled || !items) {
      setDragItems(null);
      return;
    }

    const { source, target } = event.operation;
    if (!isSortable(source)) {
      setDragItems(null);
      return;
    }

    if (!target) {
      setDragItems(null);
      return;
    }

    const entityId = String(source.id);

    const from = locate(dragStart.current, entityId);
    const to = locate(items, entityId);

    if (!to || (from?.columnId === to.columnId && from.index === to.index)) {
      setDragItems(null);
      return;
    }

    const targetColumn = columns.find((column) => column.id === to.columnId);

    if (!targetColumn?.requestWritable) {
      setDragItems(null);
      return;
    }

    const targetIds = items[to.columnId] ?? [];

    const entitiesBefore = targetIds.slice(0, to.index);
    const entitiesAfter = targetIds.slice(to.index + 1);

    let beforeEntityIds: string[] = [];
    let afterEntityIds: string[] = [];

    if (entitiesAfter.length > 0) {
      beforeEntityIds = entitiesAfter;
    } else {
      afterEntityIds = entitiesBefore;
    }

    const order: Items = { [to.columnId]: targetIds };
    if (from && from.columnId !== to.columnId) {
      order[from.columnId] = items[from.columnId];
    }

    try {
      await movePlacement({
        request: {
          entityIds: [entityId],
          boardId,
          columnId: to.columnId,
          sourceColumnId: from ? from.columnId : null,
          beforeEntityIds,
          afterEntityIds,
        },
        order,
      });
    } finally {
      setDragItems(null);
    }
  }

  return (
    <DragDropProvider
      onDragStart={handleDragStart}
      onDragOver={(event) =>
        setDragItems((prev) => (prev ? move(prev, event) : prev))
      }
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full min-h-0 items-start overflow-hidden justify-evenly">
        {sortedColumns.map((column, index) => {
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
              isEditMode={isEditMode}
              autoFocus={index === 0}
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
