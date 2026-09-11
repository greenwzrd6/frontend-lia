import type { EntityType } from "../../types/entity";
import type { ColumnType } from "../../types/column";
import PlacementList from "../Placement/PlacementList";
import ColumnHeader from "./ColumnHeader";
import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import { useDragDropManager } from "@dnd-kit/react";

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