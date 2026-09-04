import { mockEntities } from "../../services/mockEntities";
import type { BoardId } from "../../types/board";
import type { ColumnType } from "../../types/column";
import type { PlacementType } from "../../types/placement";
import Column from "./Column";
import EntityColumnMock from "./EntityColumnMock";

type Props = {
  columns: ColumnType[];
  placements: PlacementType[];
  boardId: BoardId;
};

export default function ColumnList({
  columns,
  boardId,
}: Readonly<Props>) {
  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  return (
    <div className="flex justify-evenly">
      <EntityColumnMock entities={mockEntities} />

      {sortedColumns.map((column) => {

        return (
          <Column
            key={column.id.id}
            column={column}
            boardId={boardId}
          />
        );
      })}
    </div>
  );
}
