import type { EntityType } from "../../types/entity";
import type { ColumnType } from "../../types/column";
import PlacementList from "../Placement/PlacementList";
import ColumnHeader from "./ColumnHeader";
import { usePlacement } from "../../hooks/usePlacement";

type Props = {
  column: ColumnType;
  boardId: string;
  entities: EntityType[];
};

export default function Column({
  column,
  boardId,
  entities,
}: Readonly<Props>) {
  const { data: placements = [] } =
    usePlacement(column.id, boardId);

  return (
    <section className="outline flex flex-col w-75">
      <ColumnHeader column={column} />

      <PlacementList
        column={column}
        placements={placements}
        entities={entities}
        boardId={boardId}
      />
    </section>
  );
}