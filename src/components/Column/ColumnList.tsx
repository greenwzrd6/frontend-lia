import { mockEntities } from "../../services/mockEntities";
import type { ColumnType } from "../../types/column";
import type { PlacementType } from "../../types/placement";
import Column from "./Column";
import EntityColumnMock from "./EntityColumnMock";

type Props = {
  columns: ColumnType[];
  placements: PlacementType[];
  boardId: string;
};

export default function ColumnList({ columns, placements, boardId }: Readonly<Props>) {
  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  return (
    <div className="flex justify-evenly">
      <EntityColumnMock entities={mockEntities} />

      {sortedColumns.map((column) => {
        const columnPlacements = placements.filter(
          (placement) => placement.columnId === column.id,
        );

        return (
          <Column
            key={column.id}
            column={column}
            placements={columnPlacements}
            boardId={boardId}
          />
        );
      })}
    </div>
  );
}
