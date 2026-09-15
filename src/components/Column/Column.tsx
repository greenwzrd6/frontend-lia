import type { EntityType } from "../../types/entity";
import type { ColumnType } from "../../types/column";
import PlacementList from "../Placement/PlacementList";
import ColumnHeader from "./ColumnHeader";
import { useDroppable } from "@dnd-kit/react";
import { useColumn } from "../../hooks/useColumn";
import type { PlacementType } from "../../types/placement";

type Props = {
  column: ColumnType;
  boardId: string;
  entities: EntityType[];
  dragPlacements?: PlacementType[];
};

export default function Column({
  column,
  boardId,
  entities,
  dragPlacements,
}: Readonly<Props>) {
  const { data: columnData = [] } = useColumn(column, boardId, entities, {
    enabled: !!column && !!boardId && entities.length > 0,
  });

  const placements = dragPlacements ?? columnData;

  const { ref } = useDroppable({
    id: column.id,
    accept: "card",
    data: {
      type: "column",
      columnId: column.id,
    },
  });

  return (
    <section ref={ref} className="flex flex-col w-75 hover:bg-gray-100">
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
