import { useQueryClient } from "@tanstack/react-query";
import { DragDropProvider } from "@dnd-kit/react";

import type { ColumnType } from "../../types/column";
import type { PlacementType } from "../../types/placement";
import type { EntityType } from "../../types/entity";
import Column from "./Column";
import { invalidateColumnPlacements } from "../../hooks/usePlacement";
import { useBoardHub } from "../../hooks/useBoardHub";

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
}: Readonly<Props>) {
  const queryClient = useQueryClient();

  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  function handleDragEnd(dragEvent: any) {
    if (dragEvent.canceled) {
      return;
    }
    const { source, target } = dragEvent.operation;

    console.log("SOURCE:", source);
    console.log("TARGET:", target);
  }

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

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
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
