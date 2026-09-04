import { useQueryClient } from "@tanstack/react-query";
import { useBoardHub } from "../../hooks/useBoardHub";
import { invalidateColumnPlacements } from "../../hooks/usePlacement";
import { mockEntities } from "../../services/mockEntities";
import type { BoardId } from "../../types/board";
import type { ColumnId, ColumnType } from "../../types/column";
import type { PlacementType } from "../../types/placement";
import Column from "./Column";
import EntityColumnMock from "./EntityColumnMock";

type Props = {
  columns: ColumnType[];
  placements: PlacementType[];
  boardId: BoardId;
};

export default function ColumnList({ columns, boardId }: Readonly<Props>) {
  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  const queryClient = useQueryClient();

  const columnIds: ColumnId[] = columns.map((column) => column.id);

  useBoardHub(() => invalidateColumnPlacements(queryClient, columnIds));

  return (
    <div className="flex justify-evenly">
      <EntityColumnMock entities={mockEntities} />

      {sortedColumns.map((column) => {
        return <Column key={column.id.id} column={column} boardId={boardId} />;
      })}
    </div>
  );
}
