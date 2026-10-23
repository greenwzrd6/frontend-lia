import { useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  DragDropProvider,
  DragOverlay,
  type DragEndEvent,
} from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";

import { useBoardHub } from "../../hooks/useBoardHub";
import { useCreatePlacement } from "../../hooks/useCreatePlacement";
import { usePlacements } from "../../hooks/usePlacements";
import { placementKeys } from "../../utils/queryKeys";
import { isReleasedColumn } from "../../utils/isReleasedColumn";
import type { ColumnType } from "../../types/column";
import type { TaskType } from "../../types/task";
import type { PlacementType } from "../../types/placement";
import DndColumn from "../Column/DndColumn";

type Items = Record<string, string[]>;

const RECENT_DROP_TTL_MS = 3000;

type Props = {
  columns: ColumnType[];
  boardId: string;
  entities: TaskType[];
  isEditMode?: boolean;
};

export default function DndBoard({
  columns,
  boardId,
  entities,
  isEditMode = false,
}: Readonly<Props>) {
  const queryClient = useQueryClient();
  const { mutateAsync: createPlacement } = useCreatePlacement();
  const recentDropsRef = useRef<Map<string, number>>(new Map());

  const sortedColumns = useMemo(
    () => [...columns].sort((a, b) => a.position - b.position),
    [columns],
  );

  const entitiesById = useMemo(() => {
    const map = new Map<string, TaskType>();
    for (const entity of entities) map.set(entity.id, entity);
    return map;
  }, [entities]);

  const bootstrap = usePlacements(entities, boardId, columns);

  const [dragItems, setDragItems] = useState<Items | null>(null);
  const [dragStart, setDragStart] = useState<Items>({});

  const readCacheItems = (): Items => {
    const items: Items = {};
    for (const column of sortedColumns) {
      const placements =
        queryClient.getQueryData<PlacementType[]>(
          placementKeys.byColumnId(column.id),
        ) ?? [];
      items[column.id] = placements
        .filter((placement) => entitiesById.has(placement.entityId))
        .map((placement) => placement.entityId);
    }
    return items;
  };

  useBoardHub(boardId, (event) => {
    const affected = new Set(
      event.changes.flatMap((change) =>
        [change.sourceColumnId, change.targetColumnId].filter(
          (id): id is string => !!id,
        ),
      ),
    );

    // const now = Date.now();
    // const isOwnDrop = event.entityIds.some(
    //   (entityId) => (recentDropsRef.current.get(entityId) ?? 0) > now,
    // );

    // if (!isOwnDrop) {
      for (const columnId of affected) {
        void queryClient.invalidateQueries({
          queryKey: placementKeys.byColumnId(columnId),
          exact: true,
        });
      }
    // }
  });

  function handleDragStart() {
    const items = readCacheItems();
    setDragStart(items);
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

    const from = locate(dragStart, entityId)
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

    const expiresAt = Date.now() + RECENT_DROP_TTL_MS;
    for (const [id, expiry] of recentDropsRef.current) {
      if (expiry <= Date.now()) recentDropsRef.current.delete(id);
    }
    recentDropsRef.current.set(entityId, expiresAt);

    try {
      await createPlacement({
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
      onDragEnd={(event) => {
        void handleDragEnd(event);
      }}
    >
      <div className="flex h-full min-h-0 items-start overflow-hidden justify-evenly">
        {sortedColumns.map((column, index) => {
          const liveOrder = dragItems?.[column.id];
          const orderedIds =
            liveOrder && liveOrder !== dragStart[column.id]
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

      <DragOverlay className="z-50" dropAnimation={null}>
        {(source) => {
          const entity = entitiesById.get(String(source.id));

          if (!entity) return null;

          const hovered = dragItems
            ? locate(dragItems, String(source.id))
            : null;

          const hoveredColumn = hovered
            ? columns.find((column) => column.id === hovered.columnId)
            : undefined;

          const isOverReleased =
            hoveredColumn != null && isReleasedColumn(hoveredColumn);

          return (
            <article
              className={`flex flex-row items-center justify-center rounded-2xl p-5 border shadow-lg
                ${isOverReleased ? "bg-green-100 border-green-500" : "bg-white border-gray-200"}`}
            >
              <h3>{entity.title}</h3>
            </article>
          );
        }}
      </DragOverlay>
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
