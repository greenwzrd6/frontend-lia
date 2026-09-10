import type { EntityType } from "../../types/entity";
import type { ColumnType } from "../../types/column";
import type { PlacementType } from "../../types/placement";
import PlacementList from "../Placement/PlacementList";
import ColumnHeader from "./ColumnHeader";

type Props = {
  column: ColumnType;
  boardId: string;
  entities: EntityType[];
  placements: PlacementType[];
};

export default function Column({
  column,
  boardId,
  entities,
  placements,
}: Readonly<Props>) {
  return (
    <section className="flex flex-col w-75 hover:bg-gray-100" >
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