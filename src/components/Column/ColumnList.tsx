import { useQueryClient } from "@tanstack/react-query";
import { useBoardHub } from "../../hooks/useBoardHub";
import type { ColumnType } from "../../types/column";
import type { PlacementType } from "../../types/placement";
import Column from "./Column";
import { invalidateColumnPlacements } from "../../hooks/usePlacement";

type Props = {
  columns: ColumnType[];
  placements: PlacementType[];
  boardId: string;
};

export default function ColumnList({ columns, boardId }: Readonly<Props>) {
  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  const queryClient = useQueryClient();

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
    <div className="flex justify-evenly">
      {sortedColumns.map((column) => {
        return <Column key={column.id} column={column} boardId={boardId} />;
      })}
    </div>
  );
}
