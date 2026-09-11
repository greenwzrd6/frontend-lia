import type { EntityType } from "../../types/entity";
import type { ColumnType } from "../../types/column";
import type { PlacementType } from "../../types/placement";
import PlacementList from "../Placement/PlacementList";
import ColumnHeader from "./ColumnHeader";
import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";

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
  
  const { ref } = useDroppable({
  id: column.id,
  accept: "card",
  collisionPriority: CollisionPriority.Low,
  data: {
    type: "column",
    columnId: column.id,
  },
});

  return (
    <section ref={ref} className="flex flex-col w-75 hover:bg-gray-100" >
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