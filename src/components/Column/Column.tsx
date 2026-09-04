import { usePlacement } from "../../hooks/usePlacement";
import { mockEntities } from "../../services/mockEntities";
import type { BoardId } from "../../types/board";
import type { ColumnType } from "../../types/column";
import PlacementList from "../Placement/PlacementList";
import ColumnHeader from "./ColumnHeader";

type Props = {
  column: ColumnType;
  boardId: BoardId;
};

export default function Column({ column, boardId }: Readonly<Props>) {
  const { data: columnData } = usePlacement(column.id);
  return (
    <section className="outline flex flex-col">
      <ColumnHeader column={column} />

      <PlacementList
        column={column}
        placements={columnData}
        entities={mockEntities}
        boardId={boardId}
      />
    </section>
  );
}
